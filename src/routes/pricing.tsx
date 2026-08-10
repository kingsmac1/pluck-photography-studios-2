import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHero } from "@/components/PageHero";
import { PricingSection } from "@/components/PricingSection";
import { Reveal } from "@/components/Reveal";
import { TestimonialCoverflow } from "@/components/TestimonialCoverflow";
import { photos } from "@/lib/photos";

const title = "Pricing — Pluck Photography Studios";
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
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const faqs = [
  {
    q: "What is included in every session?",
    a: "Direction throughout, professional studio lighting, hand editing on each delivered frame and a private online gallery for downloads.",
  },
  {
    q: "How are weddings and events priced?",
    a: "Coverage is quoted per day based on your timeline, locations and the number of photographers required. Get in touch for a tailored estimate.",
  },
  {
    q: "When do we receive the images?",
    a: "A preview set arrives within 48 hours, with the full hand-edited gallery following within two weeks for sessions.",
  },
  {
    q: "Can we add extra images?",
    a: "Yes. Additional edited images from your session can be purchased individually after you have seen the gallery.",
  },
];

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
          {faqs.map((faq, i) => (
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
