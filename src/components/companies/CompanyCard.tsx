import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import type { Company } from "@/lib/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.id}`} className="card-lift rounded-xl border border-borderColor bg-backgroundCard p-4">
      <div className="mb-3 flex items-center gap-3">
        <CompanyLogo companyName={company.name} companyDomain={company.domain} size={52} />
        <div>
          <h3 className="text-sm font-semibold">{company.name}</h3>
          <p className="text-xs text-textSecondary">{company.domain || "unknown"}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        <Badge>{company.jobCount ?? 0} jobs</Badge>
        <Badge>{company.pmJobCount ?? 0} PM</Badge>
      </div>
    </Link>
  );
}
