"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Briefcase, Globe, Layers } from "lucide-react";
import { useParams } from "next/navigation";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import { useJobs } from "@/hooks/useJobs";
import { JOB_FUNCTION_LABELS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "applying", label: "Applying" },
  { value: "applied_confirmed", label: "Applied" },
  { value: "check_later", label: "Check Later" },
  { value: "not_interested", label: "Not Interested" },
];

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const companyId = Number(params.id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const companies = useCompanies();
  const jobs = useJobs({ companyId, sort: "newest", status: "all" });

  const company = useMemo(() => companies.data?.companies.find((value) => value.id === companyId), [companies.data?.companies, companyId]);
  const allCompanyJobs = useMemo(() => jobs.data?.pages.flatMap((page) => page.jobs) ?? [], [jobs.data?.pages]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allCompanyJobs.filter((job) => {
      const matchesQuery =
        !normalizedQuery ||
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.location?.toLowerCase().includes(normalizedQuery);

      const matchesStatus = status === "all" || (job.userStatus ?? "new") === status;
      return matchesQuery && matchesStatus;
    });
  }, [allCompanyJobs, query, status]);

  if (!Number.isFinite(companyId)) {
    return (
      <div className="mx-auto max-w-4xl p-3 text-sm text-textSecondary">
        Invalid company id.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3 p-3">
      <div className="rounded-xl border border-borderColor bg-backgroundCard p-4">
        <div className="flex items-center gap-3">
          <CompanyLogo companyName={company?.name || "Company"} companyDomain={company?.domain} size={52} />
          <div>
            <h1 className="text-lg font-semibold">{company?.name || "Company"}</h1>
            <p className="text-sm text-textSecondary">{company?.domain || ""}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-borderColor bg-backgroundSecondary p-3 text-xs text-textSecondary">
            <p className="mb-1 flex items-center gap-1 text-textPrimary">
              <Globe className="h-3.5 w-3.5" /> Domain
            </p>
            <p>{company?.domain || "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-borderColor bg-backgroundSecondary p-3 text-xs text-textSecondary">
            <p className="mb-1 flex items-center gap-1 text-textPrimary">
              <Layers className="h-3.5 w-3.5" /> ATS
            </p>
            <p>{company?.atsType || "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-borderColor bg-backgroundSecondary p-3 text-xs text-textSecondary">
            <p className="mb-1 flex items-center gap-1 text-textPrimary">
              <Briefcase className="h-3.5 w-3.5" /> Jobs
            </p>
            <p>{company?.jobCount ?? allCompanyJobs.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-borderColor bg-backgroundCard p-4">
        <h2 className="mb-3 text-sm font-semibold">Company Jobs</h2>
        <div className="grid gap-2 sm:grid-cols-[1fr_220px]">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by title or location" />
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {!filteredJobs.length ? (
        <div className="rounded-xl border border-borderColor bg-backgroundCard p-4 text-sm text-textSecondary">
          {jobs.isLoading ? "Loading company jobs..." : "No jobs matched your filters."}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-xl border border-borderColor bg-backgroundCard p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-textSecondary">{job.location || "Unknown location"}</p>
                </div>
                <p className="shrink-0 text-[11px] text-textSecondary">{timeAgo(job.postedAt ?? job.firstSeenAt)}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge>{JOB_FUNCTION_LABELS[job.jobFunction]}</Badge>
                {job.userStatus && <Badge>{job.userStatus.replaceAll("_", " ")}</Badge>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {jobs.hasNextPage && (
        <button
          type="button"
          className="w-full rounded-xl border border-borderColor bg-backgroundCard px-3 py-2 text-sm text-textSecondary hover:text-textPrimary"
          disabled={jobs.isFetchingNextPage}
          onClick={() => void jobs.fetchNextPage()}
        >
          {jobs.isFetchingNextPage ? "Loading more..." : "Load more jobs"}
        </button>
      )}

      {jobs.error && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
          Unable to load company jobs right now.
        </div>
      )}
    </div>
  );
}
