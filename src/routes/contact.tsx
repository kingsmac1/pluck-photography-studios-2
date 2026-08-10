import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";
import { CtaBanner } from "@/components/CtaBanner";
import { PageHero } from "@/components/PageHero";
import { photos } from "@/lib/photos";

const title = "Contact — Pluck Photography Studios";
const description =
  "Get in touch with Pluck Photography Studios in Calgary, Alberta. Call, email or send an enquiry about your portrait, wedding or event session.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Say Hello"
        title="Let's Plan Your Session"
        intro="Studio dates in Calgary fill quickly through the season. Send us a note and we will come back with availability."
        image={photos.a6}
      />
      <ContactSection />
      <CtaBanner />
    </>
  );
}
