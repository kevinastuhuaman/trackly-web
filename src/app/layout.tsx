import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/layout/AppProviders";
import { RouteTransition } from "@/components/layout/RouteTransition";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://track-ly.app"),
  title: "Trackly — AI-Powered Job Search for MBA Students",
  description:
    "Find 73,000+ jobs across 761 companies. AI match scoring, one-tap apply, and application tracking. Built for MBA students.",
  openGraph: {
    title: "Trackly — Your Unfair Advantage in Recruiting",
    description:
      "AI-powered job search built for MBA students. 73,000+ jobs, 761 companies, instant apply.",
    url: "https://track-ly.app",
    images: ["/placeholders/og-image-1200x630.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trackly — AI-Powered Job Search",
    description:
      "AI-powered job search built for MBA students. 73,000+ jobs, 761 companies, instant apply.",
    images: ["/placeholders/og-image-1200x630.png"],
  },
  alternates: {
    canonical: "https://track-ly.app",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Trackly",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <RouteTransition>{children}</RouteTransition>
        </AppProviders>
      </body>
    </html>
  );
}
