import type { PreferencesPayload, Profile } from "@/lib/types";

const PROFILE_KEY = "trackly_profile_cache";
const PREFS_KEY = "trackly_preferences_cache";
const PWA_DISMISS_KEY = "trackly_pwa_prompt_dismissed";

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readCachedProfile() {
  return safeGet<Profile>(PROFILE_KEY);
}

export function writeCachedProfile(profile: Profile) {
  safeSet(PROFILE_KEY, profile);
}

export function readCachedPreferences() {
  return safeGet<PreferencesPayload>(PREFS_KEY);
}

export function writeCachedPreferences(preferences: PreferencesPayload) {
  safeSet(PREFS_KEY, preferences);
}

export function isPwaPromptDismissed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PWA_DISMISS_KEY) === "1";
}

export function dismissPwaPrompt() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PWA_DISMISS_KEY, "1");
}
