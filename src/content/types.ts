export type GalleryContent = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  intro: string;
  body: string[];
  coverImage: string | null;
  imageOrder: string[];
};

export type PricingTier = {
  name: string;
  price: string;
  features: string[];
  featured: boolean;
};

export type PricingFaq = { q: string; a: string };

export type PricingContent = {
  tiers: PricingTier[];
  faqs: PricingFaq[];
};

export type Testimonial = { quote: string; name: string };

export type HeroSlideContent = {
  eyebrow: string;
  title: string;
  caption: string;
  image: string | null;
};

export type Social = { label: string; href: string };

export type ContactContent = {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  socials: Social[];
};

export type PageHeroContent = { eyebrow: string; title: string; intro: string };

export type PagesContent = {
  about: {
    hero: PageHeroContent;
    story: { eyebrow: string; heading: string; paragraphs: string[] };
    values: { title: string; copy: string }[];
  };
  services: {
    hero: PageHeroContent;
    steps: { step: string; title: string; copy: string }[];
  };
};

/** Section keys the dashboard can read/write, each mapped to its content shape. */
export type ContentMap = {
  galleries: GalleryContent[];
  pricing: PricingContent;
  testimonials: Testimonial[];
  hero: HeroSlideContent[];
  contact: ContactContent;
  pages: PagesContent;
};

export type ContentSection = keyof ContentMap;
