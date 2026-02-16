"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePreferences } from "@/lib/api";
import { writeCachedPreferences } from "@/lib/local-cache";
import type { PreferencesPayload } from "@/lib/types";

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PreferencesPayload) => updatePreferences(payload),
    onSuccess: (_, payload) => {
      writeCachedPreferences(payload);
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["companies"] });
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
