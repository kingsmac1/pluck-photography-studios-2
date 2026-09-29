import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowUp, ArrowDown, Star, Trash2, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentSection } from "@/lib/dashboard-content";
import { useGalleryImages } from "@/lib/dashboard-images";
import type { GalleryContent } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/galleries/$slug")({
  component: GalleryEditor,
});

function mergeOrder(filenames: string[], explicitOrder: string[]): string[] {
  const ordered = explicitOrder.filter((f) => filenames.includes(f));
  const remaining = filenames.filter((f) => !ordered.includes(f));
  return [...ordered, ...remaining];
}

function GalleryEditor() {
  const { slug } = Route.useParams();
  const { data: galleries, isLoading, save, saving } = useContentSection("galleries");
  const {
    images,
    isLoading: imagesLoading,
    upload,
    uploading,
    remove,
    removing,
  } = useGalleryImages("gallery", slug);

  const gallery = galleries?.find((g) => g.slug === slug);
  const [form, setForm] = useState<GalleryContent | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gallery) setForm(gallery);
  }, [gallery]);

  useEffect(() => {
    if (!gallery) return;
    setOrder(
      mergeOrder(
        images.map((i) => i.filename),
        gallery.imageOrder,
      ),
    );
  }, [images, gallery]);

  if (!isLoading && galleries && !gallery) {
    throw notFound();
  }

  if (!form) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const move = (index: number, direction: -1 | 1) => {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target] as string, next[index] as string];
      return next;
    });
  };

  const setCover = (filename: string) => {
    setForm((prev) => (prev ? { ...prev, coverImage: filename } : prev));
  };

  const updateBody = (index: number, value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const body = [...prev.body];
      body[index] = value;
      return { ...prev, body };
    });
  };

  const addParagraph = () => {
    setForm((prev) => (prev ? { ...prev, body: [...prev.body, ""] } : prev));
  };

  const removeParagraph = (index: number) => {
    setForm((prev) => (prev ? { ...prev, body: prev.body.filter((_, i) => i !== index) } : prev));
  };

  const onSave = async () => {
    if (!galleries || !form) return;
    const updated = { ...form, imageOrder: order };
    const nextGalleries = galleries.map((g) => (g.slug === slug ? updated : g));
    try {
      await save(nextGalleries);
      toast.success("Saved — committed to GitHub, live shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const onUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    for (const file of Array.from(fileList)) {
      try {
        await upload(file);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Upload failed for ${file.name}`);
        return;
      }
    }
    toast.success("Uploaded — live shortly after the site redeploys");
  };

  const onDelete = async (filename: string) => {
    try {
      await remove(filename);
      if (form.coverImage === filename) setCover("");
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <Link
          to="/dashboard/galleries"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All galleries
        </Link>
        <h1 className="display mt-3 text-3xl">{form.name}</h1>
      </div>

      <section className="space-y-5 rounded-lg bg-surface p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Copy</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            Name
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2"
            />
          </label>
          <label className="block text-sm">
            Eyebrow
            <Input
              value={form.eyebrow}
              onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              className="mt-2"
            />
          </label>
        </div>
        <label className="block text-sm">
          Tagline
          <Input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Intro
          <Textarea
            value={form.intro}
            onChange={(e) => setForm({ ...form, intro: e.target.value })}
            className="mt-2"
            rows={3}
          />
        </label>
        <div>
          <p className="text-sm">Body paragraphs</p>
          <div className="mt-2 space-y-3">
            {form.body.map((paragraph, i) => (
              <div key={i} className="flex gap-2">
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateBody(i, e.target.value)}
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="shrink-0 self-start rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                  aria-label="Remove paragraph"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="mt-3">
            <Plus className="h-3.5 w-3.5" /> Add paragraph
          </Button>
        </div>
      </section>

      <section className="space-y-5 rounded-lg bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Photos</h2>
          <Button
            type="button"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {imagesLoading ? (
          <p className="text-sm text-muted-foreground">Loading photos…</p>
        ) : order.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No photos yet. Upload some — the gallery page shows a "coming soon" message until then.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {order.map((filename, i) => {
              const image = images.find((img) => img.filename === filename);
              if (!image) return null;
              const isCover = form.coverImage === filename;
              return (
                <div key={filename} className="overflow-hidden rounded-lg bg-surface-raised">
                  <div className="relative aspect-square">
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                    {isCover ? (
                      <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-wide text-background">
                        Cover
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between gap-1 p-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground disabled:opacity-30"
                        aria-label="Move earlier"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === order.length - 1}
                        className="rounded p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground disabled:opacity-30"
                        aria-label="Move later"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCover(filename)}
                        disabled={isCover}
                        className="rounded p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground disabled:opacity-30"
                        aria-label="Set as cover"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(filename)}
                        disabled={removing}
                        className="rounded p-1.5 text-muted-foreground hover:bg-surface hover:text-destructive"
                        aria-label="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" onClick={onSave} disabled={saving} size="lg">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
