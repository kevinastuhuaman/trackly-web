"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const hasTriggeredRef = useRef(false);

  const normalizedOptions = useMemo(() => {
    const threshold = options?.threshold ?? 0.2;
    return {
      root: options?.root ?? null,
      rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      threshold,
      thresholdKey: Array.isArray(threshold) ? threshold.join(",") : String(threshold),
    };
  }, [options?.root, options?.rootMargin, options?.threshold]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            hasTriggeredRef.current = true;
            observer.disconnect();
          }
        });
      },
      {
        root: normalizedOptions.root,
        rootMargin: normalizedOptions.rootMargin,
        threshold: normalizedOptions.threshold,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [normalizedOptions]);

  return { ref, inView };
}
