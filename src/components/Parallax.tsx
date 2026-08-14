import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Positive values drift slower than the page, negative drift faster. */
  speed?: number;
};

/** Translates its content on scroll for a depth effect. */
export function Parallax({ children, className, speed = 0.2 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  // Max possible translation in px. Used to both clamp the effect and size
  // the overscan buffer, so a tall section can never translate the image
  // far enough to expose the container's background.
  const maxOffset = Math.abs(speed) * 100;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      // Normalized against viewport height only — deliberately NOT scaled by
      // rect.height, so tall sections don't get a proportionally bigger swing
      // than short ones.
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const clamped = Math.max(-1, Math.min(1, progress));
      setOffset(clamped * maxOffset);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, maxOffset]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden will-change-transform", className)}>
      <div
        className="absolute inset-x-0"
        style={{
          top: `-${maxOffset}px`,
          bottom: `-${maxOffset}px`,
          transform: `translate3d(0, ${offset}px, 0)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}