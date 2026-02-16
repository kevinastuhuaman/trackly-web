"use client";

import { useState } from "react";

const shortcuts = [
  { key: "J / K", action: "Navigate list" },
  { key: "A", action: "Apply" },
  { key: "S", action: "Save (check later)" },
  { key: "X", action: "Dismiss" },
  { key: "U", action: "Undo" },
  { key: "Enter", action: "Open job" },
  { key: "Esc", action: "Close selection" },
  { key: "Cmd/Ctrl + K", action: "Open command palette" },
];

export function ShortcutHints() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-3 top-3 z-40 hidden lg:block">
      <button
        type="button"
        className="rounded-full border border-borderColor bg-backgroundCard px-2 py-1 text-xs text-textSecondary hover:text-textPrimary"
        title="Keyboard shortcuts"
        onClick={() => setOpen((value) => !value)}
      >
        ?
      </button>

      {open && (
        <div className="mt-2 w-64 rounded-lg border border-borderColor bg-backgroundCard p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold text-textPrimary">Keyboard shortcuts</p>
          <ul className="space-y-1 text-xs text-textSecondary">
            {shortcuts.map((shortcut) => (
              <li key={shortcut.key} className="flex items-center justify-between gap-2">
                <span className="rounded bg-backgroundSecondary px-1.5 py-0.5 font-mono text-[11px] text-textPrimary">
                  {shortcut.key}
                </span>
                <span>{shortcut.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
