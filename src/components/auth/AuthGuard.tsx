"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/jobs");
      router.replace(`/login?next=${next}`);
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated) {
    return <div className="flex min-h-screen items-center justify-center text-textSecondary">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
