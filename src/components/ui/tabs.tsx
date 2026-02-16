import { cn } from "@/lib/utils";

export function Tabs({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
}
