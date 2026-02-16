"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateTrackerReminder } from "@/hooks/useTracker";

export function ReminderPanel({ jobId }: { jobId: number }) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const createReminder = useCreateTrackerReminder();

  return (
    <div className="space-y-2 rounded-md border border-borderColor bg-backgroundCard p-3">
      <h4 className="text-sm font-semibold">Reminders</h4>
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="h-9 w-full rounded-md border border-borderColor bg-backgroundSecondary px-2"
      />
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="h-9 w-full rounded-md border border-borderColor bg-backgroundSecondary px-2 text-sm"
        placeholder="Reminder title"
      />
      <Button
        size="sm"
        onClick={() => {
          if (!date) return;
          const iso = new Date(date).toISOString();
          createReminder.mutate({ jobId, dueAt: iso, title: title || undefined });
          setDate("");
          setTitle("");
        }}
      >
        Add Reminder
      </Button>
    </div>
  );
}
