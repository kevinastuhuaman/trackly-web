"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="max-w-md rounded-xl border border-borderColor bg-backgroundCard p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
        <p className="mb-4 text-sm text-textSecondary">A rendering error occurred. You can retry safely.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
