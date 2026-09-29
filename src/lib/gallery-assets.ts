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

  if (filename && /^cover\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    galleryCovers[slug] = url as string;
  }
}

const sortedGalleryImages: GalleryImageMap = Object.fromEntries(
  Object.entries(galleryImages).map(([slug, urls]) => [
    slug,
    urls.sort((a, b) => a.localeCompare(b)),
  ]),
) as GalleryImageMap;

/** Maps a gallery-relative filename (e.g. "784A1772.jpg") to its glob-resolved URL, per slug. */
const filenameByUrl = new Map<string, string>();
for (const [path, url] of Object.entries(galleryImageModules)) {
  filenameByUrl.set(url as string, path.split("/").pop()!);
}

function urlForFilename(slug: string, filename: string): string | undefined {
  return sortedGalleryImages[slug]?.find((url) => filenameByUrl.get(url) === filename);
}

/**
 * Returns a gallery's images, applying an explicit filename order on top of the default
 * alphabetical order. Filenames in `order` that no longer exist are skipped; images not
 * mentioned in `order` are appended afterwards in their default (alphabetical) order.
 */
export function getGalleryImages(slug: string, order?: string[]): string[] | undefined {
  const images = sortedGalleryImages[slug];
  if (!images?.length) return images;
  if (!order?.length) return images;

  const ordered = order
    .map((filename) => urlForFilename(slug, filename))
    .filter((url): url is string => !!url);
  const remaining = images.filter((url) => !ordered.includes(url));
  return [...ordered, ...remaining];
}

/**
 * Returns a gallery's cover image. `coverImage` (a filename set from the dashboard) takes
 * priority, then a file literally named cover.*, then the first image in display order.
 */
export function getGalleryCover(slug: string, coverImage?: string | null): string | undefined {
  const images = sortedGalleryImages[slug];
  if (!images?.length) return undefined;
  if (coverImage) {
    const url = urlForFilename(slug, coverImage);
    if (url) return url;
  }
  return galleryCovers[slug] ?? images[0];
}
