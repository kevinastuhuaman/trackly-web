"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobDetail, markJobOpened } from "@/lib/api";

export function useJobDetail(id: number | null) {
  return useQuery({
    queryKey: ["job-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing job id");
      const detail = await getJobDetail(id);
      void markJobOpened(id).catch(() => undefined);
      return detail;
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
