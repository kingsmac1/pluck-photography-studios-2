import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentSection } from "@/lib/dashboard-content";
import type { Testimonial } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/reviews")({
  component: ReviewsEditor,
});

function ReviewsEditor() {
  const { data, isLoading, save, saving } = useContentSection("testimonials");
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const update = (index: number, field: keyof Testimonial, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const remove = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const add = () => setItems((prev) => [...prev, { quote: "", name: "" }]);

  const onSave = async () => {
    try {
      await save(items);
      toast.success("Saved — committed to GitHub, live shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Reviews</p>
        <h1 className="display mt-2 text-3xl">Testimonials</h1>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-lg bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <Textarea
                value={item.quote}
                onChange={(e) => update(i, "quote", e.target.value)}
                rows={3}
                placeholder="Quote"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                aria-label="Remove review"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Input
              value={item.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Name"
            />
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5" /> Add review
      </Button>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" onClick={onSave} disabled={saving} size="lg">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
