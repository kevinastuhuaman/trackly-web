"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTrackerNote, createTrackerReminder, getTrackerFocus, getTrackerJobs, getTrackerSummary, moveTrackerStage } from "@/lib/api";
import type { TrackerStageApi } from "@/lib/types";

export function useTrackerSummary() {
  return useQuery({ queryKey: ["tracker", "summary"], queryFn: getTrackerSummary });
}

export function useTrackerJobs(stage: TrackerStageApi) {
  return useQuery({ queryKey: ["tracker", "jobs", stage], queryFn: () => getTrackerJobs(stage) });
}

export function useTrackerFocus() {
  return useQuery({ queryKey: ["tracker", "focus"], queryFn: getTrackerFocus });
}

export function useMoveTrackerStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, stage }: { jobId: number; stage: TrackerStageApi }) => moveTrackerStage(jobId, stage),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tracker"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useBulkMoveTrackerStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobIds, stage }: { jobIds: number[]; stage: Exclude<TrackerStageApi, "all"> }) => {
      await Promise.all(jobIds.map((jobId) => moveTrackerStage(jobId, stage)));
      return { count: jobIds.length, stage };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tracker"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useCreateTrackerNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, noteText }: { jobId: number; noteText: string }) => createTrackerNote(jobId, noteText),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });
}

export function useCreateTrackerReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, dueAt, title }: { jobId: number; dueAt: string; title?: string }) =>
      createTrackerReminder(jobId, dueAt, title),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });
}
