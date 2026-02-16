import type { Profile } from "@/lib/types";
import { Input } from "@/components/ui/input";

export function EducationSection({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  const edu = profile.education?.[0] ?? {};

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        placeholder="School"
        value={edu.school || ""}
        onChange={(e) =>
          onChange({
            education: [
              {
                ...edu,
                school: e.target.value,
              },
            ],
          })
        }
      />
      <Input
        placeholder="Degree"
        value={edu.degree || ""}
        onChange={(e) =>
          onChange({
            education: [
              {
                ...edu,
                degree: e.target.value,
              },
            ],
          })
        }
      />
      <Input
        placeholder="Field"
        value={edu.fieldOfStudy || ""}
        onChange={(e) =>
          onChange({
            education: [
              {
                ...edu,
                fieldOfStudy: e.target.value,
              },
            ],
          })
        }
      />
      <Input
        placeholder="Graduation year"
        value={edu.graduationYear || ""}
        onChange={(e) =>
          onChange({
            education: [
              {
                ...edu,
                graduationYear: e.target.value,
              },
            ],
          })
        }
      />
    </div>
  );
}
