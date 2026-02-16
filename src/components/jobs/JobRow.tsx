import { MapPin } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { JOB_FUNCTION_LABELS } from "@/lib/constants";
import type { Job } from "@/lib/types";

export function JobRow({ job, selected, onClick }: { job: Job; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-2 text-left hover:bg-backgroundSecondary",
        selected && "border-l-accent bg-backgroundSecondary"
      )}
    >
      <CompanyLogo companyName={job.companyName} companyDomain={job.companyDomain} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{job.title}</p>
        <p className="truncate text-xs text-textSecondary">{job.companyName}</p>
      </div>
      <div className="text-right">
        <p className="text-[11px] text-textSecondary">{JOB_FUNCTION_LABELS[job.jobFunction]}</p>
        <p className="flex items-center justify-end gap-1 text-[11px] text-textTertiary">
          <MapPin className="h-3 w-3" />
          {timeAgo(job.postedAt ?? job.firstSeenAt)}
        </p>
      </div>
    </button>
  );
}
