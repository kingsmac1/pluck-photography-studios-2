import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/CtaBanner";
import { GalleryCards } from "@/components/GalleryCards";
import { PageHero } from "@/components/PageHero";
import { PricingSection } from "@/components/PricingSection";
import { Reveal } from "@/components/Reveal";
import { photos } from "@/lib/photos";
import { pages } from "@/lib/site";

const { hero, steps } = pages.services;

const title = "Photography Services in Calgary | Pluck";
const description =
  "Wedding, birthday, event, portrait, family, kids and maternity photography services from our Calgary studio, plus what to expect from every session.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={photos.bannerWide2}
      />

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="grid gap-6 border-t border-border pt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <Reveal key={item.step} delay={i * 100}>
              <p className="eyebrow">{item.step}</p>
              <p className="display mt-4 text-2xl">{item.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <GalleryCards
        eyebrow="Our Services"
        heading="Choose Your Session"
        intro="Every card opens a full gallery with sample work and detail on how that session runs."
      />

      <PricingSection />
      <CtaBanner />
    </>
  );
}
