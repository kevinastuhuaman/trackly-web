"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-black text-white">
        <div className="rounded-xl border border-borderColor bg-backgroundCard p-6 text-center">
          <h2 className="text-lg font-semibold">Unexpected App Error</h2>
          <p className="my-3 text-sm text-textSecondary">The app crashed and recovered into safe mode.</p>
          <Button onClick={reset}>Reload state</Button>
        </div>
      </body>
    </html>
  );
}
