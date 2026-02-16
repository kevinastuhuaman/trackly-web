import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://track-ly.app";

  const routes = [
    { path: "", priority: 1, changeFrequency: "daily" as const },
    { path: "/jobs", priority: 0.9, changeFrequency: "hourly" as const },
    { path: "/companies", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/tracker", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/profile", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/settings", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/login", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
