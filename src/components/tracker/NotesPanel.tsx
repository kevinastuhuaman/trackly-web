"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateTrackerNote } from "@/hooks/useTracker";

export function NotesPanel({ jobId }: { jobId: number }) {
  const [noteText, setNoteText] = useState("");
  const createNote = useCreateTrackerNote();

  return (
    <div className="space-y-2 rounded-md border border-borderColor bg-backgroundCard p-3">
      <h4 className="text-sm font-semibold">Notes</h4>
      <textarea
        value={noteText}
        onChange={(event) => setNoteText(event.target.value)}
        className="h-24 w-full rounded-md border border-borderColor bg-backgroundSecondary p-2 text-sm"
        placeholder="Add a note"
      />
      <Button
        size="sm"
        onClick={() => {
          if (!noteText.trim()) return;
          createNote.mutate({ jobId, noteText });
          setNoteText("");
        }}
      >
        Save Note
      </Button>
    </div>
  );
}
