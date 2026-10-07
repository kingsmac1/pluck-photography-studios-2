import { useCallback, useEffect, useRef, useState } from "react";
import { BookNow } from "./BookNow";
import { heroSlides } from "@/lib/site";
import { cn } from "@/lib/utils";

const DURATION = 6000;

/** Full-bleed crossfade hero with a looping segmented progress bar beneath it. */
export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(0);

  const goTo = useCallback((next: number) => {
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
    setProgress(0);
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    let frame = 0;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      if (elapsed >= DURATION) {
        startRef.current = now;
        setProgress(0);
        setIndex((i) => (i + 1) % heroSlides.length);
      } else {
        setProgress(elapsed / DURATION);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const active = heroSlides[index] ?? heroSlides[0]!;

  return (
    <section className="relative">
      <div className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-background">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.image}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              i === index ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={cn("h-full w-full object-cover", i === index && "animate-ken-burns")}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/45 to-background/70" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-28">
            <p key={`e-${index}`} className="eyebrow animate-fade-in">
              {active.eyebrow}
            </p>
            <h1
              key={`t-${index}`}
              className="display mt-6 max-w-4xl animate-fade-in text-[clamp(2.6rem,7vw,5.6rem)]"
            >
              {active.title}
            </h1>
            <p
              key={`c-${index}`}
              className="mt-6 max-w-xl animate-fade-in text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {active.caption}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <BookNow />
              <a
                href="#galleries"
                className="link-underline text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
              >
                View Galleries
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Looping segmented loading bar */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-6 lg:px-10">
        <span className="text-[11px] tracking-[0.24em] text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-1 gap-3">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}: ${slide.title}`}
              className="group relative h-px flex-1 bg-border transition-[height] duration-300 hover:h-0.5"
            >
              <span
                className="absolute inset-y-0 left-0 bg-foreground"
                style={{
                  width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%",
                  transition: i === index ? "none" : "width 600ms ease",
                }}
              />
            </button>
          ))}
        </div>
        <span className="text-[11px] tracking-[0.24em] text-muted-foreground">
          {String(heroSlides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
