"use client";

import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { CompanyGrid } from "@/components/companies/CompanyGrid";
import { CompanyCardSkeleton } from "@/components/companies/CompanyCardSkeleton";
import { Input } from "@/components/ui/input";
import { useCompanies } from "@/hooks/useCompanies";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const isOnline = useNetworkStatus();
  const companies = useCompanies();

  const filtered = useMemo(() => {
    const data = companies.data?.companies ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((company) => {
      return company.name.toLowerCase().includes(query) || company.domain?.toLowerCase().includes(query);
    });
  }, [companies.data?.companies, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-3 p-3">
      <div className="rounded-xl border border-borderColor bg-backgroundCard p-4">
        <h1 className="mb-2 text-lg font-semibold">Companies</h1>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Try: fintech companies with PM roles" />
      </div>

      {(!isOnline || companies.error) && (
        <div className="flex items-center justify-between rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          <span>Unable to connect. Company data is currently unavailable.</span>
          <button
            type="button"
            className="rounded border border-warning/40 px-2 py-0.5 text-[11px] text-warning"
            onClick={() => void companies.refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {companies.isLoading && (
        <div className="grid gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CompanyCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {!companies.isLoading && !filtered.length ? (
        <div className="grid h-72 place-items-center rounded-xl border border-borderColor bg-backgroundCard text-sm text-textSecondary">
          <div className="text-center">
            <Building2 className="mx-auto mb-2 h-8 w-8" />
            {!isOnline || companies.error ? "Unable to connect" : "No companies found"}
          </div>
        </div>
      ) : (
        !companies.isLoading && <CompanyGrid companies={filtered} />
      )}
    </div>
  );
}
