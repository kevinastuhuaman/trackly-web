"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import "@/styles/job-description.css";

export function JobDescription({ html, expanded, onToggle }: { html?: string | null; expanded: boolean; onToggle: () => void }) {
  const sanitizedHtml = useMemo(
    () =>
      DOMPurify.sanitize(html ?? "", {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
      }),
    [html]
  );

  if (!html) {
    return <p className="text-sm text-textSecondary">No job description available.</p>;
  }

  return (
    <div className="space-y-2">
      <div className={`job-description overflow-hidden text-sm text-textPrimary ${expanded ? "max-h-none" : "max-h-[320px]"}`}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </div>
      <button type="button" className="text-xs text-accent" onClick={onToggle}>
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
