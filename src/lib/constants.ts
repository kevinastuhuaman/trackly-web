import type { JobFunction } from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.track-ly.app/api";

export const BREAKPOINTS = {
  mobile: 768,
  desktop: 1024,
  wide: 1400,
} as const;

export const JOB_FUNCTION_LABELS: Record<JobFunction, string> = {
  product: "Product",
  engineering: "Engineering",
  design: "Design",
  data: "Data",
  marketing: "Marketing",
  sales: "Sales",
  partnerships: "Partnerships",
  finance: "Finance",
  strategy: "Strategy",
  operations: "Operations",
  people: "People",
  other: "Other",
};

export const JOB_FUNCTION_COLORS: Record<JobFunction, string> = {
  product: "var(--product)",
  engineering: "var(--engineering)",
  design: "var(--design)",
  data: "var(--data)",
  marketing: "var(--marketing)",
  sales: "var(--sales)",
  partnerships: "var(--partnerships)",
  finance: "var(--finance)",
  strategy: "var(--strategy)",
  operations: "var(--operations)",
  people: "var(--people)",
  other: "var(--other)",
};

export const LANDING_JOB_FUNCTION_OPTIONS = [
  "all",
  "product",
  "engineering",
  "design",
  "data",
  "marketing",
  "sales",
  "partnerships",
  "finance",
  "strategy",
  "operations",
  "people",
  "other",
] as const;
