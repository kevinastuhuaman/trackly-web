"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { TrackerJob, TrackerStageApi } from "@/lib/types";
import { KanbanCard } from "@/components/tracker/KanbanCard";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  stage,
  title,
  jobs,
  selectedJobIds,
  onSelect,
  onToggleSelect,
}: {
  stage: TrackerStageApi;
  title: string;
  jobs: TrackerJob[];
  selectedJobIds: Set<number>;
  onSelect: (job: TrackerJob) => void;
  onToggleSelect: (jobId: number, checked: boolean) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div className="min-w-[280px] max-w-[320px] rounded-xl border border-borderColor bg-backgroundSecondary p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="rounded-full bg-backgroundCard px-2 py-0.5 text-xs text-textSecondary">{jobs.length}</span>
      </div>
      <div ref={setNodeRef} className={cn("space-y-2 rounded-lg p-1", isOver && "bg-accent/10")}>
        <SortableContext items={jobs.map((job) => String(job.id))} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <KanbanCard
              key={job.id}
              job={job}
              selected={selectedJobIds.has(job.id)}
              onSelect={onSelect}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
