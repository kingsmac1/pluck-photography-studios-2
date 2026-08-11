import { useEffect, useState } from "react";
import { photos } from "@/lib/photos";

/**
 * Black screen with a breathing logo, then a vertical curtain reveal
 * that splits away to expose the page.
 */
export function Preloader() {
  const [phase, setPhase] = useState<"breathing" | "revealing" | "done">("breathing");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }
    document.body.style.overflow = "hidden";
    const toReveal = window.setTimeout(() => setPhase("revealing"), 1300);
    const toDone = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 2500);
    return () => {
      window.clearTimeout(toReveal);
      window.clearTimeout(toDone);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const revealing = phase === "revealing";

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-background transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: revealing ? "translateY(-100%)" : "none" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-background transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: revealing ? "translateY(100%)" : "none" }}
      />
      <div
        className="absolute inset-0 grid place-items-center transition-opacity duration-500"
        style={{ opacity: revealing ? 0 : 1 }}
      >
        <img
          src={photos.logo}
          alt=""
          className="w-52 animate-breathe opacity-90 md:w-64"
        />
      </div>
    </div>
  );
}
