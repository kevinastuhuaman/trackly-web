import { Input } from "@/components/ui/input";
import type { Profile } from "@/lib/types";

export function OnlinePresence({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  return (
    <div className="grid gap-2">
      <Input
        placeholder="LinkedIn URL"
        value={profile.linkedinUrl || ""}
        onChange={(e) => onChange({ linkedinUrl: e.target.value })}
      />
      <Input
        placeholder="Portfolio URL"
        value={profile.portfolioUrl || ""}
        onChange={(e) => onChange({ portfolioUrl: e.target.value })}
      />
      <Input placeholder="GitHub URL" value={profile.githubUrl || ""} onChange={(e) => onChange({ githubUrl: e.target.value })} />
    </div>
  );
}
