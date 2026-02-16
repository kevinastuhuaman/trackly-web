"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authenticateWithMobile, getCurrentUser } from "@/lib/api";
import { clearAuth, persistAuth, readAuthState } from "@/lib/auth";
import type { AuthProvider, AuthState, User } from "@/lib/types";

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  signInWithIdToken: (provider: AuthProvider, idToken: string) => Promise<void>;
  signOut: () => void;
  setAuth: (token: string, user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>(() => readAuthState());

  useEffect(() => {
    const validate = async () => {
      if (!state.hydrated || !state.token) return;
      try {
        const response = await getCurrentUser();
        if (response.user) {
          persistAuth(state.token, response.user);
          setState({ token: state.token, user: response.user, hydrated: true });
        }
      } catch {
        clearAuth();
        setState({ token: null, user: null, hydrated: true });
      }
    };

    void validate();
  }, [state.hydrated, state.token]);

  const signInWithIdToken = useCallback(async (provider: AuthProvider, idToken: string) => {
    const response = await authenticateWithMobile(provider, idToken);

    if (!response.success || !response.token) {
      throw new Error(response.error || response.message || "Failed to authenticate");
    }

    persistAuth(response.token, response.user ?? null);
    setState({ token: response.token, user: response.user ?? null, hydrated: true });
  }, []);

  const signOut = useCallback(() => {
    clearAuth();
    queryClient.clear();
    setState({ token: null, user: null, hydrated: true });
  }, [queryClient]);

  const setAuth = useCallback((token: string, user: User | null) => {
    persistAuth(token, user);
    setState({ token, user, hydrated: true });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token),
      signInWithIdToken,
      signOut,
      setAuth,
    }),
    [setAuth, signInWithIdToken, signOut, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
