import { JOB_FUNCTION_LABELS } from "@/lib/constants";
import type { JobFunction } from "@/lib/types";
import { cn } from "@/lib/utils";

const functions = ["product", "engineering", "design", "data", "marketing", "sales", "partnerships", "finance", "strategy", "operations", "people", "other"] as const;

export function FunctionChips({
  selected,
  onToggle,
}: {
  selected: JobFunction[];
  onToggle: (fn: JobFunction | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        className={cn(
          "whitespace-nowrap rounded-full border px-3 py-1 text-xs",
          selected.length === 0 ? "border-accent bg-accent/15 text-accent" : "border-borderColor text-textSecondary"
        )}
        onClick={() => onToggle("all")}
      >
        All
      </button>
      {functions.map((fn) => {
        const active = selected.includes(fn);
        return (
          <button
            key={fn}
            type="button"
            className={cn(
              "whitespace-nowrap rounded-full border px-3 py-1 text-xs transition",
              active ? "border-accent bg-accent/15 text-accent" : "border-borderColor text-textSecondary hover:text-textPrimary"
            )}
            onClick={() => onToggle(fn)}
          >
            {JOB_FUNCTION_LABELS[fn]}
          </button>
        );
      })}
    </div>
  );
}
