import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-borderColor bg-backgroundSecondary px-3 text-sm text-textPrimary outline-none ring-0 placeholder:text-textTertiary focus:border-accent",
        props.className
      )}
    />
  );
}
