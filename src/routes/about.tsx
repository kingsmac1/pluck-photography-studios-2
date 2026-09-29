import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHero } from "@/components/PageHero";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { TestimonialCoverflow } from "@/components/TestimonialCoverflow";
import { photos } from "@/lib/photos";
import { pages } from "@/lib/site";

const { hero, story, values } = pages.about;

const title = "About Pluck Photography Studios | Calgary";
const description =
  "Meet Pluck Photography Studios, a Calgary photography studio creating exquisite portraits, wedding and family images with precision and artistic flair.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={photos.galleryWide}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <Reveal delay={100} className="order-2 grid grid-cols-2 gap-5 lg:order-1">
            <Parallax speed={-0.1} className="hover-zoom overflow-hidden rounded-lg">
              <img
                src={photos.a4}
                alt="Portrait session at the Calgary studio"
                loading="lazy"
                className="aspect-3/4 w-full object-cover"
              />
            </Parallax>
            <Parallax speed={0.14} className="hover-zoom mt-14 overflow-hidden rounded-lg">
              <img
                src={photos.n2}
                alt="Family photography by Pluck Photography Studios"
                loading="lazy"
                className="aspect-3/4 w-full object-cover"
              />
            </Parallax>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 className="display mt-5 text-[clamp(1.9rem,4vw,3.2rem)]">{story.heading}</h2>
            {story.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-5 text-sm leading-relaxed text-muted-foreground first:mt-8 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="mt-24 grid gap-6 lg:grid-cols-3">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 110}>
              <div className="h-full rounded-lg bg-surface p-8 lg:p-10">
                <p className="display text-2xl">{value.title}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{value.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TestimonialCoverflow />
      <CtaBanner />
    </>
  );
}
