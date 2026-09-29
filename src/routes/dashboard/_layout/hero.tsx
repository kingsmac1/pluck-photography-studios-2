import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentSection } from "@/lib/dashboard-content";
import { useGalleryImages } from "@/lib/dashboard-images";
import type { HeroSlideContent } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/hero")({
  component: HeroEditor,
});

function SlideCard({
  slide,
  index,
  onChange,
}: {
  slide: HeroSlideContent;
  index: number;
  onChange: (slide: HeroSlideContent) => void;
}) {
  const { images, upload, uploading } = useGalleryImages("hero");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUrl = images.find((img) => img.filename === slide.image)?.url;

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      onChange({ ...slide, image: result.filename });
      toast.success("Uploaded — live shortly after the site redeploys");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Slide {index + 1}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Replace image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => {
            void onUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {currentUrl ? (
        <img src={currentUrl} alt="" className="aspect-21/9 w-full rounded-md object-cover" />
      ) : (
        <div className="flex aspect-21/9 w-full items-center justify-center rounded-md bg-surface-raised text-xs text-muted-foreground">
          Using the site's default image until you upload one
        </div>
      )}

      <label className="block text-sm">
        Eyebrow
        <Input
          value={slide.eyebrow}
          onChange={(e) => onChange({ ...slide, eyebrow: e.target.value })}
          className="mt-2"
        />
      </label>
      <label className="block text-sm">
        Title
        <Input
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
          className="mt-2"
        />
      </label>
      <label className="block text-sm">
        Caption
        <Textarea
          value={slide.caption}
          onChange={(e) => onChange({ ...slide, caption: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </label>
    </div>
  );
}

function HeroEditor() {
  const { data, isLoading, save, saving } = useContentSection("hero");
  const [slides, setSlides] = useState<HeroSlideContent[]>([]);

  useEffect(() => {
    if (data) setSlides(data);
  }, [data]);

  const updateSlide = (i: number, slide: HeroSlideContent) => {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? slide : s)));
  };

  const onSave = async () => {
    try {
      await save(slides);
      toast.success("Saved — committed to GitHub, live shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Homepage</p>
        <h1 className="display mt-2 text-3xl">Hero Slides</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The three rotating slides at the top of the homepage.
        </p>
      </div>

      <div className="space-y-4">
        {slides.map((slide, i) => (
          <SlideCard key={i} slide={slide} index={i} onChange={(s) => updateSlide(i, s)} />
        ))}
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" onClick={onSave} disabled={saving} size="lg">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
