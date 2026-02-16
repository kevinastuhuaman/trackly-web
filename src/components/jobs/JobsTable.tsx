"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { JOB_FUNCTION_LABELS } from "@/lib/constants";
import { cn, timeAgo } from "@/lib/utils";
import type { Job } from "@/lib/types";

type SortKey = "title" | "company" | "location" | "posted" | "match";
type SortDirection = "asc" | "desc";

function compareBySort(job: Job, key: SortKey) {
  switch (key) {
    case "title":
      return job.title.toLowerCase();
    case "company":
      return job.companyName.toLowerCase();
    case "location":
      return (job.location || "").toLowerCase();
    case "posted":
      return new Date(job.postedAt ?? job.firstSeenAt ?? 0).getTime();
    case "match":
      return job.matchScore ?? -1;
    default:
      return "";
  }
}

export function JobsTable({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: Job[];
  selectedJobId?: number | null;
  onSelect: (job: Job) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("posted");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sortedJobs = useMemo(() => {
    const rows = [...jobs];
    rows.sort((left, right) => {
      const a = compareBySort(left, sortKey);
      const b = compareBySort(right, sortKey);
      if (a < b) return direction === "asc" ? -1 : 1;
      if (a > b) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [direction, jobs, sortKey]);

  const setSort = (nextKey: SortKey) => {
    if (nextKey === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setDirection(nextKey === "posted" || nextKey === "match" ? "desc" : "asc");
  };

  const headingClass = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-textTertiary";
  const cellClass = "px-3 py-2 text-sm";

  return (
    <div className="overflow-hidden rounded-xl border border-borderColor bg-backgroundCard">
      <div className="max-h-[calc(100vh-250px)] overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-backgroundSecondary">
            <tr>
              <th className={headingClass}>
                <button type="button" className="inline-flex items-center gap-1" onClick={() => setSort("title")}>
                  Role
                  {sortKey === "title" ? (direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null}
                </button>
              </th>
              <th className={headingClass}>
                <button type="button" className="inline-flex items-center gap-1" onClick={() => setSort("company")}>
                  Company
                  {sortKey === "company" ? (direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null}
                </button>
              </th>
              <th className={headingClass}>
                <button type="button" className="inline-flex items-center gap-1" onClick={() => setSort("location")}>
                  Location
                  {sortKey === "location" ? (direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null}
                </button>
              </th>
              <th className={headingClass}>
                <button type="button" className="inline-flex items-center gap-1" onClick={() => setSort("posted")}>
                  Posted
                  {sortKey === "posted" ? (direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null}
                </button>
              </th>
              <th className={headingClass}>
                <button type="button" className="inline-flex items-center gap-1" onClick={() => setSort("match")}>
                  Match
                  {sortKey === "match" ? (direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.map((job) => (
              <tr
                key={job.id}
                className={cn(
                  "cursor-pointer border-t border-borderColor/80 hover:bg-backgroundSecondary/70",
                  selectedJobId === job.id && "bg-accent/15"
                )}
                onClick={() => onSelect(job)}
              >
                <td className={cellClass}>
                  <div>
                    <p className="truncate font-medium text-textPrimary">{job.title}</p>
                    <p className="text-xs text-textSecondary">{JOB_FUNCTION_LABELS[job.jobFunction]}</p>
                  </div>
                </td>
                <td className={cn(cellClass, "max-w-[220px] truncate text-textSecondary")}>{job.companyName}</td>
                <td className={cn(cellClass, "max-w-[180px] truncate text-textSecondary")}>{job.location || "Unknown"}</td>
                <td className={cn(cellClass, "text-textSecondary")}>{timeAgo(job.postedAt ?? job.firstSeenAt)}</td>
                <td className={cellClass}>{typeof job.matchScore === "number" ? job.matchScore : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
