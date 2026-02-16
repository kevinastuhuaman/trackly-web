import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 rounded-md border border-borderColor bg-backgroundSecondary px-3 text-sm text-textPrimary outline-none focus:border-accent",
        props.className
      )}
    />
  );
}
