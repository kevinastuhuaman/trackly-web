"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { getJobs } from "@/lib/api";

const quickLinks = [
  { href: "/jobs", label: "Jobs", description: "Go to jobs feed" },
  { href: "/companies", label: "Companies", description: "Browse companies" },
  { href: "/tracker", label: "Tracker", description: "Open kanban board" },
  { href: "/settings", label: "Settings", description: "Manage preferences" },
  { href: "/profile", label: "Profile", description: "Edit profile and resume" },
];

type PaletteItem = {
  id: string;
  href: string;
  label: string;
  description: string;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);
  const panelRef = useFocusTrap<HTMLDivElement>(open, closePalette);
  const normalizedQuery = query.trim().toLowerCase();

  const jobsSearch = useQuery({
    queryKey: ["command-palette-jobs", normalizedQuery],
    queryFn: () => getJobs({ search: normalizedQuery, limit: 8, offset: 0, sort: "newest" }),
    enabled: open && normalizedQuery.length >= 2,
    staleTime: 60_000,
  });

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => {
          const next = !current;
          if (!next) {
            setQuery("");
          }
          if (next || current) {
            setActiveIndex(0);
          }
          return next;
        });
      }
      if (event.key === "Escape") {
        closePalette();
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [closePalette]);

  const filtered = useMemo(() => {
    const links = normalizedQuery
      ? quickLinks.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(normalizedQuery))
      : quickLinks;

    const routeItems: PaletteItem[] = links.map((item) => ({
      id: `route:${item.href}`,
      href: item.href,
      label: item.label,
      description: item.description,
    }));

    const jobItems: PaletteItem[] = (jobsSearch.data?.jobs ?? []).map((job) => ({
      id: `job:${job.id}`,
      href: `/jobs/${job.id}`,
      label: job.title,
      description: `${job.companyName} ${job.location ? `• ${job.location}` : ""}`.trim(),
    }));

    if (!normalizedQuery) {
      return routeItems;
    }

    return [...routeItems, ...jobItems];
  }, [jobsSearch.data?.jobs, normalizedQuery]);

  const activeItemIndex = filtered.length ? Math.min(activeIndex, filtered.length - 1) : 0;

  const navigate = useCallback(
    (href: string) => {
      closePalette();
      router.push(href);
    },
    [closePalette, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-4" onClick={closePalette}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabIndex={-1}
        className="mx-auto mt-20 max-w-xl rounded-xl border border-borderColor bg-backgroundCard p-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center gap-2 rounded-md border border-borderColor bg-backgroundSecondary px-3">
          <Search className="h-4 w-4 text-textSecondary" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((current) => (filtered.length ? (current + 1) % filtered.length : current));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((current) => (filtered.length ? (current - 1 + filtered.length) % filtered.length : current));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                const target = filtered[activeItemIndex];
                if (target) {
                  navigate(target.href);
                }
              }
            }}
            className="h-10 w-full border-0 bg-transparent text-sm text-textPrimary outline-none ring-0 placeholder:text-textTertiary"
            placeholder="Jump to pages or search jobs by title"
          />
        </div>

        <div className="space-y-1">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`block w-full rounded-md px-3 py-2 text-left ${index === activeItemIndex ? "bg-backgroundSecondary" : "hover:bg-backgroundSecondary"}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => navigate(item.href)}
            >
              <p className="text-sm text-textPrimary">{item.label}</p>
              <p className="text-xs text-textSecondary">{item.description}</p>
            </button>
          ))}

          {!jobsSearch.isFetching && !filtered.length && (
            <div className="rounded-md border border-dashed border-borderColor px-3 py-4 text-center text-sm text-textSecondary">
              No matches found.
            </div>
          )}

          {jobsSearch.isFetching && normalizedQuery.length >= 2 && (
            <div className="px-3 py-2 text-xs text-textSecondary">Searching jobs...</div>
          )}

          <div className="px-3 pt-2 text-[11px] text-textTertiary">Use ↑ ↓ to navigate and Enter to jump.</div>
        </div>
      </div>
    </div>
  );
}
