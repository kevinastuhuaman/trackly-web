"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FilterBar, type JobFilters } from "@/components/jobs/FilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { JobDetail } from "@/components/jobs/JobDetail";
import { JobRow } from "@/components/jobs/JobRow";
import { JobsTable } from "@/components/jobs/JobsTable";
import { NewJobsBanner } from "@/components/jobs/NewJobsBanner";
import { ShortcutHints } from "@/components/jobs/ShortcutHints";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobDetail } from "@/hooks/useJobDetail";
import { useJobAction, useJobs } from "@/hooks/useJobs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { ApiError } from "@/lib/api";
import { readCachedPreferences } from "@/lib/local-cache";
import type { Job, JobAction, JobFunction } from "@/lib/types";

const defaultFilters: JobFilters = {
  locationFilter: "us",
  jobModality: "full_time",
  status: "all",
  sort: "newest",
  jobFunction: [],
};

const actionLabel: Record<JobAction, string> = {
  apply_now: "Applied",
  confirm_applied: "Marked applied",
  check_later: "Saved for later",
  not_interested: "Dismissed",
  undo: "Action undone",
};

const validStatuses = new Set(["all", "new", "applying", "applied_confirmed", "check_later", "not_interested"]);
const DESKTOP_VIEW_STORAGE_KEY = "trackly_jobs_desktop_view";
type DesktopView = "cards" | "table";

const validFunctions: JobFunction[] = [
  "product",
  "engineering",
  "design",
  "data",
  "marketing",
  "sales",
  "partnerships",
  "finance",
  "strategy",
  "operations",
  "people",
  "other",
];

function isJobFunction(value: string): value is JobFunction {
  return validFunctions.includes(value as JobFunction);
}

function parseFunctions(value: string | null) {
  if (!value) return [];
  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(isJobFunction)
    )
  );
}

function mergeFiltersFromUrl(params: URLSearchParams, fallback: JobFilters): JobFilters {
  const location = params.get("location");
  const modality = params.get("modality");
  const status = params.get("status");
  const sort = params.get("sort");
  const functions = params.get("function");

  return {
    locationFilter: location === "us" || location === "non_us" ? location : location === "all" ? "" : fallback.locationFilter,
    jobModality: modality === "all" || modality === "full_time" || modality === "internship" ? modality : fallback.jobModality,
    status: status && validStatuses.has(status) ? status : fallback.status,
    sort: sort === "newest" || sort === "match" ? sort : fallback.sort,
    jobFunction: functions !== null ? parseFunctions(functions) : fallback.jobFunction,
  };
}

function filtersToSearchParams(filters: JobFilters) {
  const params = new URLSearchParams();
  params.set("location", filters.locationFilter || "all");
  params.set("modality", filters.jobModality);
  params.set("status", filters.status);
  params.set("sort", filters.sort);
  if (filters.jobFunction.length) {
    params.set("function", filters.jobFunction.join(","));
  }
  return params;
}

export default function JobsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<JobFilters>(() => {
    if (typeof window === "undefined") return defaultFilters;
    const cached = readCachedPreferences();
    const fallback: JobFilters = {
      ...defaultFilters,
      locationFilter: cached?.locationFilter ?? defaultFilters.locationFilter,
      jobModality: cached?.jobModality ?? defaultFilters.jobModality,
      jobFunction: cached?.wantedJobFunctions ?? defaultFilters.jobFunction,
    };
    return mergeFiltersFromUrl(new URLSearchParams(window.location.search), fallback);
  });
  const [debouncedFilters, setDebouncedFilters] = useState<JobFilters>(filters);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [desktopView, setDesktopView] = useState<DesktopView>(() => {
    if (typeof window === "undefined") return "cards";
    return window.localStorage.getItem(DESKTOP_VIEW_STORAGE_KEY) === "table" ? "table" : "cards";
  });
  const [lastOpen] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(window.localStorage.getItem("trackly_last_jobs_opened") || "0");
  });
  const isOnline = useNetworkStatus();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const jobsQuery = useJobs(debouncedFilters);
  const action = useJobAction();
  const activeJobId = selectedJobId ?? (jobsQuery.data?.pages.flatMap((page) => page.jobs)[0]?.id ?? null);
  const jobDetail = useJobDetail(activeJobId);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedFilters(filters), 300);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    const nextSearch = filtersToSearchParams(filters).toString();
    const currentSearch = searchParams.toString();
    if (nextSearch === currentSearch) return;
    const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [filters, pathname, router, searchParams]);

  useEffect(() => {
    window.localStorage.setItem("trackly_last_jobs_opened", String(Date.now()));
  }, []);

  const jobs = useMemo(() => jobsQuery.data?.pages.flatMap((page) => page.jobs) ?? [], [jobsQuery.data?.pages]);

  const newCount = useMemo(() => {
    if (!lastOpen) return 0;
    return jobs.filter((job) => {
      const base = new Date(job.postedAt ?? job.firstSeenAt ?? 0).getTime();
      return base > lastOpen;
    }).length;
  }, [jobs, lastOpen]);
  const hasConnectionIssue = !isOnline || Boolean(jobsQuery.error);

  const updateDesktopView = (nextView: DesktopView) => {
    setDesktopView(nextView);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DESKTOP_VIEW_STORAGE_KEY, nextView);
    }
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const target = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && jobsQuery.hasNextPage && !jobsQuery.isFetchingNextPage) {
          void jobsQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [jobsQuery]);

  const handleAction = useCallback((job: Job, nextAction: JobAction) => {
    action.mutate(
      { jobId: job.id, action: nextAction },
      {
        onSuccess: () => {
          if (nextAction === "undo") {
            toast.success(actionLabel[nextAction]);
            return;
          }

          toast.success(actionLabel[nextAction], {
            action: {
              label: "Undo",
              onClick: () => {
                action.mutate({ jobId: job.id, action: "undo" });
              },
            },
          });
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 429) {
            toast.error("Slow down. You’re taking actions too quickly.");
            return;
          }
          toast.error("Unable to update job");
        },
      }
    );
  }, [action]);

  useEffect(() => {
    if (!desktop || !jobs.length) return;
    const handleKeydown = (event: KeyboardEvent) => {
      const index = jobs.findIndex((job) => job.id === activeJobId);
      if (event.key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        const next = jobs[Math.min(index + 1, jobs.length - 1)] ?? jobs[0];
        setSelectedJobId(next.id);
      }
      if (event.key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        const next = jobs[Math.max(index - 1, 0)] ?? jobs[0];
        setSelectedJobId(next.id);
      }
      if (event.key === "Enter" && activeJobId) {
        event.preventDefault();
        router.push(`/jobs/${activeJobId}`);
      }
      if (event.key === "Escape") {
        setSelectedJobId(null);
      }
      if ((event.key === "a" || event.key === "s" || event.key === "x" || event.key === "u") && activeJobId) {
        event.preventDefault();
        const current = jobs.find((job) => job.id === activeJobId);
        if (!current) return;
        if (event.key === "a") handleAction(current, "apply_now");
        if (event.key === "s") handleAction(current, "check_later");
        if (event.key === "x") handleAction(current, "not_interested");
        if (event.key === "u") handleAction(current, "undo");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [desktop, jobs, router, activeJobId, handleAction]);

  return (
    <div className="relative h-full">
      <ShortcutHints />
      <FilterBar filters={filters} onChange={setFilters} />
      {desktop && (
        <div className="mx-3 mt-2 flex justify-end gap-2">
          <button
            type="button"
            className={`rounded-md border px-2 py-1 text-xs ${desktopView === "cards" ? "border-accent bg-accent/15 text-accent" : "border-borderColor text-textSecondary"}`}
            onClick={() => updateDesktopView("cards")}
          >
            Card View
          </button>
          <button
            type="button"
            className={`rounded-md border px-2 py-1 text-xs ${desktopView === "table" ? "border-accent bg-accent/15 text-accent" : "border-borderColor text-textSecondary"}`}
            onClick={() => updateDesktopView("table")}
          >
            Table View
          </button>
        </div>
      )}
      {hasConnectionIssue && (
        <div className="mx-3 mt-2 flex items-center justify-between rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          <span>Unable to connect. Check your internet and retry.</span>
          <button
            type="button"
            className="rounded border border-warning/40 px-2 py-0.5 text-[11px] text-warning"
            onClick={() => void jobsQuery.refetch()}
          >
            Retry
          </button>
        </div>
      )}
      <NewJobsBanner count={newCount} />

      <div className="grid h-[calc(100vh-170px)] grid-cols-1 lg:grid-cols-[380px_1fr]">
        <div className="overflow-y-auto border-r border-borderColor">
          {jobsQuery.isLoading && (
            <div className="space-y-2 p-3">
              {desktop
                ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-16 w-full rounded-xl" />)
                : Array.from({ length: 6 }).map((_, idx) => <JobCardSkeleton key={idx} />)}
            </div>
          )}

          {!jobsQuery.isLoading && jobs.length === 0 &&
            (hasConnectionIssue ? (
              <div className="grid h-full place-items-center px-4 text-center text-sm text-textSecondary">
                <div>
                  <p className="font-medium text-warning">Unable to connect</p>
                  <p className="mt-1">We could not reach the API. Please retry.</p>
                  <button
                    type="button"
                    className="mt-3 rounded-md border border-borderColor px-3 py-1 text-xs text-textPrimary"
                    onClick={() => void jobsQuery.refetch()}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid h-full place-items-center px-4 text-center text-sm text-textSecondary">
                No jobs found. Try adjusting your filters.
              </div>
            ))}

          {desktop ? (
            desktopView === "table" ? (
              <div className="p-3">
                <JobsTable jobs={jobs} selectedJobId={activeJobId} onSelect={(job) => setSelectedJobId(job.id)} />
              </div>
            ) : (
              jobs.map((job) => (
                <JobRow key={job.id} job={job} selected={activeJobId === job.id} onClick={() => setSelectedJobId(job.id)} />
              ))
            )
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={() => router.push(`/jobs/${job.id}`)}
                onSwipeRight={() => handleAction(job, "apply_now")}
                onSwipeLeft={() => handleAction(job, "not_interested")}
              />
            ))
          )}

          <div ref={loadMoreRef} className="p-3 text-center text-xs text-textSecondary">
            {jobsQuery.isFetchingNextPage ? "Loading more..." : jobsQuery.hasNextPage ? "Scroll for more" : "No more jobs"}
          </div>
        </div>

        <div className="hidden overflow-y-auto lg:block">
          <JobDetail job={jobDetail.data ?? null} />
        </div>
      </div>
    </div>
  );
}
