"use client";

import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, postJobAction } from "@/lib/api";
import type { Job, JobAction, JobsQuery, JobsResponse } from "@/lib/types";

const LIMIT = 50;

function statusFromAction(action: JobAction): Job["userStatus"] {
  switch (action) {
    case "apply_now":
      return "applying";
    case "confirm_applied":
      return "applied_confirmed";
    case "check_later":
      return "check_later";
    case "not_interested":
      return "not_interested";
    case "undo":
      return null;
    default:
      return null;
  }
}

export function useJobs(query: JobsQuery) {
  return useInfiniteQuery({
    queryKey: ["jobs", query],
    queryFn: ({ pageParam }) => getJobs({ ...query, limit: LIMIT, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length * LIMIT : undefined),
  });
}

export function useJobAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, action }: { jobId: number; action: JobAction }) => postJobAction(jobId, action),
    onMutate: async ({ jobId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      await queryClient.cancelQueries({ queryKey: ["job-detail", jobId] });

      const previousJobs = queryClient.getQueriesData<InfiniteData<JobsResponse>>({ queryKey: ["jobs"] });
      const previousDetail = queryClient.getQueryData<Job>(["job-detail", jobId]);
      const nextStatus = statusFromAction(action);
      const statusUpdatedAt = new Date().toISOString();

      previousJobs.forEach(([key]) => {
        queryClient.setQueryData<InfiniteData<JobsResponse>>(key, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              jobs: page.jobs.map((job) =>
                job.id === jobId ? { ...job, userStatus: nextStatus, statusUpdatedAt } : job
              ),
            })),
          };
        });
      });

      if (previousDetail) {
        queryClient.setQueryData<Job>(["job-detail", jobId], {
          ...previousDetail,
          userStatus: nextStatus,
          statusUpdatedAt,
        });
      }

      return { previousJobs, previousDetail, jobId };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      context.previousJobs.forEach(([key, snapshot]) => {
        queryClient.setQueryData(key, snapshot);
      });
      if (context.previousDetail) {
        queryClient.setQueryData(["job-detail", context.jobId], context.previousDetail);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["job-detail"] });
      void queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });
}
