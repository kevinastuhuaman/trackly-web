import { Select } from "@/components/ui/select";
import { FunctionChips } from "@/components/jobs/FunctionChips";
import { StatusChips } from "@/components/jobs/StatusChips";
import type { JobFunction, LocationFilter } from "@/lib/types";

export type JobFilters = {
  locationFilter: LocationFilter;
  jobModality: "full_time" | "internship" | "all";
  status: string;
  sort: "newest" | "match";
  jobFunction: JobFunction[];
};

export function FilterBar({
  filters,
  onChange,
}: {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}) {
  const setValue = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="sticky top-0 z-20 space-y-2 border-b border-borderColor bg-background/95 px-3 py-3 backdrop-blur">
      <div className="grid grid-cols-2 gap-2">
        <Select value={filters.jobModality} onChange={(event) => setValue("jobModality", event.target.value as JobFilters["jobModality"])}>
          <option value="full_time">Full-Time</option>
          <option value="internship">Internship</option>
          <option value="all">All</option>
        </Select>
        <Select
          value={filters.locationFilter}
          onChange={(event) => setValue("locationFilter", event.target.value as LocationFilter)}
        >
          <option value="us">US</option>
          <option value="non_us">Non-US</option>
          <option value="">All</option>
        </Select>
      </div>

      <FunctionChips
        selected={filters.jobFunction}
        onToggle={(fn) => {
          if (fn === "all") {
            setValue("jobFunction", []);
            return;
          }

          const next = filters.jobFunction.includes(fn)
            ? filters.jobFunction.filter((value) => value !== fn)
            : [...filters.jobFunction, fn];
          setValue("jobFunction", next);
        }}
      />

      <div className="flex items-center gap-2">
        <StatusChips value={filters.status} onChange={(status) => setValue("status", status)} />
        <button
          type="button"
          className="whitespace-nowrap rounded-md border border-borderColor px-2 py-1 text-xs text-textSecondary"
          onClick={() => setValue("sort", filters.sort === "newest" ? "match" : "newest")}
        >
          {filters.sort === "newest" ? "Best Match" : "Newest"}
        </button>
      </div>
    </div>
  );
}
