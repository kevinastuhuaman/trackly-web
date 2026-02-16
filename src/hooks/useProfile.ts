"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteResume, getProfile, updateProfile, uploadResume } from "@/lib/api";
import { readCachedProfile, writeCachedProfile } from "@/lib/local-cache";
import type { Profile } from "@/lib/types";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await getProfile();
        if (response.profile) {
          writeCachedProfile(response.profile);
        }
        return response;
      } catch (error) {
        const cached = readCachedProfile();
        if (cached) {
          return { profile: cached, success: true };
        }
        throw error;
      }
    },
    staleTime: Infinity,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Profile>) => updateProfile(payload),
    onSuccess: (_, payload) => {
      const existing = queryClient.getQueryData<{ profile?: Profile }>(["profile"])?.profile;
      writeCachedProfile({ ...(existing ?? {}), ...payload });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    []
  );

  const mutation = useMutation({
    mutationFn: (file: File) => {
      setProgress(0);
      return uploadResume(file, (nextProgress) => setProgress(nextProgress));
    },
    onSuccess: () => {
      setProgress(100);
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      setProgress(0);
    },
    onSettled: () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => setProgress(0), 1000);
    },
  });

  return { ...mutation, progress };
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteResume(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
