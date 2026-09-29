import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHero } from "@/components/PageHero";
import { PricingSection } from "@/components/PricingSection";
import { Reveal } from "@/components/Reveal";
import { TestimonialCoverflow } from "@/components/TestimonialCoverflow";
import { photos } from "@/lib/photos";
import { pricingFaqs } from "@/lib/site";

const title = "Studio Session Pricing | Pluck Photography";
const description =
  "Silver, Gold and Platinum studio session pricing from $260, including outfit changes, hand-edited high resolution images and full direction.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing Plan"
        title="Simple, Transparent Rates"
        intro="Studio session pricing with no hidden extras. Wedding and event coverage is quoted per day."
        image={photos.bannerWide1}
      />

      <PricingSection withHeading={false} />

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Good To Know</p>
          <h2 className="display mt-5 text-[clamp(1.9rem,4vw,3.2rem)]">Frequently Asked</h2>
        </Reveal>
        <div className="mt-14 grid gap-x-14 gap-y-10 border-t border-border pt-14 lg:grid-cols-2">
          {pricingFaqs.map((faq, i) => (
            <Reveal key={faq.q} delay={(i % 2) * 110}>
              <p className="display text-xl">{faq.q}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <TestimonialCoverflow />
      <CtaBanner />
    </>
  );
}
