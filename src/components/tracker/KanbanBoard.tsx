"use client";

import { useCallback, useMemo, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { KanbanColumn } from "@/components/tracker/KanbanColumn";
import { TrackerDetail } from "@/components/tracker/TrackerDetail";
import { useBulkMoveTrackerStage, useMoveTrackerStage, useTrackerJobs } from "@/hooks/useTracker";
import type { TrackerJob, TrackerStageApi } from "@/lib/types";

type TrackerStage = Exclude<TrackerStageApi, "all">;
type StageOrderMap = Partial<Record<TrackerStage, number[]>>;

const COLUMN_ORDER_STORAGE_KEY = "trackly_tracker_column_order";

const columns: Array<{ key: TrackerStage; label: string }> = [
  { key: "backlog", label: "Saved" },
  { key: "in_progress", label: "Applying" },
  { key: "applied", label: "Applied" },
  { key: "offers", label: "Offered" },
  { key: "discarded", label: "Not Interested" },
];

const stageLabels = columns.reduce<Record<TrackerStage, string>>((acc, column) => {
  acc[column.key] = column.label;
  return acc;
}, {} as Record<TrackerStage, string>);

const validStages = new Set<TrackerStage>(columns.map((column) => column.key));

function normalizeStage(stage?: TrackerStageApi | null): TrackerStage {
  return stage && stage !== "all" && validStages.has(stage as TrackerStage) ? (stage as TrackerStage) : "backlog";
}

function isTrackerStage(value: string): value is TrackerStage {
  return validStages.has(value as TrackerStage);
}

function readColumnOrder(): StageOrderMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(COLUMN_ORDER_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Partial<Record<string, number[]>>;
    const output: StageOrderMap = {};
    for (const stage of columns.map((column) => column.key)) {
      const values = parsed[stage];
      if (!Array.isArray(values)) continue;
      output[stage] = values.filter((value) => typeof value === "number" && Number.isFinite(value));
    }
    return output;
  } catch {
    return {};
  }
}

function writeColumnOrder(order: StageOrderMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLUMN_ORDER_STORAGE_KEY, JSON.stringify(order));
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replaceAll("\"", "\"\"")}"`;
  }
  return value;
}

export function KanbanBoard() {
  const { data } = useTrackerJobs("all");
  const moveStage = useMoveTrackerStage();
  const bulkMove = useBulkMoveTrackerStage();
  const [selectedJob, setSelectedJob] = useState<TrackerJob | null>(null);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<number>>(new Set());
  const [columnOrder, setColumnOrder] = useState<StageOrderMap>(readColumnOrder);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const persistColumnOrder = useCallback((updater: (current: StageOrderMap) => StageOrderMap) => {
    setColumnOrder((current) => {
      const next = updater(current);
      writeColumnOrder(next);
      return next;
    });
  }, []);

  const jobsById = useMemo(() => {
    return new Map((data?.jobs ?? []).map((job) => [job.id, job] as const));
  }, [data?.jobs]);

  const byStage = useMemo(() => {
    const map = new Map<TrackerStage, TrackerJob[]>();
    columns.forEach((column) => map.set(column.key, []));

    for (const job of data?.jobs ?? []) {
      const stage = normalizeStage(job.trackerStage);
      map.get(stage)?.push(job);
    }

    for (const stage of columns.map((column) => column.key)) {
      const ids = columnOrder[stage] ?? [];
      if (!ids.length) continue;

      const indexMap = new Map(ids.map((id, index) => [id, index]));
      const jobs = map.get(stage);
      if (!jobs) continue;

      jobs.sort((a, b) => {
        const left = indexMap.get(a.id);
        const right = indexMap.get(b.id);
        if (left === undefined && right === undefined) return 0;
        if (left === undefined) return 1;
        if (right === undefined) return -1;
        return left - right;
      });
    }

    return map;
  }, [columnOrder, data?.jobs]);

  const activeSelectedIds = useMemo(() => {
    return new Set(Array.from(selectedJobIds).filter((id) => jobsById.has(id)));
  }, [jobsById, selectedJobIds]);

  const toggleSelect = useCallback((jobId: number, checked: boolean) => {
    setSelectedJobIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(jobId);
      } else {
        next.delete(jobId);
      }
      return next;
    });
  }, []);

  const runBulkMove = useCallback(
    (stage: "applied" | "discarded") => {
      const jobIds = Array.from(activeSelectedIds);
      if (!jobIds.length) return;
      bulkMove.mutate(
        { jobIds, stage },
        {
          onSuccess: () => {
            setSelectedJobIds(new Set());
            toast.success(
              stage === "applied"
                ? `${jobIds.length} job${jobIds.length === 1 ? "" : "s"} moved to Applied`
                : `${jobIds.length} job${jobIds.length === 1 ? "" : "s"} removed`
            );
          },
          onError: () => toast.error("Bulk update failed. Please retry."),
        }
      );
    },
    [activeSelectedIds, bulkMove]
  );

  const exportCsv = useCallback(() => {
    const jobs = data?.jobs ?? [];
    if (!jobs.length) {
      toast.error("No tracker jobs available to export");
      return;
    }

    const header = ["Company", "Title", "Stage", "Date Applied", "URL"];
    const rows = jobs.map((job) => {
      const stage = normalizeStage(job.trackerStage);
      const appliedDate = stage === "applied" ? job.appliedConfirmedAt ?? job.statusUpdatedAt ?? "" : "";
      return [job.companyName, job.title, stageLabels[stage], appliedDate, job.jobUrl ?? ""];
    });

    const csv = [header, ...rows].map((columns) => columns.map((value) => csvEscape(value || "")).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `trackly-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [data?.jobs]);

  const onDragEnd = (event: DragEndEvent) => {
    const activeId = Number(event.active.id);
    if (!activeId) return;

    const activeJob = jobsById.get(activeId);
    if (!activeJob) return;
    const sourceStage = normalizeStage(activeJob.trackerStage);

    const overRaw = event.over?.id;
    if (!overRaw) return;

    let targetStage: TrackerStage | null = null;
    let overJobId: number | null = null;

    const overId = String(overRaw);
    if (isTrackerStage(overId)) {
      targetStage = overId;
    } else {
      const parsed = Number(overId);
      if (Number.isFinite(parsed)) {
        const overJob = jobsById.get(parsed);
        if (overJob) {
          targetStage = normalizeStage(overJob.trackerStage);
          overJobId = overJob.id;
        }
      }
    }

    if (!targetStage) return;

    if (targetStage === sourceStage) {
      if (!overJobId || overJobId === activeId) return;
      const currentIds = (byStage.get(sourceStage) ?? []).map((job) => job.id);
      const oldIndex = currentIds.indexOf(activeId);
      const newIndex = currentIds.indexOf(overJobId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

      const reordered = arrayMove(currentIds, oldIndex, newIndex);
      persistColumnOrder((current) => ({
        ...current,
        [sourceStage]: reordered,
      }));
      return;
    }

    const sourceIds = (byStage.get(sourceStage) ?? []).map((job) => job.id).filter((id) => id !== activeId);
    const targetIds = (byStage.get(targetStage) ?? []).map((job) => job.id).filter((id) => id !== activeId);
    if (overJobId && targetIds.includes(overJobId)) {
      const insertIndex = targetIds.indexOf(overJobId);
      targetIds.splice(insertIndex, 0, activeId);
    } else {
      targetIds.push(activeId);
    }

    persistColumnOrder((current) => ({
      ...current,
      [sourceStage]: sourceIds,
      [targetStage]: targetIds,
    }));

    moveStage.mutate(
      { jobId: activeId, stage: targetStage },
      {
        onSuccess: () => toast.success("Stage updated"),
        onError: () => toast.error("Failed to move tracker card"),
      }
    );
  };

  return (
    <div className="grid h-[calc(100vh-64px)] grid-cols-1 gap-3 p-3 lg:grid-cols-[1fr_360px]">
      <div className="flex items-center justify-between rounded-lg border border-borderColor bg-backgroundCard px-3 py-2 text-sm lg:col-span-2">
        <span className="text-textSecondary">Tracked jobs: {data?.jobs?.length ?? 0}</span>
        <button
          type="button"
          className="rounded-md border border-borderColor px-2 py-1 text-xs text-textSecondary hover:text-textPrimary"
          onClick={exportCsv}
        >
          Export as CSV
        </button>
      </div>

      {activeSelectedIds.size > 0 && (
        <div className="rounded-lg border border-borderColor bg-backgroundCard px-3 py-2 text-sm lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-textSecondary">{activeSelectedIds.size} selected</span>
            <button
              type="button"
              className="rounded-md bg-accent px-2 py-1 text-xs text-white disabled:opacity-60"
              onClick={() => runBulkMove("applied")}
              disabled={bulkMove.isPending}
            >
              Move to Applied
            </button>
            <button
              type="button"
              className="rounded-md border border-borderColor px-2 py-1 text-xs text-textSecondary disabled:opacity-60"
              onClick={() => runBulkMove("discarded")}
              disabled={bulkMove.isPending}
            >
              Remove
            </button>
            <button
              type="button"
              className="rounded-md border border-borderColor px-2 py-1 text-xs text-textSecondary"
              onClick={() => setSelectedJobIds(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {columns.map((column) => (
            <KanbanColumn
              key={column.key}
              stage={column.key}
              title={column.label}
              jobs={byStage.get(column.key) ?? []}
              selectedJobIds={activeSelectedIds}
              onSelect={setSelectedJob}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      </DndContext>

      <div className="hidden rounded-xl border border-borderColor bg-backgroundSecondary lg:block">
        <TrackerDetail job={selectedJob} />
      </div>
    </div>
  );
}
