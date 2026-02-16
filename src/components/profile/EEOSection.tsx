"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "trackly_profile_eeo_local";

export function EEOSection() {
  const [values, setValues] = useState(() => {
    if (typeof window === "undefined") {
      return { gender: "", raceEthnicity: "", veteranStatus: "", disabilityStatus: "" };
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { gender: "", raceEthnicity: "", veteranStatus: "", disabilityStatus: "" };
    try {
      return JSON.parse(raw) as { gender: string; raceEthnicity: string; veteranStatus: string; disabilityStatus: string };
    } catch {
      return { gender: "", raceEthnicity: "", veteranStatus: "", disabilityStatus: "" };
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input placeholder="Gender" value={values.gender} onChange={(e) => setValues((s) => ({ ...s, gender: e.target.value }))} />
      <Input
        placeholder="Race / ethnicity"
        value={values.raceEthnicity}
        onChange={(e) => setValues((s) => ({ ...s, raceEthnicity: e.target.value }))}
      />
      <Input
        placeholder="Veteran status"
        value={values.veteranStatus}
        onChange={(e) => setValues((s) => ({ ...s, veteranStatus: e.target.value }))}
      />
      <Input
        placeholder="Disability status"
        value={values.disabilityStatus}
        onChange={(e) => setValues((s) => ({ ...s, disabilityStatus: e.target.value }))}
      />
    </div>
  );
}
