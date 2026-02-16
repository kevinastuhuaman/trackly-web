"use client";

import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { JOB_FUNCTION_LABELS } from "@/lib/constants";
import { formatDate, timeAgo } from "@/lib/utils";
import type { Job } from "@/lib/types";

const SWIPE_TRIGGER = 90;

export function JobCard({
  job,
  onSelect,
  onSwipeRight,
  onSwipeLeft,
}: {
  job: Job;
  onSelect: () => void;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}) {
  const pointerStart = useRef<number | null>(null);
  const [deltaX, setDeltaX] = useState(0);

  return (
    <Card
      className="card-lift mx-3 mb-2 cursor-pointer p-3"
      onClick={onSelect}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerMove={(event) => {
        if (pointerStart.current === null) return;
        const diff = event.clientX - pointerStart.current;
        setDeltaX(Math.max(-120, Math.min(120, diff)));
      }}
      onPointerUp={() => {
        if (deltaX > SWIPE_TRIGGER) {
          onSwipeRight?.();
        }
        if (deltaX < -SWIPE_TRIGGER) {
          onSwipeLeft?.();
        }
        pointerStart.current = null;
        setDeltaX(0);
      }}
      style={{ transform: `translateX(${deltaX}px)` }}
    >
      <div className="mb-2 flex items-start gap-3">
        <CompanyLogo companyName={job.companyName} companyDomain={job.companyDomain} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{job.companyName}</p>
            <p className="shrink-0 text-xs text-textSecondary">{timeAgo(job.postedAt ?? job.firstSeenAt)}</p>
          </div>
          <p className="line-clamp-2 text-sm text-textPrimary">{job.title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-textSecondary">
            <MapPin className="h-3 w-3" />
            {job.location || "Unknown"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        <Badge className="text-[10px]">{JOB_FUNCTION_LABELS[job.jobFunction]}</Badge>
        {job.userStatus && <Badge className="text-[10px]">{job.userStatus.replaceAll("_", " ")}</Badge>}
        {job.isNew && <Badge className="border-error/50 bg-error/10 text-[10px] text-error">NEW</Badge>}
      </div>

      {job.sponsorshipStatus && job.sponsorshipStatus !== "unknown" && (
        <p className="mt-2 text-[11px] text-textSecondary">
          {job.sponsorshipStatus === "yes" ? "Sponsors visa" : "No sponsorship"} • Posted {formatDate(job.postedAt)}
        </p>
      )}
    </Card>
  );
}
