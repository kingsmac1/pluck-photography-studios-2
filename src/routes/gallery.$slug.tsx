import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CtaBanner } from "@/components/CtaBanner";
import { Lightbox } from "@/components/Lightbox";
import { PageHero } from "@/components/PageHero";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { galleries, type Gallery } from "@/lib/site";

export const Route = createFileRoute("/gallery/$slug")({
  loader: ({ params }) => {
    const gallery: Gallery | undefined = galleries.find((g) => g.slug === params.slug);
    if (!gallery) throw notFound();
    return { gallery };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Gallery not found — Pluck Photography Studios" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.gallery.name} Photography — Pluck Photography Studios`;
    const description = loaderData.gallery.intro.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/gallery/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/gallery/${params.slug}` }],
    };
  },
  component: GalleryPage,
});

function GalleryPage() {
  const { gallery } = Route.useLoaderData() as { gallery: Gallery };
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow={gallery.eyebrow}
        title={`${gallery.name} Photography`}
        intro={gallery.intro}
        image={gallery.cover}
      />

      <section className="mx-auto max-w-[1400px] px-6 pb-8 lg:px-10">
        <div className="grid gap-10 border-t border-border pt-14 lg:grid-cols-2">
          {gallery.body.map((paragraph, i) => (
            <Reveal key={paragraph} delay={i * 110}>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="columns-2 gap-4 sm:gap-6 lg:columns-3 [&>*]:mb-4 sm:[&>*]:mb-6">
          {gallery.images.map((src, i) => {
            const shapes = ["aspect-4/5", "aspect-square", "aspect-3/4", "aspect-2/3"] as const;
            const shape = shapes[i % shapes.length];
            return (
              <Reveal key={`${src}-${i}`} delay={(i % 3) * 90} className="break-inside-avoid">
                <Parallax speed={i % 3 === 1 ? 0.08 : 0.02} className="hover-zoom rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="block w-full cursor-zoom-in"
                    aria-label={`Open ${gallery.name} photo ${i + 1} in lightbox`}
                  >
                    <img
                      src={src}
                      alt={`${gallery.name} photography frame ${i + 1}`}
                      loading="lazy"
                      className={`w-full rounded-lg object-cover ${shape}`}
                    />
                  </button>
                </Parallax>
              </Reveal>
            );
          })}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={gallery.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          altPrefix={`${gallery.name} photography frame`}
        />
      )}

      <CtaBanner />
    </>
  );
}