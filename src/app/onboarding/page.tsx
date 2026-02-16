"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdatePreferences } from "@/hooks/usePreferences";
import { readCachedPreferences } from "@/lib/local-cache";
import type { JobFunction, JobModality, LocationFilter } from "@/lib/types";

const functions: JobFunction[] = [
  "product",
  "engineering",
  "design",
  "data",
  "marketing",
  "sales",
  "partnerships",
  "finance",
  "strategy",
  "operations",
  "people",
  "other",
];

const steps = ["roles", "modality", "location", "sponsorship", "notifications"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const savePrefs = useUpdatePreferences();
  const cachedPreferences = readCachedPreferences();
  const [step, setStep] = useState(0);

  const [wantedJobFunctions, setWantedJobFunctions] = useState<JobFunction[]>(cachedPreferences?.wantedJobFunctions ?? ["product"]);
  const [jobModality, setJobModality] = useState<JobModality>(cachedPreferences?.jobModality ?? "full_time");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>(cachedPreferences?.locationFilter ?? "us");
  const [needsSponsorship, setNeedsSponsorship] = useState(cachedPreferences?.needsSponsorship ?? false);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const saveAndNext = () => {
    savePrefs.mutate({ wantedJobFunctions, jobModality, locationFilter, needsSponsorship });
    if (step >= steps.length - 1) {
      window.localStorage.setItem("trackly_onboarded", "true");
      router.replace("/jobs");
      return;
    }
    setStep((prev) => prev + 1);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 p-4">
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-backgroundCard">
        <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      {steps[step] === "roles" && (
        <section className="space-y-3">
          <h1 className="text-xl font-semibold">Choose your target functions</h1>
          <p className="text-sm text-textSecondary">Select one or more job functions.</p>
          <div className="flex flex-wrap gap-2">
            {functions.map((fn) => {
              const selected = wantedJobFunctions.includes(fn);
              return (
                <button
                  key={fn}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm ${selected ? "border-accent bg-accent/15 text-accent" : "border-borderColor text-textSecondary"}`}
                  onClick={() => {
                    setWantedJobFunctions((current) =>
                      current.includes(fn) ? current.filter((value) => value !== fn) : [...current, fn]
                    );
                  }}
                >
                  {fn}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {steps[step] === "modality" && (
        <section className="space-y-3">
          <h1 className="text-xl font-semibold">Role type</h1>
          <div className="grid gap-2">
            {[
              { value: "full_time", label: "Full-Time" },
              { value: "internship", label: "Internship" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={`rounded-lg border p-3 text-left ${jobModality === item.value ? "border-accent bg-accent/15" : "border-borderColor bg-backgroundCard"}`}
                onClick={() => setJobModality(item.value as JobModality)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {steps[step] === "location" && (
        <section className="space-y-3">
          <h1 className="text-xl font-semibold">Location preference</h1>
          <div className="grid gap-2">
            {[
              { value: "us", label: "US" },
              { value: "non_us", label: "Non-US" },
              { value: "", label: "All locations" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className={`rounded-lg border p-3 text-left ${locationFilter === item.value ? "border-accent bg-accent/15" : "border-borderColor bg-backgroundCard"}`}
                onClick={() => setLocationFilter(item.value as LocationFilter)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {steps[step] === "sponsorship" && (
        <section className="space-y-3">
          <h1 className="text-xl font-semibold">Work authorization</h1>
          <label className="flex items-center gap-3 rounded-lg border border-borderColor bg-backgroundCard p-3 text-sm">
            <input type="checkbox" checked={needsSponsorship} onChange={(e) => setNeedsSponsorship(e.target.checked)} />
            I need visa sponsorship
          </label>
        </section>
      )}

      {steps[step] === "notifications" && (
        <section className="space-y-3">
          <h1 className="text-xl font-semibold">Browser notifications</h1>
          <p className="text-sm text-textSecondary">Enable notifications for new matching jobs.</p>
          <Badge>You can update this later in browser settings.</Badge>
        </section>
      )}

      <div className="mt-auto flex items-center justify-between pb-4">
        <button type="button" className="text-sm text-textSecondary" onClick={() => router.replace("/jobs")}>Skip</button>
        <Button onClick={saveAndNext}>{step === steps.length - 1 ? "Finish" : "Next"}</Button>
      </div>
    </main>
  );
}
