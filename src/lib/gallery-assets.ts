const galleryImageModules = import.meta.glob(
  "../assets/galleries/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

type GalleryImageMap = Record<string, string[]>;
type GalleryCoverMap = Record<string, string>;

const galleryImages: GalleryImageMap = {};
const galleryCovers: GalleryCoverMap = {};

for (const [path, url] of Object.entries(galleryImageModules)) {
  const segments = path.split("/");
  const filename = segments[segments.length - 1];
  const slug = segments[segments.length - 2];
  if (!slug) continue;

  galleryImages[slug] ??= [];
  galleryImages[slug].push(url as string);

  if (/^cover\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    galleryCovers[slug] = url as string;
  }
}

const sortedGalleryImages: GalleryImageMap = Object.fromEntries(
  Object.entries(galleryImages).map(([slug, urls]) => [slug, urls.sort((a, b) => a.localeCompare(b))]),
) as GalleryImageMap;

export function getGalleryImages(slug: string): string[] | undefined {
  return sortedGalleryImages[slug];
}

export function getGalleryCover(slug: string): string | undefined {
  const images = sortedGalleryImages[slug];
  if (!images?.length) return undefined;
  return galleryCovers[slug] ?? images[0];
}