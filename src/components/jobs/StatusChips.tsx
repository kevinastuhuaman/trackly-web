import { cn } from "@/lib/utils";

const statuses = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "applying", label: "Applying" },
  { key: "applied_confirmed", label: "Applied" },
  { key: "check_later", label: "Check Later" },
  { key: "not_interested", label: "Not Interested" },
] as const;

export function StatusChips({ value, onChange }: { value: string; onChange: (status: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {statuses.map((status) => (
        <button
          key={status.key}
          type="button"
          className={cn(
            "whitespace-nowrap rounded-full border px-3 py-1 text-xs",
            value === status.key ? "border-accent bg-accent/15 text-accent" : "border-borderColor text-textSecondary"
          )}
          onClick={() => onChange(status.key)}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
