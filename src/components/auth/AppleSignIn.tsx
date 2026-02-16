"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => void;
      };
    };
  }
}

export function AppleSignIn() {
  const { signInWithIdToken } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);

    const onSuccess = async (event: Event) => {
      const detail = (event as CustomEvent).detail as { authorization?: { id_token?: string } };
      const idToken = detail?.authorization?.id_token;
      if (!idToken) return;
      try {
        setLoading(true);
        await signInWithIdToken("apple", idToken);
        window.location.href = "/jobs";
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to sign in with Apple");
      } finally {
        setLoading(false);
      }
    };

    const onFailure = () => {
      toast.error("Apple sign-in cancelled or failed");
    };

    document.addEventListener("AppleIDSignInOnSuccess", onSuccess);
    document.addEventListener("AppleIDSignInOnFailure", onFailure);

    return () => {
      document.removeEventListener("AppleIDSignInOnSuccess", onSuccess);
      document.removeEventListener("AppleIDSignInOnFailure", onFailure);
      script.remove();
    };
  }, [signInWithIdToken]);

  const handleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
    const redirectURI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

    if (!window.AppleID || !clientId || !redirectURI) {
      toast.error("Apple Sign-In is not configured");
      return;
    }

    window.AppleID.auth.init({
      clientId,
      scope: "name email",
      redirectURI,
      usePopup: true,
    });

    window.AppleID.auth.signIn();
  };

  return (
    <Button type="button" variant="secondary" size="lg" className="w-full gap-2" onClick={handleSignIn} disabled={loading}>
      <Apple className="h-4 w-4" />
      {loading ? "Signing in..." : "Sign in with Apple"}
    </Button>
  );
}
