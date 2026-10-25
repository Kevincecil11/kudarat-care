"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { media, type MediaKey } from "@/lib/media";

type Props = {
  k: MediaKey;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  focus?: string;
};

export function Photo({ k, alt, sizes = "(max-width: 760px) 100vw, 50vw", priority = false, className = "", focus }: Props) {
  const m = media[k];
  const ref = useRef<HTMLImageElement>(null);
  const [fallback, setFallback] = useState(false);

  // If the optimised file fails (including before hydration), switch to the full-resolution master.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFallback(true);
  }, []);

  return (
    <span className={`photo ${className}`.trim()} style={focus ? ({ "--focus": focus } as CSSProperties) : undefined}>
      <img
        ref={ref}
        src={fallback ? m.original : m.large}
        srcSet={fallback ? undefined : `${m.small} 640w, ${m.large} ${m.width}w`}
        sizes={fallback ? undefined : sizes}
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
