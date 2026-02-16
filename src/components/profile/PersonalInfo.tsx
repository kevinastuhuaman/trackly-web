import { Input } from "@/components/ui/input";
import type { Profile } from "@/lib/types";

export function PersonalInfo({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input placeholder="First name" value={profile.firstName || ""} onChange={(e) => onChange({ firstName: e.target.value })} />
      <Input placeholder="Last name" value={profile.lastName || ""} onChange={(e) => onChange({ lastName: e.target.value })} />
      <Input placeholder="Email" value={profile.email || ""} onChange={(e) => onChange({ email: e.target.value })} />
      <Input placeholder="Phone" value={profile.phone || ""} onChange={(e) => onChange({ phone: e.target.value })} />
      <Input
        placeholder="Current company"
        value={profile.currentCompany || ""}
        onChange={(e) => onChange({ currentCompany: e.target.value })}
      />
      <Input placeholder="Current title" value={profile.currentTitle || ""} onChange={(e) => onChange({ currentTitle: e.target.value })} />
    </div>
  );
}
