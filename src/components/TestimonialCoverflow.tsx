import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { testimonials } from "@/lib/site";

/** 3D coverflow: items rotate, scale and fade as they leave centre. */
export function TestimonialCoverflow() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % testimonials.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  const go = (delta: number) =>
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);

  return (
    <section className="overflow-hidden bg-surface py-24 lg:py-32">
      <Reveal className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="eyebrow">Testimonials</p>
        <h2 className="display mt-5 max-w-2xl text-[clamp(2rem,4.4vw,3.6rem)]">
          What Our Clients Are Saying
        </h2>
      </Reveal>

      <div
        className="relative mt-16 h-[360px] [perspective:1400px]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {testimonials.map((item, i) => {
          const half = Math.floor(testimonials.length / 2);
          let offset = i - index;
          if (offset > half) offset -= testimonials.length;
          if (offset < -half) offset += testimonials.length;
          const abs = Math.abs(offset);

          return (
            <article
              key={item.name}
              aria-hidden={abs > 1}
              className="absolute left-1/2 top-0 w-[min(88vw,420px)] rounded-lg bg-surface-raised p-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:p-10"
              style={{
                transform: `translateX(-50%) translateX(${offset * 62}%) translateZ(${-abs * 220}px) rotateY(${offset * -34}deg) scale(${1 - abs * 0.08})`,
                opacity: abs > 2 ? 0 : 1 - abs * 0.34,
                zIndex: 10 - abs,
                pointerEvents: offset === 0 ? "auto" : "none",
                filter: `blur(${abs * 1.2}px)`,
              }}
            >
              <span aria-hidden className="display block text-5xl leading-none text-muted-foreground">
                &ldquo;
              </span>
              <p className="mt-6 text-base leading-relaxed text-foreground/90">{item.quote}</p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                {item.name}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-4 flex max-w-[1400px] items-center justify-center gap-4 px-6 lg:px-10">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"
        >
          &#8592;
        </button>
        <div className="flex gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${t.name}`}
              className="h-1.5 rounded-full bg-border transition-all duration-500"
              style={{ width: i === index ? 28 : 8, background: i === index ? "currentColor" : "" }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"
        >
          &#8594;
        </button>
      </div>
    </section>
  );
}
