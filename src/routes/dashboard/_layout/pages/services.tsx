import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentSection } from "@/lib/dashboard-content";
import type { PagesContent } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/pages/services")({
  component: ServicesPageEditor,
});

function ServicesPageEditor() {
  const { data, isLoading, save, saving } = useContentSection("pages");
  const [pages, setPages] = useState<PagesContent | null>(null);

  useEffect(() => {
    if (data) setPages(data);
  }, [data]);

  if (isLoading || !pages) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const services = pages.services;

  const updateStep = (i: number, field: "step" | "title" | "copy", value: string) => {
    const steps = [...services.steps];
    steps[i] = { ...steps[i]!, [field]: value };
    setPages({ ...pages, services: { ...services, steps } });
  };
  const removeStep = (i: number) =>
    setPages({
      ...pages,
      services: { ...services, steps: services.steps.filter((_, idx) => idx !== i) },
    });
  const addStep = () =>
    setPages({
      ...pages,
      services: {
        ...services,
        steps: [
          ...services.steps,
          { step: String(services.steps.length + 1).padStart(2, "0"), title: "", copy: "" },
        ],
      },
    });

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
        <h1 className="display mt-2 text-3xl">Services Page</h1>
      </div>

      <section className="space-y-4 rounded-lg bg-surface p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Header</h2>
        <label className="block text-sm">
          Eyebrow
          <Input
            value={services.hero.eyebrow}
            onChange={(e) =>
              setPages({
                ...pages,
                services: { ...services, hero: { ...services.hero, eyebrow: e.target.value } },
              })
            }
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Title
          <Input
            value={services.hero.title}
            onChange={(e) =>
              setPages({
                ...pages,
                services: { ...services, hero: { ...services.hero, title: e.target.value } },
              })
            }
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Intro
          <Textarea
            value={services.hero.intro}
            onChange={(e) =>
              setPages({
                ...pages,
                services: { ...services, hero: { ...services.hero, intro: e.target.value } },
              })
            }
            className="mt-2"
            rows={3}
          />
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Process steps</h2>
        {services.steps.map((step, i) => (
          <div key={i} className="space-y-2 rounded-lg bg-surface p-5">
            <div className="flex gap-2">
              <Input
                value={step.step}
                onChange={(e) => updateStep(i, "step", e.target.value)}
                placeholder="01"
                className="w-16"
              />
              <Input
                value={step.title}
                onChange={(e) => updateStep(i, "title", e.target.value)}
                placeholder="Title"
              />
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                aria-label="Remove step"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={step.copy}
              onChange={(e) => updateStep(i, "copy", e.target.value)}
              rows={2}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="h-3.5 w-3.5" /> Add step
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
