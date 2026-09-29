import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { galleries } from "@/lib/site";

/** Compact, equal-height cards pointing to other galleries — used on gallery detail pages, distinct from the masonry-style GalleryCards grid. */
export function RelatedGalleries({
  exclude,
  limit = 3,
  eyebrow = "Explore More",
  heading = "Other Sessions",
}: {
  exclude: string;
  limit?: number;
  eyebrow?: string;
  heading?: string;
}) {
  const items = galleries.filter((gallery) => gallery.slug !== exclude).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)]">{heading}</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {items.map((gallery, i) => (
          <Reveal key={gallery.slug} delay={i * 90}>
            <Link
              to="/gallery/$slug"
              params={{ slug: gallery.slug }}
              className="hover-zoom group block overflow-hidden rounded-lg bg-surface"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <img
                  src={gallery.cover}
                  alt={`${gallery.name} photography by Pluck Photography Studios`}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
                    {gallery.eyebrow}
                  </p>
                  <h3 className="display mt-1 text-sm sm:text-base">{gallery.name}</h3>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
