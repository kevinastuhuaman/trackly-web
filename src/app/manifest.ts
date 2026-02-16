import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trackly",
    short_name: "Trackly",
    description: "Find jobs. Apply instantly. Get hired.",
    start_url: "/jobs",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [],
  };
}
