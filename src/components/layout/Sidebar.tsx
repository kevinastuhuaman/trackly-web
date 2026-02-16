"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, ChartColumnStacked, Settings, UserRound } from "lucide-react";
import { useNewJobsCount } from "@/hooks/useNewJobsCount";
import { cn } from "@/lib/utils";

const items = [
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: ChartColumnStacked },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { count: newJobsCount } = useNewJobsCount();

  return (
    <aside className="hidden h-screen w-60 shrink-0 border-r border-borderColor bg-backgroundSecondary p-4 lg:block">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-semibold">Trackly</h1>
        <p className="text-xs text-textSecondary">Find jobs. Apply instantly.</p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-accent/20 text-accent" : "text-textSecondary hover:bg-backgroundCard hover:text-textPrimary"
              )}
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.href === "/jobs" && newJobsCount > 0 && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {newJobsCount > 99 ? "99+" : newJobsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
