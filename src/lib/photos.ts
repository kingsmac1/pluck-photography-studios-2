const localPhotoModules = import.meta.glob<string>("../assets/photos2/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const normalizeFilename = (filename: string) => {
  let normalized = filename;
  while (true) {
    const match = normalized.match(/\.(jpg|jpeg|png|webp)$/i);
    if (!match) break;
    normalized = normalized.slice(0, -match[0].length);
  }
  return normalized;
};

const localPhotoUrls = Object.entries(localPhotoModules).reduce<Record<string, string>>((acc, [path, url]) => {
  const filename = path.split("/").pop();
  if (!filename) return acc;
  const key = normalizeFilename(filename);
  acc[key] = url;
  return acc;
}, {});

const localPhotoAliases: Record<string, string> = {
  "pluck-logo": "pluck-logo-2",
  "pluck-logo-light": "pluck-logo-white",
};

const fallbackPhotos = {
  bannerWide1: "/__l5e/assets-v1/f4e114df-d030-4c59-840a-d2ddf946cc5e/banner-background-1.jpg",
  bannerWide2: "/__l5e/assets-v1/3646b232-c516-4d7e-b3c8-8e2244009cdb/banner-background-3.jpg",
  galleryWide: "/__l5e/assets-v1/83ab4142-f96e-4269-9223-0ccb8b7475ba/gallery-3.jpg",
  p18: "/__l5e/assets-v1/df55a68b-d96a-4ede-ae97-c3964b16c9da/pluck-portrait-18.jpg",
  p21: "/__l5e/assets-v1/a2084bbd-b9fa-4c30-acdf-1e19774e905f/pluck-portrait-21.jpg",
  p23: "/__l5e/assets-v1/b4943f2e-bc6c-42db-9013-fdce30c82c1e/pluck-portrait-23.jpg",
  p24: "/__l5e/assets-v1/1ccff68a-4d88-4c77-b108-c21d6ce02cdb/pluck-portrait-24.jpg",
  p26: "/__l5e/assets-v1/fe76971d-1572-4d8f-8a57-31260f70068e/pluck-portrait-26.jpg",
  p28: "/__l5e/assets-v1/ef739373-a851-4aea-aed7-a650fcc89469/pluck-portrait-28.jpg",
  p34: "/__l5e/assets-v1/988147d4-1d1c-4a8a-aa1a-77070fff59cc/pluck-portrait-34.jpg",
  p35: "/__l5e/assets-v1/e9ce0751-beb8-46f9-bd09-7c955a5de8f4/pluck-portrait-35.jpg",
  p37: "/__l5e/assets-v1/ac6b72f9-1022-4aef-b7eb-0429987df22a/pluck-portrait-37.jpg",
  p40: "/__l5e/assets-v1/c84ebd68-6304-48e3-a545-3e2b5df25078/pluck-portrait-40.jpg",
  p41: "/__l5e/assets-v1/fdaf3c0c-c3bb-48db-a5a0-6e4540014c6d/pluck-portrait-41.jpg",
  p43: "/__l5e/assets-v1/d6996333-f04c-41f4-ada2-04e6b8dd719b/pluck-portrait-43.jpg",
  p45: "/__l5e/assets-v1/ee18ac7c-5bd5-452c-b8c8-61e0784ea155/pluck-portrait-45.jpg",
  p46: "/__l5e/assets-v1/450b87a6-68b9-4494-93ed-1ebc68f08160/pluck-portrait-46.jpg",
  p47: "/__l5e/assets-v1/f2154467-d74f-4908-aeaa-7db6af613815/pluck-portrait-47.jpg",
  p48: "/__l5e/assets-v1/18451a42-d925-41cb-a066-7c7810546a41/pluck-portrait-48.jpg",
  p49: "/__l5e/assets-v1/52942e24-51ba-4a8e-be4f-48687903fd5c/pluck-portrait-49.jpg",
  p51: "/__l5e/assets-v1/a87258df-2878-49f1-90c1-6794a11c82fd/pluck-portrait-51.jpg",
  p52: "/__l5e/assets-v1/d08cd791-8baf-462e-995e-c9b0a86fa0d1/pluck-portrait-52.jpg",
  p55: "/__l5e/assets-v1/f2e09a3b-ce68-43d3-9496-88fb07964efb/pluck-portrait-55.jpg",
  p58: "/__l5e/assets-v1/3d6a172f-4f08-4ec0-a343-24acb2d48308/pluck-portrait-58.jpg",
  p66: "/__l5e/assets-v1/5a9a9fdd-2b37-4e1f-b4ff-840a646d45d8/pluck-portrait-66.jpg",
  a1: "/__l5e/assets-v1/0bd327e8-3b16-4478-a0d3-b6b867715354/pluck-portrait-a1.jpg",
  a10: "/__l5e/assets-v1/c274dc6a-b33c-4c31-afc1-06ebb3a876b9/pluck-portrait-a10.jpg",
  a11: "/__l5e/assets-v1/06d86418-2fe3-4983-9d55-9f3b1777f115/pluck-portrait-a11.jpg",
  a14: "/__l5e/assets-v1/9cf35986-8752-4597-96f9-9aca68bf3b08/pluck-portrait-a14.jpg",
  a4: "/__l5e/assets-v1/744de212-81e7-4499-a1ae-b4a0852b9a6a/pluck-portrait-a4.jpg",
  a5: "/__l5e/assets-v1/f632105c-0131-474d-b082-8f14ada4b79a/pluck-portrait-a5.jpg",
  a6: "/__l5e/assets-v1/3dcafc06-9162-4e24-8ebb-16b8405467a9/pluck-portrait-a6.jpg",
  a7: "/__l5e/assets-v1/f76aac36-b767-4907-a06b-b2fd2c68dc92/pluck-portrait-a7.jpg",
  a8: "/__l5e/assets-v1/f1b3a9e4-2330-458c-85af-aa4706ae4f5c/pluck-portrait-a8.jpg",
  a9: "/__l5e/assets-v1/dd5dafd7-33cd-4c30-b1b6-5e9b634be09b/pluck-portrait-a9.jpg",
  n1: "/__l5e/assets-v1/702e94cf-74a8-415d-822c-c19ab2698caa/pluck-portrait-new1.jpg",
  n2: "/__l5e/assets-v1/91462bd7-a35a-4788-8f46-7273084f00d8/pluck-portrait-new2.jpg",
  n3: "/__l5e/assets-v1/069d6b8f-dc46-42a5-a476-98f769675e90/pluck-portrait-new3.jpg",
  n4: "/__l5e/assets-v1/42789063-0836-4c54-b573-a67e467fd778/pluck-portrait-new4.jpg",
  logo: "/__l5e/assets-v1/874dcdfb-3197-40bd-b393-667f1dc96764/pluck-logo.png",
  logoLight: "/__l5e/assets-v1/160f178b-f57b-4e45-b3e0-780a9b901fa6/pluck-logo-light.png",
};

const resolvePhoto = (filename: string, fallback: string) => {
  const normalized = normalizeFilename(filename);
  const aliasKey = localPhotoAliases[normalized] ? normalizeFilename(localPhotoAliases[normalized]) : normalized;
  return localPhotoUrls[aliasKey] ?? localPhotoUrls[normalized] ?? fallback;
};

export const photos = {
  bannerWide1: resolvePhoto("banner-background-1", fallbackPhotos.bannerWide1),
  bannerWide2: resolvePhoto("banner-background-2", fallbackPhotos.bannerWide2),
  galleryWide: resolvePhoto("gallery-3", fallbackPhotos.galleryWide),
  p18: resolvePhoto("pluck-portrait-18", fallbackPhotos.p18),
  p21: resolvePhoto("pluck-portrait-21", fallbackPhotos.p21),
  p23: resolvePhoto("pluck-portrait-23", fallbackPhotos.p23),
  p24: resolvePhoto("pluck-portrait-24", fallbackPhotos.p24),
  p26: resolvePhoto("pluck-portrait-26", fallbackPhotos.p26),
  p28: resolvePhoto("pluck-portrait-28", fallbackPhotos.p28),
  p34: resolvePhoto("pluck-portrait-34", fallbackPhotos.p34),
  p35: resolvePhoto("pluck-portrait-35", fallbackPhotos.p35),
  p37: resolvePhoto("pluck-portrait-37", fallbackPhotos.p37),
  p40: resolvePhoto("pluck-portrait-40", fallbackPhotos.p40),
  p41: resolvePhoto("pluck-portrait-41", fallbackPhotos.p41),
  p43: resolvePhoto("pluck-portrait-43", fallbackPhotos.p43),
  p45: resolvePhoto("pluck-portrait-45", fallbackPhotos.p45),
  p46: resolvePhoto("pluck-portrait-46", fallbackPhotos.p46),
  p47: resolvePhoto("pluck-portrait-47", fallbackPhotos.p47),
  p48: resolvePhoto("pluck-portrait-48", fallbackPhotos.p48),
  p49: resolvePhoto("pluck-portrait-49", fallbackPhotos.p49),
  p51: resolvePhoto("pluck-portrait-51", fallbackPhotos.p51),
  p52: resolvePhoto("pluck-portrait-52", fallbackPhotos.p52),
  p55: resolvePhoto("pluck-portrait-55", fallbackPhotos.p55),
  p58: resolvePhoto("pluck-portrait-58", fallbackPhotos.p58),
  p66: resolvePhoto("pluck-portrait-66", fallbackPhotos.p66),
  a1: resolvePhoto("pluck-portrait-a1", fallbackPhotos.a1),
  a10: resolvePhoto("pluck-portrait-a10", fallbackPhotos.a10),
  a11: resolvePhoto("pluck-portrait-a11", fallbackPhotos.a11),
  a14: resolvePhoto("pluck-portrait-a14", fallbackPhotos.a14),
  a4: resolvePhoto("pluck-portrait-a4", fallbackPhotos.a4),
  a5: resolvePhoto("pluck-portrait-a5", fallbackPhotos.a5),
  a6: resolvePhoto("pluck-portrait-a6", fallbackPhotos.a6),
  a7: resolvePhoto("pluck-portrait-a7", fallbackPhotos.a7),
  a8: resolvePhoto("pluck-portrait-a8", fallbackPhotos.a8),
  a9: resolvePhoto("pluck-portrait-a9", fallbackPhotos.a9),
  n1: resolvePhoto("pluck-portrait-new1", fallbackPhotos.n1),
  n2: resolvePhoto("pluck-portrait-new2", fallbackPhotos.n2),
  n3: resolvePhoto("pluck-portrait-new3", fallbackPhotos.n3),
  n4: resolvePhoto("pluck-portrait-new4", fallbackPhotos.n4),
  logo: resolvePhoto("pluck-logo", fallbackPhotos.logo),
  logoLight: resolvePhoto("pluck-logo-light", fallbackPhotos.logoLight),
} as const;

export const allPortraits: string[] = [
  photos.p23,
  photos.p26,
  photos.p28,
  photos.a14,
  photos.a11,
  photos.a6,
  photos.a10,
  photos.a9,
  photos.a8,
  photos.a7,
  photos.a5,
  photos.a4,
  photos.a1,
  photos.p21,
  photos.p24,
  photos.p18,
  photos.p34,
  photos.p37,
  photos.p40,
  photos.p41,
  photos.p35,
  photos.p45,
  photos.p43,
  photos.p46,
  photos.p48,
  photos.p47,
  photos.p52,
  photos.p51,
  photos.p55,
  photos.p49,
  photos.p58,
  photos.p66,
  photos.n4,
  photos.n3,
  photos.n2,
  photos.n1,
];
