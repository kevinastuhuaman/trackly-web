"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/lib/api";

const LAST_JOBS_OPENED_KEY = "trackly_last_jobs_opened";

export function useNewJobsCount() {
  const lastOpenedAt = typeof window === "undefined" ? 0 : Number(window.localStorage.getItem(LAST_JOBS_OPENED_KEY) || "0");

  const query = useQuery({
    queryKey: ["jobs", "new-count"],
    queryFn: () => getJobs({ sort: "newest", limit: 100, offset: 0 }),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const count = useMemo(() => {
    if (!lastOpenedAt) return 0;
    const jobs = query.data?.jobs ?? [];
    return jobs.filter((job) => {
      const postedAt = new Date(job.postedAt ?? job.firstSeenAt ?? 0).getTime();
      return postedAt > lastOpenedAt;
    }).length;
  }, [lastOpenedAt, query.data?.jobs]);

  return { count, isLoading: query.isLoading };
}
