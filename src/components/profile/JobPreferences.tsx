import type { Profile } from "@/lib/types";
import { Input } from "@/components/ui/input";

export function JobPreferences({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        type="number"
        placeholder="Salary min"
        value={profile.salaryMin?.toString() || ""}
        onChange={(e) => onChange({ salaryMin: Number(e.target.value) || undefined })}
      />
      <Input
        type="number"
        placeholder="Salary max"
        value={profile.salaryMax?.toString() || ""}
        onChange={(e) => onChange({ salaryMax: Number(e.target.value) || undefined })}
      />
      <Input
        placeholder="Earliest start date"
        value={profile.earliestStartDate || ""}
        onChange={(e) => onChange({ earliestStartDate: e.target.value })}
      />
      <Input
        placeholder="Work arrangement"
        value={profile.workArrangement || ""}
        onChange={(e) => onChange({ workArrangement: e.target.value })}
      />
    </div>
  );
}
