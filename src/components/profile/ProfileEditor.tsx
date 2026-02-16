"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonalInfo } from "@/components/profile/PersonalInfo";
import { AddressSection } from "@/components/profile/AddressSection";
import { OnlinePresence } from "@/components/profile/OnlinePresence";
import { WorkAuth } from "@/components/profile/WorkAuth";
import { EducationSection } from "@/components/profile/EducationSection";
import { JobPreferences } from "@/components/profile/JobPreferences";
import { EEOSection } from "@/components/profile/EEOSection";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import type { Profile } from "@/lib/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-3 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </Card>
  );
}

export function ProfileEditor() {
  const { data, isLoading } = useProfile();
  const update = useUpdateProfile();

  const serverProfile = data?.profile ?? {};
  const [draftProfile, setDraftProfile] = useState<Profile | null>(null);
  const profile = draftProfile ?? serverProfile;

  const applyPatch = (patch: Partial<Profile>) => {
    setDraftProfile((prev) => ({ ...(prev ?? serverProfile), ...patch }));
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-textSecondary">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-3 p-3">
      <Section title="Personal Info">
        <PersonalInfo profile={profile} onChange={applyPatch} />
      </Section>

      <Section title="Address">
        <AddressSection profile={profile} onChange={applyPatch} />
      </Section>

      <Section title="Online Presence">
        <OnlinePresence profile={profile} onChange={applyPatch} />
      </Section>

      <Section title="Work Authorization">
        <WorkAuth profile={profile} onChange={applyPatch} />
      </Section>

      <Section title="Education">
        <EducationSection profile={profile} onChange={applyPatch} />
      </Section>

      <Section title="Job Preferences">
        <JobPreferences profile={profile} onChange={applyPatch} />
      </Section>

      <Section title="EEO / Diversity (Local only)">
        <EEOSection />
      </Section>

      <ResumeUpload />

      <Button
        onClick={() => {
          update.mutate(profile, {
            onSuccess: () => {
              toast.success("Profile saved");
              setDraftProfile(null);
            },
            onError: () => toast.error("Unable to save profile"),
          });
        }}
      >
        Save Profile
      </Button>
    </div>
  );
}
