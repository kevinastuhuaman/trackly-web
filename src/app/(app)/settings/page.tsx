"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useThemePreference } from "@/components/layout/ThemeProvider";
import { useUpdatePreferences } from "@/hooks/usePreferences";
import { readCachedPreferences, writeCachedPreferences } from "@/lib/local-cache";

const RELEASE_NOTES = [
  "Unified mobile + desktop authenticated app shell",
  "Google OAuth callback flow with hardened error handling",
  "Infinite jobs feed with swipe actions and keyboard shortcuts",
  "Tracker kanban with drag-and-drop stage updates",
  "Offline banners and cached profile/preferences fallback",
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useThemePreference();
  const updatePrefs = useUpdatePreferences();
  const cachedPreferences = readCachedPreferences();

  const [jobModality, setJobModality] = useState<"full_time" | "internship" | "all">(cachedPreferences?.jobModality ?? "full_time");
  const [locationFilter, setLocationFilter] = useState<"us" | "non_us" | "">(cachedPreferences?.locationFilter ?? "us");
  const [needsSponsorship, setNeedsSponsorship] = useState(cachedPreferences?.needsSponsorship ?? false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const closeWhatsNew = useCallback(() => setShowWhatsNew(false), []);
  const whatsNewModalRef = useFocusTrap<HTMLDivElement>(showWhatsNew, closeWhatsNew);

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-3">
      <Card className="p-4">
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-sm text-textSecondary">{user?.name || user?.email}</p>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-sm font-semibold">Job Preferences</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Select value={jobModality} onChange={(e) => setJobModality(e.target.value as "full_time" | "internship" | "all")}>
            <option value="full_time">Full-Time</option>
            <option value="internship">Internship</option>
            <option value="all">All</option>
          </Select>
          <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value as "us" | "non_us" | "") }>
            <option value="us">US</option>
            <option value="non_us">Non-US</option>
            <option value="">All</option>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-textSecondary">
          <input type="checkbox" checked={needsSponsorship} onChange={(e) => setNeedsSponsorship(e.target.checked)} />
          I need sponsorship
        </label>
        <Button
          onClick={() => {
            updatePrefs.mutate(
              {
                jobModality,
                locationFilter,
                needsSponsorship,
                wantedJobFunctions: cachedPreferences?.wantedJobFunctions ?? ["product"],
              },
              {
                onSuccess: () => {
                  writeCachedPreferences({
                    jobModality,
                    locationFilter,
                    needsSponsorship,
                    wantedJobFunctions: cachedPreferences?.wantedJobFunctions ?? ["product"],
                  });
                  toast.success("Preferences saved");
                },
                onError: () => toast.error("Unable to save preferences"),
              }
            );
          }}
        >
          Save Preferences
        </Button>
      </Card>

      <Card className="space-y-2 p-4">
        <Button variant="secondary" onClick={() => setShowWhatsNew(true)}>
          What&apos;s New (v1.0.0)
        </Button>
        <a className="block text-sm text-accent" href="https://track-ly.app/privacy">
          Privacy Policy
        </a>
        <a className="block text-sm text-accent" href="https://track-ly.app/terms">
          Terms of Use
        </a>
        <Button
          variant="secondary"
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
        >
          Sign Out
        </Button>
        <Button variant="danger">Delete Account</Button>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={theme === "dark" ? "primary" : "secondary"} onClick={() => setTheme("dark")}>
            Dark
          </Button>
          <Button variant={theme === "light" ? "primary" : "secondary"} onClick={() => setTheme("light")}>
            Light
          </Button>
        </div>
        <p className="text-xs text-textSecondary">Theme preference is saved on this device.</p>
      </Card>

      {showWhatsNew && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-4" onClick={closeWhatsNew}>
          <div
            ref={whatsNewModalRef}
            role="dialog"
            aria-modal="true"
            aria-label="What is new in Trackly"
            tabIndex={-1}
            className="w-full max-w-lg rounded-xl border border-borderColor bg-backgroundCard p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Trackly v1.0.0</h2>
              <button
                type="button"
                className="rounded border border-borderColor px-2 py-1 text-xs text-textSecondary"
                onClick={closeWhatsNew}
              >
                Close
              </button>
            </div>
            <ul className="space-y-2 text-sm text-textSecondary">
              {RELEASE_NOTES.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
