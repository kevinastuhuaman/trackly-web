import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { NotesPanel } from "@/components/tracker/NotesPanel";
import { ReminderPanel } from "@/components/tracker/ReminderPanel";
import { TimelineView } from "@/components/tracker/TimelineView";
import type { TrackerJob } from "@/lib/types";

export function TrackerDetail({ job }: { job: TrackerJob | null }) {
  if (!job) {
    return <div className="grid h-full place-items-center text-sm text-textSecondary">Select a tracker job</div>;
  }

  return (
    <div className="h-full space-y-3 overflow-y-auto p-4">
      <div className="flex items-center gap-3">
        <CompanyLogo companyName={job.companyName} companyDomain={job.companyDomain} size={44} />
        <div>
          <p className="text-xs text-textSecondary">{job.companyName}</p>
          <p className="text-sm font-semibold">{job.title}</p>
        </div>
      </div>

      <NotesPanel jobId={job.id} />
      <ReminderPanel jobId={job.id} />
      <TimelineView job={job} />
    </div>
  );
}
