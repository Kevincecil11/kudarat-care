"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { resolveMedia } from "@/lib/media-resolve";

type Props = {
  k: string; // media key or image URL
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  focus?: string;
};

export function Photo({ k, alt, sizes = "(max-width: 760px) 100vw, 50vw", priority = false, className = "", focus }: Props) {
  const m = resolveMedia(k, alt);
  const ref = useRef<HTMLImageElement>(null);
  const [fallback, setFallback] = useState(false);

  // If the optimised file fails (including before hydration), switch to the full-resolution master.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFallback(true);
  }, []);

  const single = m.small === m.large;
  return (
    <span className={`photo ${className}`.trim()} style={focus ? ({ "--focus": focus } as CSSProperties) : undefined}>
      <img
        ref={ref}
        src={fallback ? m.original : m.large}
        srcSet={fallback || single ? undefined : `${m.small} 640w, ${m.large} ${m.width}w`}
        sizes={fallback || single ? undefined : sizes}
        width={m.width}
        height={m.height}
        alt={alt ?? m.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFallback(true)}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </span>
  );
}
