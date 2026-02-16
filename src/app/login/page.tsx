import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { AppleSignIn } from "@/components/auth/AppleSignIn";
import { Card } from "@/components/ui/card";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Google sign-in was canceled. Please try again.",
  state_expired: "Your sign-in session expired. Please try again.",
  state_mismatch: "Your sign-in verification failed. Please restart sign-in.",
  missing_code: "Google did not return an authorization code. Please retry.",
  invalid_code: "The Google sign-in code is invalid or already used. Try again.",
  google_not_configured: "Google sign-in is not configured for this environment.",
  google_timeout: "Google sign-in timed out. Check your connection and retry.",
  google_network_error: "Unable to reach Google right now. Please retry shortly.",
  google_exchange_failed: "Google token exchange failed. Please retry.",
  id_token_missing: "Google did not provide an ID token. Please retry.",
  backend_timeout: "Trackly auth timed out. Please retry in a moment.",
  backend_network_error: "Unable to reach Trackly API. Check your internet and retry.",
  backend_auth_failed: "Trackly rejected the sign-in request. Please try again.",
  backend_rejected: "Trackly could not verify your account with Google.",
  backend_token_missing: "Sign-in succeeded but no access token was returned.",
  payload_parse_failed: "Sign-in payload was malformed. Please restart sign-in.",
  token_missing: "No auth token received. Please sign in again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string | string[] }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawError = resolvedSearchParams?.error;
  const errorCode = Array.isArray(rawError) ? rawError[0] : rawError;
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] || "Sign-in failed. Please try again." : null;

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center text-sm text-textSecondary transition hover:text-textPrimary">
          &larr; Back to Trackly
        </Link>
        <div className="mt-8 rounded-3xl border border-borderColor bg-backgroundSecondary p-7 sm:p-10">
          <h1 className="font-[var(--font-display)] text-3xl font-semibold text-textPrimary sm:text-4xl">
            Sign in to Trackly
          </h1>
          <p className="mt-4 text-textSecondary">
            Continue with Google or Apple to unlock full job details, one-tap apply, and your tracker board.
          </p>

          <div className="mt-6 max-w-md">
            <Card className="grid gap-3 border-white/15 bg-black/25 p-4">
              {errorMessage && (
                <div className="rounded-lg border border-red-400/35 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                  {errorMessage}
                  {errorCode && <span className="ml-2 text-red-200/70">({errorCode})</span>}
                </div>
              )}
              <GoogleSignIn />
              <AppleSignIn />
            </Card>
          </div>

          <p className="mt-6 text-sm text-textSecondary">
            Need to review jobs first? Go directly to{" "}
            <Link href="/jobs" className="text-accent transition hover:text-accentHover">
              the jobs feed
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
