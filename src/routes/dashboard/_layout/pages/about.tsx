import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentSection } from "@/lib/dashboard-content";
import type { PagesContent } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/pages/about")({
  component: AboutPageEditor,
});

function AboutPageEditor() {
  const { data, isLoading, save, saving } = useContentSection("pages");
  const [pages, setPages] = useState<PagesContent | null>(null);

  useEffect(() => {
    if (data) setPages(data);
  }, [data]);

  if (isLoading || !pages) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const about = pages.about;

  const updateParagraph = (i: number, value: string) => {
    const paragraphs = [...about.story.paragraphs];
    paragraphs[i] = value;
    setPages({ ...pages, about: { ...about, story: { ...about.story, paragraphs } } });
  };
  const removeParagraph = (i: number) =>
    setPages({
      ...pages,
      about: {
        ...about,
        story: { ...about.story, paragraphs: about.story.paragraphs.filter((_, idx) => idx !== i) },
      },
    });
  const addParagraph = () =>
    setPages({
      ...pages,
      about: { ...about, story: { ...about.story, paragraphs: [...about.story.paragraphs, ""] } },
    });

  const updateValue = (i: number, field: "title" | "copy", value: string) => {
    const values = [...about.values];
    values[i] = { ...values[i]!, [field]: value };
    setPages({ ...pages, about: { ...about, values } });
  };
  const removeValue = (i: number) =>
    setPages({ ...pages, about: { ...about, values: about.values.filter((_, idx) => idx !== i) } });
  const addValue = () =>
    setPages({ ...pages, about: { ...about, values: [...about.values, { title: "", copy: "" }] } });

  const onSave = async () => {
    try {
      await save(pages);
      toast.success("Saved — committed to GitHub, live shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Page Copy</p>
        <h1 className="display mt-2 text-3xl">About Page</h1>
      </div>

      <section className="space-y-4 rounded-lg bg-surface p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Header</h2>
        <label className="block text-sm">
          Eyebrow
          <Input
            value={about.hero.eyebrow}
            onChange={(e) =>
              setPages({
                ...pages,
                about: { ...about, hero: { ...about.hero, eyebrow: e.target.value } },
              })
            }
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Title
          <Input
            value={about.hero.title}
            onChange={(e) =>
              setPages({
                ...pages,
                about: { ...about, hero: { ...about.hero, title: e.target.value } },
              })
            }
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Intro
          <Textarea
            value={about.hero.intro}
            onChange={(e) =>
              setPages({
                ...pages,
                about: { ...about, hero: { ...about.hero, intro: e.target.value } },
              })
            }
            className="mt-2"
            rows={3}
          />
        </label>
      </section>

      <section className="space-y-4 rounded-lg bg-surface p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          The Studio section
        </h2>
        <label className="block text-sm">
          Eyebrow
          <Input
            value={about.story.eyebrow}
            onChange={(e) =>
              setPages({
                ...pages,
                about: { ...about, story: { ...about.story, eyebrow: e.target.value } },
              })
            }
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Heading
          <Input
            value={about.story.heading}
            onChange={(e) =>
              setPages({
                ...pages,
                about: { ...about, story: { ...about.story, heading: e.target.value } },
              })
            }
            className="mt-2"
          />
        </label>
        <div>
          <p className="text-sm">Paragraphs</p>
          <div className="mt-2 space-y-2">
            {about.story.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <Textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={3} />
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="shrink-0 self-start rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                  aria-label="Remove paragraph"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="mt-2">
            <Plus className="h-3.5 w-3.5" /> Add paragraph
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Values</h2>
        {about.values.map((value, i) => (
          <div key={i} className="space-y-2 rounded-lg bg-surface p-5">
            <div className="flex gap-2">
              <Input
                value={value.title}
                onChange={(e) => updateValue(i, "title", e.target.value)}
                placeholder="Title"
                className="w-40"
              />
              <button
                type="button"
                onClick={() => removeValue(i)}
                className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                aria-label="Remove value"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={value.copy}
              onChange={(e) => updateValue(i, "copy", e.target.value)}
              rows={2}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addValue}>
          <Plus className="h-3.5 w-3.5" /> Add value
        </Button>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" onClick={onSave} disabled={saving} size="lg">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
