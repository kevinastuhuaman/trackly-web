import { CompanyCard } from "@/components/companies/CompanyCard";
import type { Company } from "@/lib/types";

export function CompanyGrid({ companies }: { companies: Company[] }) {
  return (
    <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
