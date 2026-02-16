"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthFinalizePage() {
  const router = useRouter();

  useEffect(() => {
    const fragment = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(fragment);
    const payload = params.get("payload");

    if (!payload) {
      router.replace("/login?error=missing_payload");
      return;
    }

    try {
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
      const decoded = JSON.parse(atob(padded)) as {
        token?: string;
        user?: unknown;
      };

      if (!decoded.token) {
        router.replace("/login?error=token_missing");
        return;
      }

      window.localStorage.setItem("trackly_auth_token", decoded.token);
      if (decoded.user) {
        window.localStorage.setItem("trackly_user", JSON.stringify(decoded.user));
      }

      router.replace("/jobs");
    } catch {
      router.replace("/login?error=payload_parse_failed");
    }
  }, [router]);

  return <div className="grid min-h-screen place-items-center text-textSecondary">Finalizing sign in...</div>;
}
