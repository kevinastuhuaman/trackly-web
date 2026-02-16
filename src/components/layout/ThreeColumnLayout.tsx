import { cn } from "@/lib/utils";

export function ThreeColumnLayout({
  left,
  center,
  right,
  className,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("hidden h-screen w-full grid-cols-[240px_380px_1fr] lg:grid", className)}>
      <div className="border-r border-borderColor bg-backgroundSecondary">{left}</div>
      <div className="border-r border-borderColor bg-backgroundCard">{center}</div>
      <div className="bg-background">{right}</div>
    </div>
  );
}
