"use client";

import { useMemo, useState } from "react";
import { Link2, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { JobActions } from "@/components/jobs/JobActions";
import { JobDescription } from "@/components/jobs/JobDescription";
import { MatchScore } from "@/components/jobs/MatchScore";
import { useJobAction } from "@/hooks/useJobs";
import { formatDate, timeAgo } from "@/lib/utils";
import type { Job } from "@/lib/types";

export function JobDetail({ job }: { job: Job | null }) {
  const [expanded, setExpanded] = useState(false);
  const action = useJobAction();

  const canShowNetwork = useMemo(() => Boolean(job?.connections?.length || job?.hiringManagers?.length), [job]);

  if (!job) {
    return (
      <div className="grid h-full place-items-center text-sm text-textSecondary">Select a job to view details</div>
    );
  }

  const copyLink = async () => {
    const jobLink = job.jobUrl || `${window.location.origin}/jobs/${job.id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(jobLink);
      } else {
        const input = document.createElement("textarea");
        input.value = jobLink;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      toast.success("Job link copied");
    } catch {
      toast.error("Unable to copy job link");
    }
  };

  const shareByEmail = () => {
    const jobLink = job.jobUrl || `${window.location.origin}/jobs/${job.id}`;
    const subject = `Trackly Job: ${job.title} at ${job.companyName}`;
    const body = [`Thought you might want to check this role:`, "", `${job.title} @ ${job.companyName}`, jobLink].join("\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4 flex items-start gap-3">
        <CompanyLogo companyName={job.companyName} companyDomain={job.companyDomain} size={64} />
        <div>
          <p className="text-sm text-textSecondary">{job.companyName}</p>
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-textSecondary">
            <MapPin className="h-3 w-3" /> {job.location || "Unknown"} • {timeAgo(job.postedAt ?? job.firstSeenAt)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <JobActions
          job={job}
          onAction={(value) => {
            action.mutate(
              { jobId: job.id, action: value },
              {
                onSuccess: () => toast.success("Job action updated"),
                onError: () => toast.error("Unable to update job action"),
              }
            );
          }}
        />
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 rounded-md border border-borderColor px-2 py-1 text-xs text-textSecondary hover:text-textPrimary"
          onClick={() => void copyLink()}
        >
          <Link2 className="h-3.5 w-3.5" />
          Copy link
        </button>
        <button
          type="button"
          className="ml-2 mt-2 inline-flex items-center gap-1 rounded-md border border-borderColor px-2 py-1 text-xs text-textSecondary hover:text-textPrimary"
          onClick={shareByEmail}
        >
          <Mail className="h-3.5 w-3.5" />
          Share via email
        </button>
      </div>

      <div className="mb-4 grid gap-2 text-sm text-textSecondary">
        <p>
          <span className="text-textTertiary">Posted:</span> {formatDate(job.postedAt)}
        </p>
        <p>
          <span className="text-textTertiary">Company:</span> {job.companyName}
        </p>
        <p>
          <span className="text-textTertiary">Location:</span> {job.location || "Unknown"}
        </p>
        <div>
          <span className="text-textTertiary">Sponsorship:</span>{" "}
          {job.sponsorshipStatus === "yes"
            ? "Available"
            : job.sponsorshipStatus === "no"
              ? "No"
              : "Not mentioned"}
        </div>
        {!!job.sponsorshipEvidence && <Badge className="text-[11px]">{job.sponsorshipEvidence}</Badge>}
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold">Match Score</h3>
        <MatchScore score={job.matchScore} reasons={job.matchReasons} missing={job.missingSkills} />
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold">Job Description</h3>
        <JobDescription html={job.descriptionHtml ?? job.descriptionText} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      </div>

      {canShowNetwork && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Your Network</h3>
          {job.connections?.map((connection, index) => (
            <div key={`${connection.name}-${index}`} className="rounded-md border border-borderColor p-3 text-sm">
              <p className="font-medium">{connection.name}</p>
              <p className="text-xs text-textSecondary">{connection.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
