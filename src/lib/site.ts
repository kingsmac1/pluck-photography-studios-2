import { photos } from "./photos";

export const BOOKING_URL = "https://pluckphotography31.pixieset.com/booking/";

export const contact = {
  phone: "+1 (825) 365-9567",
  phoneHref: "tel:+18253659567",
  email: "info@pluckphotographystudios.ca",
  address: "Calgary, Alberta",
  socials: [
    { label: "Facebook", href: "http://facebook.com/pluckimages" },
    { label: "Instagram", href: "https://www.instagram.com/pluckphotographystudio/" },
    { label: "TikTok", href: "https://www.tiktok.com/@pluckphotographystudio" },
  ],
};

export const heroSlides = [
  {
    image: photos.bannerWide1,
    eyebrow: "Calgary, Alberta",
    title: "Your Story, Perfectly Photographed",
    caption:
      "Specializing in portraits, family sessions, corporate headshots and maternity sessions.",
  },
  {
    image: photos.galleryWide,
    eyebrow: "In The Studio",
    title: "Light, Patience, Presence",
    caption:
      "An unhurried session where you are guided, never posed into something you are not.",
  },
  {
    image: photos.bannerWide2,
    eyebrow: "Weddings & Events",
    title: "Moments That Outlive The Day",
    caption:
      "From the first kiss to the last dance, we keep the tears, the laughter and everything between.",
  },
];

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

export const galleries: Gallery[] = [
  {
    slug: "wedding",
    name: "Wedding",
    eyebrow: "Two people, one day",
    tagline: "The whole day, kept exactly as it felt.",
    intro:
      "A wedding is absolutely magical and is arguably one of the most important days of someone's life. Our job is to make sure your magical moments are captured forever.",
    body: [
      "We photograph the quiet hour before anyone arrives, the hands being held during the vows, the aunt who cries first, and the dance floor at midnight. Nothing is staged into stiffness — we direct only enough to keep the light kind and the frame clean.",
      "Coverage is built around your timeline rather than a package template, and we work discreetly so your guests remember the day, not the photographer.",
    ],
    cover: photos.p23,
    images: [photos.p23, photos.p26, photos.p28, photos.p21, photos.p24, photos.p18, photos.p34, photos.p37],
  },
  {
    slug: "birthdays",
    name: "Birthdays",
    eyebrow: "Milestones",
    tagline: "First, fiftieth or hundredth — still worth a frame.",
    intro:
      "Whether it's a first birthday, a 50th, or a 100th, a birthday is a milestone, and we are always ready to help you capture the celebrations, laughter and joy of your special day.",
    body: [
      "We shoot birthdays two ways: a styled studio set with a backdrop and cake, or documentary coverage of the party as it actually happens — the candles, the reactions, the mess.",
      "Studio sessions run 45 to 90 minutes with outfit changes; on-location coverage is priced by the hour.",
    ],
    cover: photos.p40,
    images: [photos.p40, photos.p41, photos.p35, photos.p45, photos.p43, photos.p46, photos.p48, photos.p47],
  },
  {
    slug: "events",
    name: "Events",
    eyebrow: "Corporate & social",
    tagline: "Coverage that reads like a story, not a contact sheet.",
    intro:
      "Conferences, launches, galas, cultural celebrations and corporate socials — photographed cleanly, delivered fast, ready for your press kit and socials.",
    body: [
      "We arrive early, learn the run of show, and cover the room in layers: the wide establishing frames, the speakers and panels, the candid handshakes, and the details your sponsors paid for.",
      "A same-week preview gallery goes out for teams that need images while the event is still current, with the full edit following shortly after.",
    ],
    cover: photos.p52,
    images: [photos.p52, photos.p51, photos.p55, photos.p49, photos.p58, photos.p66, photos.p37, photos.p45],
  },
  {
    slug: "portraits",
    name: "Portraits",
    eyebrow: "One person, properly seen",
    tagline: "Headshots and personal portraits with a pulse.",
    intro:
      "Corporate headshots, creative portraits, graduation and personal branding sessions made in our Calgary studio with controlled light and a lot of patience.",
    body: [
      "Most people arrive convinced they are not photogenic. That is a lighting and direction problem, not a face problem. We solve it with posture cues, a considered lens choice and enough time for your shoulders to drop.",
      "You leave with a set of images that work everywhere — LinkedIn, a company wall, a press feature, or a frame at home.",
    ],
    cover: photos.a5,
    images: [photos.a5, photos.a4, photos.a1, photos.a6, photos.a7, photos.a8, photos.a9, photos.a10],
  },
  {
    slug: "family",
    name: "Family",
    eyebrow: "Everyone in one frame",
    tagline: "Formal, playful, or somewhere in the middle.",
    intro:
      "Formal family portrait or something more playful and casual? We will do our absolute best to create images that reflect the love and connection in your family — at our studio, at home, or in a park.",
    body: [
      "We plan around the youngest person present, keep the session moving, and get the posed group frame early so the rest can be loose and genuinely fun.",
      "Wardrobe guidance is sent ahead of time so the family reads as one palette instead of seven competing ones.",
    ],
    cover: photos.n1,
    images: [photos.n1, photos.n2, photos.n3, photos.n4, photos.a11, photos.a14, photos.p21, photos.p24],
  },
  {
    slug: "kids",
    name: "Kids",
    eyebrow: "Small humans",
    tagline: "Photographed at their speed, not ours.",
    intro:
      "Newborns, toddlers and school-age children, photographed with the patience the age actually requires.",
    body: [
      "There is no bribing and no forced smiles. We set the light, hand over a prop or a favourite toy, and wait for the real expression — the one you actually recognise.",
      "Sessions are kept short and are scheduled around naps and moods. Parents are welcome in frame, and often should be.",
    ],
    cover: photos.p47,
    images: [photos.p47, photos.p48, photos.p46, photos.p43, photos.p35, photos.n4, photos.n3, photos.p34],
  },
  {
    slug: "maternity",
    name: "Maternity",
    eyebrow: "Before the arrival",
    tagline: "A short season, kept permanently.",
    intro:
      "Maternity sessions made to feel calm and flattering, photographed in studio with soft directional light, or outdoors in the golden hour.",
    body: [
      "We recommend booking between 30 and 36 weeks. Gowns and fabric are available in studio, and partners and older siblings are always welcome in part of the session.",
      "Everything is paced gently, with seating between setups and no expectation that you hold anything uncomfortable.",
    ],
    cover: photos.p55,
    images: [photos.p55, photos.p58, photos.p66, photos.p49, photos.p51, photos.p52, photos.a9, photos.a10],
  },
];

export const pricing = [
  {
    name: "Silver",
    price: "$260",
    features: ["Up to 2 outfits", "8 edited high resolution images", "45 Minutes"],
  },
  {
    name: "Gold",
    price: "$340",
    features: ["Up to 3 outfits", "10 edited high resolution images", "60 minutes"],
    featured: true,
  },
  {
    name: "Platinum",
    price: "$420",
    features: ["Up to 4 outfits", "16 edited high resolution images", "90 Minutes"],
  },
];

export const testimonials = [
  {
    quote:
      "Our first experience with Ayo at his studio was beyond what we imagined. He was so calm, understanding and patient all through.",
    name: "Oluwatosin Ayodele",
  },
  {
    quote:
      "The final photos were stunning — high-quality, thoughtfully edited, and delivered in a timely manner.",
    name: "Adeagbo Victoria",
  },
  {
    quote:
      "Pluck Photography provided exceptional service to my family and I. The pictures are very nice. We had a combination of professional and family shots.",
    name: "Cherise Millar",
  },
  {
    quote:
      "Pluck photography is awesome! Interesting photo session and beautiful pictures. Will definitely come back for more photos.",
    name: "Stella Azom",
  },
];

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;
