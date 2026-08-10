import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHero } from "@/components/PageHero";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { TestimonialCoverflow } from "@/components/TestimonialCoverflow";
import { photos } from "@/lib/photos";

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

const values = [
  {
    title: "Precision",
    copy: "Light, lens and timing are decided deliberately. Nothing in the frame is there by accident.",
  },
  {
    title: "Patience",
    copy: "We wait for the real expression instead of asking for a performance. It takes longer and it shows.",
  },
  {
    title: "Care",
    copy: "You are guided from the first email to the final delivery, so the session feels easy rather than exposing.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Exquisite Images, Made With Care"
        intro="Pluck Photography Studios is a Calgary photography studio specializing in portraits, family sessions, corporate headshots, maternity and weddings. We photograph people the way they would like to be remembered."
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
            <p className="eyebrow">The Studio</p>
            <h2 className="display mt-5 text-[clamp(1.9rem,4vw,3.2rem)]">
              Photography That Feels Like You
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground md:text-base">
              We built the studio around one belief: everyone photographs well when they are lit
              properly, directed kindly and given a little time. Most people who tell us they hate
              having their picture taken leave with a favourite.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              From a first birthday to a wedding day, from a headshot to a maternity session, the
              approach is the same — considered light, honest direction, and hand editing on every
              frame we deliver.
            </p>
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
