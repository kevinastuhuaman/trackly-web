import type { TrackerJob } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TimelineView({ job }: { job: TrackerJob }) {
  return (
    <div className="rounded-md border border-borderColor bg-backgroundCard p-3">
      <h4 className="mb-2 text-sm font-semibold">Timeline</h4>
      {job.timeline?.length ? (
        <div className="space-y-2">
          {job.timeline.map((item, index) => (
            <div key={`${item.id ?? index}`} className="text-xs text-textSecondary">
              <p>{item.message ?? item.type ?? "Update"}</p>
              <p className="text-textTertiary">{formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-textSecondary">No timeline activity yet.</p>
      )}
    </div>
  );
}
