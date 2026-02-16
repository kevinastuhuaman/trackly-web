"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/hooks/useAuth";
import { ConnectivityBanner } from "@/components/layout/ConnectivityBanner";
import { PwaInstallBanner } from "@/components/layout/PwaInstallBanner";
import { ThemeProvider, useThemePreference } from "@/components/layout/ThemeProvider";

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const { theme } = useThemePreference();

  return (
    <AuthProvider>
      <ConnectivityBanner />
      <PwaInstallBanner />
      {children}
      <Toaster position="top-right" theme={theme === "light" ? "light" : "dark"} />
    </AuthProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ProvidersContent>{children}</ProvidersContent>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
