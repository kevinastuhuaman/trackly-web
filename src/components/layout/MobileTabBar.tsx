"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, UserRound } from "lucide-react";
import { useNewJobsCount } from "@/hooks/useNewJobsCount";
import { cn } from "@/lib/utils";

const items = [
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const { count: newJobsCount } = useNewJobsCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-borderColor bg-backgroundSecondary px-2 py-2 lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-md py-1 text-xs",
                active ? "text-accent" : "text-textSecondary"
              )}
            >
              <item.icon className="mb-1 h-4 w-4" />
              {item.label}
              {item.href === "/jobs" && newJobsCount > 0 && (
                <span className="absolute right-4 top-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {newJobsCount > 99 ? "99+" : newJobsCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
