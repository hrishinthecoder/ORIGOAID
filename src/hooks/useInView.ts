import { useEffect, useRef, useState } from "react";

/**
 * Lightweight IntersectionObserver hook.
 * Returns [ref, inView] — inView flips to true the first time the element
 * enters the viewport (with an optional pre-load rootMargin) and stays true
 * by default, so heavy content doesn't unmount when the user scrolls past.
 */
export function useInView<T extends Element = HTMLDivElement>(options?: {
  rootMargin?: string;
  threshold?: number | number[];
  /** If true, flips back to false when element leaves the viewport. Default false. */
  reobserve?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true); // SSR or unsupported — just show it
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!options?.reobserve) obs.disconnect();
        } else if (options?.reobserve) {
          setInView(false);
        }
      },
      {
        rootMargin: options?.rootMargin ?? "200px",
        threshold: options?.threshold ?? 0,
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options?.rootMargin, options?.threshold, options?.reobserve]);

  return [ref, inView] as const;
}
