import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { galleries } from "@/lib/site";

/** Grid of category cards linking to each single gallery page. */
export function GalleryCards({
  eyebrow = "Galleries",
  heading = "What We Photograph",
  intro,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
}) {
  return (
    <section id="galleries" className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.6rem)]">{heading}</h2>
        {intro ? (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">{intro}</p>
        ) : null}
      </Reveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery, i) => (
          <Reveal key={gallery.slug} delay={(i % 3) * 90}>
            <Link
              to="/gallery/$slug"
              params={{ slug: gallery.slug }}
              className="hover-zoom group block h-full overflow-hidden rounded-lg bg-surface"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <img
                  src={gallery.cover}
                  alt={`${gallery.name} photography by Pluck Photography Studios`}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow">{gallery.eyebrow}</p>
                  <h3 className="display mt-2 text-2xl">{gallery.name}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 p-6">
                <p className="min-w-0 text-sm text-muted-foreground">{gallery.tagline}</p>
                <span
                  aria-hidden
                  className="shrink-0 text-lg transition-transform duration-500 group-hover:translate-x-1"
                >
                  &#8594;
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
