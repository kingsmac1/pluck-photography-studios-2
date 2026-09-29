const heroImageModules = import.meta.glob(
  "../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const heroImagesByFilename: Record<string, string> = {};
for (const [path, url] of Object.entries(heroImageModules)) {
  const filename = path.split("/").pop();
  if (!filename) continue;
  heroImagesByFilename[filename] = url as string;
}

/** Resolves an uploaded hero slide image by filename, or undefined if not yet uploaded. */
export function getHeroImage(filename: string | null | undefined): string | undefined {
  if (!filename) return undefined;
  return heroImagesByFilename[filename];
}
