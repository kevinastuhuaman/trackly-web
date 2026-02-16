"use client";

import { useParams } from "next/navigation";
import { JobDetail } from "@/components/jobs/JobDetail";
import { useJobDetail } from "@/hooks/useJobDetail";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const detail = useJobDetail(Number.isFinite(id) ? id : null);

  return <JobDetail job={detail.data ?? null} />;
}
