import type { AuthState, User } from "@/lib/types";

const TOKEN_KEY = "trackly_auth_token";
const USER_KEY = "trackly_user";

export function readAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { token: null, user: null, hydrated: false };
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  const rawUser = window.localStorage.getItem(USER_KEY);
  let user: User | null = null;

  if (rawUser) {
    try {
      user = JSON.parse(rawUser) as User;
    } catch {
      user = null;
    }
  }

  return { token, user, hydrated: true };
}

export function persistAuth(token: string, user: User | null) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function readToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
