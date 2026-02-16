"use client";

import { useEffect, useState } from "react";
import { dismissPwaPrompt, isPwaPromptDismissed } from "@/lib/local-cache";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaInstallBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone || isPwaPromptDismissed()) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setHidden(false);
    };

    const handleInstalled = () => {
      setPromptEvent(null);
      setHidden(true);
      dismissPwaPrompt();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (hidden || !promptEvent) return null;

  return (
    <div className="fixed left-0 right-0 top-9 z-[59] px-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-lg border border-borderColor bg-backgroundCard/95 px-3 py-2 backdrop-blur">
        <p className="text-xs text-textSecondary">Install Trackly for faster access and app-like navigation.</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-borderColor px-2 py-1 text-xs text-textSecondary"
            onClick={() => {
              dismissPwaPrompt();
              setHidden(true);
            }}
          >
            Dismiss
          </button>
          <button
            type="button"
            className="rounded bg-accent px-2 py-1 text-xs text-white"
            onClick={async () => {
              await promptEvent.prompt();
              const choice = await promptEvent.userChoice;
              if (choice.outcome === "dismissed") {
                dismissPwaPrompt();
              }
              setHidden(true);
              setPromptEvent(null);
            }}
          >
            Install Trackly
          </button>
        </div>
      </div>
    </div>
  );
}
