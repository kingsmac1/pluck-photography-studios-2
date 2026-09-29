import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useContentSection } from "@/lib/dashboard-content";
import { useGalleryImages } from "@/lib/dashboard-images";

export const Route = createFileRoute("/dashboard/_layout/galleries/")({
  component: GalleriesIndex,
});

function GalleryRow({ slug, name, tagline }: { slug: string; name: string; tagline: string }) {
  const { images, isLoading } = useGalleryImages("gallery", slug);
  return (
    <Link
      to="/dashboard/galleries/$slug"
      params={{ slug }}
      className="flex items-center justify-between rounded-lg bg-surface p-5 transition-colors hover:bg-surface-raised"
    >
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{tagline}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${images.length} photo${images.length === 1 ? "" : "s"}`}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function GalleriesIndex() {
  const { data: galleries, isLoading } = useContentSection("galleries");

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Galleries</p>
        <h1 className="display mt-2 text-3xl">Manage Galleries</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open a gallery to edit its copy, upload or remove photos, reorder them and choose a cover.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {isLoading || !galleries
          ? null
          : galleries.map((g) => (
              <GalleryRow key={g.slug} slug={g.slug} name={g.name} tagline={g.tagline} />
            ))}
      </div>
    </div>
  );
}
