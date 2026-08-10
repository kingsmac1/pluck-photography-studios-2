import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/CtaBanner";
import { GalleryCards } from "@/components/GalleryCards";
import { HeroSlider } from "@/components/HeroSlider";
import { Parallax } from "@/components/Parallax";
import { PricingSection } from "@/components/PricingSection";
import { Reveal } from "@/components/Reveal";
import { TestimonialCoverflow } from "@/components/TestimonialCoverflow";
import { photos } from "@/lib/photos";

const title = "Pluck Photography Studios — Calgary Portrait & Wedding Photography";
const description =
  "Calgary photography studio for portraits, weddings, events, family, maternity and kids sessions. View our galleries and book your session online.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const stats = [
  { value: "10+", label: "Years Behind The Lens" },
  { value: "900+", label: "Sessions Photographed" },
  { value: "7", label: "Specialist Galleries" },
  { value: "48h", label: "Preview Turnaround" },
];

function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">Who We Are</p>
            <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.6rem)]">
              A Studio Built On Light And Patience
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground md:text-base">
              Pluck Photography Studios is a Calgary-based studio specializing in portraits, family
              sessions, corporate headshots, maternity and wedding photography. We create exquisite
              images with precision, care and a little artistic flair.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              Every session is unhurried. You are guided rather than posed, and the result looks like
              you on a very good day — not like someone else entirely.
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-y-10 border-t border-border pt-10 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="display text-3xl">{stat.value}</dt>
                  <dd className="eyebrow mt-2">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={130} className="grid grid-cols-2 gap-5">
            <Parallax speed={0.14} className="hover-zoom overflow-hidden rounded-lg">
              <img
                src={photos.a5}
                alt="Studio portrait session in Calgary"
                loading="lazy"
                className="aspect-3/4 w-full object-cover"
              />
            </Parallax>
            <Parallax speed={-0.12} className="hover-zoom mt-12 overflow-hidden rounded-lg">
              <img
                src={photos.p23}
                alt="Wedding photography by Pluck Photography Studios"
                loading="lazy"
                className="aspect-3/4 w-full object-cover"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      <GalleryCards
        intro="Seven specialisms, one consistent standard. Step into any gallery to see the work and read how the sessions run."
      />

      <PricingSection />

      <TestimonialCoverflow />

      <CtaBanner />
    </>
  );
}
