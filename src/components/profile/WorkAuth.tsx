import type { Profile } from "@/lib/types";

export function WorkAuth({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <label className="flex items-center gap-2 rounded-md border border-borderColor bg-backgroundSecondary p-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(profile.legallyAuthorized)}
          onChange={(e) => onChange({ legallyAuthorized: e.target.checked })}
        />
        Legally authorized to work in US
      </label>
      <label className="flex items-center gap-2 rounded-md border border-borderColor bg-backgroundSecondary p-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(profile.requiresSponsorship)}
          onChange={(e) => onChange({ requiresSponsorship: e.target.checked })}
        />
        Requires sponsorship
      </label>
    </div>
  );
}
