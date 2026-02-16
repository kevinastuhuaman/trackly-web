import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-borderColor bg-backgroundCard", className)} {...props}>
      {children}
    </div>
  );
}
