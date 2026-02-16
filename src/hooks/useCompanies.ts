"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "@/lib/api";

export function useCompanies(locationFilter?: string, jobModality?: string) {
  return useQuery({
    queryKey: ["companies", locationFilter ?? "all", jobModality ?? "all"],
    queryFn: () => getCompanies(locationFilter, jobModality),
    staleTime: 10 * 60 * 1000,
  });
}
