const galleryImageModules = import.meta.glob("../assets/galleries/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

type GalleryImageMap = Record<string, string[]>;

const galleryImages: GalleryImageMap = Object.entries(galleryImageModules).reduce((acc, [path, url]) => {
  const segments = path.split("/");
  const slug = segments[segments.length - 2];
  if (!slug) return acc;

  acc[slug] ??= [];
  acc[slug].push(url as string);
  return acc;
}, {} as GalleryImageMap);

const sortedGalleryImages: GalleryImageMap = Object.fromEntries(
  Object.entries(galleryImages).map(([slug, urls]) => [slug, urls.sort((a, b) => a.localeCompare(b))]),
) as GalleryImageMap;

export function getGalleryImages(slug: string): string[] | undefined {
  return sortedGalleryImages[slug];
}

export function getGalleryCover(slug: string): string | undefined {
  const images = sortedGalleryImages[slug];
  if (!images?.length) return undefined;
  const coverImage = images.find((src) => /\/cover\.(jpg|jpeg|png|webp)$/i.test(src));
  return coverImage ?? images[0];
}
