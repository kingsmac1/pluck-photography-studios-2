import { photos } from "./photos";
import { getGalleryCover, getGalleryImages } from "./gallery-assets";
import { getHeroImage } from "./hero-assets";
import contactJson from "@/content/contact.json";
import galleriesJson from "@/content/galleries.json";
import heroJson from "@/content/hero.json";
import pagesJson from "@/content/pages.json";
import pricingJson from "@/content/pricing.json";
import testimonialsJson from "@/content/testimonials.json";
import type {
  ContactContent,
  GalleryContent,
  HeroSlideContent,
  PagesContent,
  PricingContent,
  Testimonial,
} from "@/content/types";

const contactContent = contactJson as ContactContent;
const galleriesContent = galleriesJson as GalleryContent[];
const heroContent = heroJson as HeroSlideContent[];
const pagesContent = pagesJson as PagesContent;
const pricingContent = pricingJson as PricingContent;
const testimonialsContent = testimonialsJson as Testimonial[];

export const BOOKING_URL = "https://pluckphotography31.pixieset.com/booking/";

export const contact = contactContent;

/** Fallback hero images, shown until a real image is uploaded for that slide from the dashboard. */
const heroFallbackImages = [photos.bannerWide1, photos.galleryWide, photos.bannerWide2];

export const heroSlides = heroContent.map((slide, i) => ({
  eyebrow: slide.eyebrow,
  title: slide.title,
  caption: slide.caption,
  image: getHeroImage(slide.image) ?? heroFallbackImages[i] ?? photos.bannerWide1,
}));

export type Gallery = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  intro: string;
  body: string[];
  cover: string;
  images: string[];
};

/** Stock cover photo shown only until real images exist in that gallery's asset folder. */
const galleryCoverFallbacks: Record<string, string> = {
  wedding: photos.p23,
  birthdays: photos.p40,
  events: photos.p52,
  portraits: photos.a5,
  family: photos.n1,
  kids: photos.p47,
  maternity: photos.p55,
};

export const galleries: Gallery[] = galleriesContent.map((g) => ({
  slug: g.slug,
  name: g.name,
  eyebrow: g.eyebrow,
  tagline: g.tagline,
  intro: g.intro,
  body: g.body,
  cover: getGalleryCover(g.slug, g.coverImage) ?? galleryCoverFallbacks[g.slug] ?? "",
  images: getGalleryImages(g.slug, g.imageOrder) ?? [],
}));

export const pricing = pricingContent.tiers;
export const pricingFaqs = pricingContent.faqs;

export const testimonials = testimonialsContent;

export const pages = pagesContent;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;
