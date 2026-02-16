"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function ConnectivityBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] border-b border-warning/40 bg-warning/20 px-4 py-2 text-center text-xs text-warning">
      Unable to connect. You appear to be offline.
    </div>
  );
}
