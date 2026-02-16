import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";
import type { AuthResponse } from "@/lib/types";

function base64urlEncode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function redirectWithError(request: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(code)}`, request.url));
}

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");

  if (error) {
    return redirectWithError(request, error);
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("trackly_oauth_state")?.value;

  if (!expectedState) {
    return redirectWithError(request, "state_expired");
  }

  if (!state || state !== expectedState) {
    return redirectWithError(request, "state_mismatch");
  }

  cookieStore.delete("trackly_oauth_state");

  if (!code) {
    return redirectWithError(request, "missing_code");
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return redirectWithError(request, "google_not_configured");
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetchWithTimeout(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      },
      12_000
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return redirectWithError(request, "google_timeout");
    }
    return redirectWithError(request, "google_network_error");
  }

  if (!tokenResponse.ok) {
    let googleErrorCode = "google_exchange_failed";
    try {
      const payload = (await tokenResponse.json()) as { error?: string };
      if (payload.error === "invalid_grant") {
        googleErrorCode = "invalid_code";
      }
    } catch {
      // ignore parse failures
    }
    return redirectWithError(request, googleErrorCode);
  }

  const tokenPayload = (await tokenResponse.json()) as { id_token?: string };
  if (!tokenPayload.id_token) {
    return redirectWithError(request, "id_token_missing");
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetchWithTimeout(
      `${API_BASE_URL}/auth/mobile`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          token: tokenPayload.id_token,
          idToken: tokenPayload.id_token,
          platform: "web",
        }),
      },
      12_000
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return redirectWithError(request, "backend_timeout");
    }
    return redirectWithError(request, "backend_network_error");
  }

  if (!backendResponse.ok) {
    return redirectWithError(request, "backend_auth_failed");
  }

  const authPayload = (await backendResponse.json()) as AuthResponse;

  if (!authPayload.success || !authPayload.token) {
    return redirectWithError(request, authPayload.error ? "backend_rejected" : "backend_token_missing");
  }

  const payload = base64urlEncode({
    token: authPayload.token,
    user: authPayload.user ?? null,
    ts: Date.now(),
  });

  return NextResponse.redirect(new URL(`/auth/finalize#payload=${payload}`, request.url));
}
