"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Bell, GripVertical } from "lucide-react";
import type { TrackerJob } from "@/lib/types";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { cn, timeAgo } from "@/lib/utils";

function appliedAgeLabel(job: TrackerJob) {
  if (job.trackerStage !== "applied") return null;

  const appliedAt = job.appliedConfirmedAt ?? job.statusUpdatedAt;
  if (!appliedAt) return "Applied recently";

  const elapsedMs = Date.now() - new Date(appliedAt).getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
  if (elapsedDays === 0) return "Applied today";
  return `Applied ${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;
}

export function KanbanCard({
  job,
  selected,
  onSelect,
  onToggleSelect,
}: {
  job: TrackerJob;
  selected: boolean;
  onSelect: (job: TrackerJob) => void;
  onToggleSelect: (jobId: number, checked: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(job.id),
    data: { stage: job.trackerStage },
  });
  const appliedLabel = appliedAgeLabel(job);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "w-full rounded-lg border border-borderColor bg-backgroundCard p-3 text-left",
        isDragging && "opacity-60"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button type="button" className="flex min-w-0 items-center gap-2 text-left" onClick={() => onSelect(job)}>
          <CompanyLogo companyName={job.companyName} companyDomain={job.companyDomain} size={24} />
          <p className="truncate text-xs text-textSecondary">{job.companyName}</p>
        </button>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => onToggleSelect(job.id, event.target.checked)}
            className="h-3.5 w-3.5 rounded border-borderColor bg-backgroundSecondary accent-accent"
            aria-label={`Select ${job.title}`}
          />
          <button
            type="button"
            className="rounded border border-borderColor p-1 text-textSecondary hover:text-textPrimary"
            aria-label={`Drag ${job.title}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <button type="button" className="w-full text-left" onClick={() => onSelect(job)}>
        <p className="line-clamp-2 text-sm">{job.title}</p>
      </button>

      <div className="mt-2 flex items-center justify-between text-[11px] text-textSecondary">
        <div className="space-y-0.5">
          <p>{timeAgo(job.statusUpdatedAt ?? job.postedAt ?? job.firstSeenAt)}</p>
          {appliedLabel && <p className="text-success">{appliedLabel}</p>}
        </div>
        {!!job.reminders?.length && <Bell className="h-3 w-3" />}
      </div>
    </div>
  );
}
