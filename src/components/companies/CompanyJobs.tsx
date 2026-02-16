import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Job } from "@/lib/types";

export function CompanyJobs({ jobs }: { jobs: Job[] }) {
  if (!jobs.length) {
    return <p className="text-sm text-textSecondary">No jobs found for this company and filter set.</p>;
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-lg border border-borderColor bg-backgroundCard p-3">
          <p className="text-sm font-medium">{job.title}</p>
          <p className="text-xs text-textSecondary">{job.companyName}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-textSecondary">
            <MapPin className="h-3 w-3" /> {job.location || "Unknown"}
          </p>
        </Link>
      ))}
    </div>
  );
}
