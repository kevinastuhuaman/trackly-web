import { Input } from "@/components/ui/input";
import type { Profile } from "@/lib/types";

export function AddressSection({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        className="sm:col-span-2"
        placeholder="Street address"
        value={profile.streetAddress || ""}
        onChange={(e) => onChange({ streetAddress: e.target.value })}
      />
      <Input placeholder="City" value={profile.city || ""} onChange={(e) => onChange({ city: e.target.value })} />
      <Input placeholder="State" value={profile.state || ""} onChange={(e) => onChange({ state: e.target.value })} />
      <Input placeholder="ZIP" value={profile.zipCode || ""} onChange={(e) => onChange({ zipCode: e.target.value })} />
      <Input placeholder="Country" value={profile.country || ""} onChange={(e) => onChange({ country: e.target.value })} />
    </div>
  );
}
