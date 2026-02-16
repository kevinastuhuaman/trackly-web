"use client";

import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "@/lib/api";

export function useMetrics() {
  return useQuery({ queryKey: ["metrics"], queryFn: getMetrics });
}
