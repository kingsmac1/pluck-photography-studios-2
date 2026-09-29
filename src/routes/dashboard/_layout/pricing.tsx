import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContentSection } from "@/lib/dashboard-content";
import type { PricingContent, PricingTier } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/pricing")({
  component: PricingEditor,
});

function TierCard({
  tier,
  onChange,
  onRemove,
}: {
  tier: PricingTier;
  onChange: (t: PricingTier) => void;
  onRemove: () => void;
}) {
  const updateFeature = (i: number, value: string) => {
    const features = [...tier.features];
    features[i] = value;
    onChange({ ...tier, features });
  };
  const removeFeature = (i: number) =>
    onChange({ ...tier, features: tier.features.filter((_, idx) => idx !== i) });
  const addFeature = () => onChange({ ...tier, features: [...tier.features, ""] });

  return (
    <div className="space-y-3 rounded-lg bg-surface p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Name
          <Input
            value={tier.name}
            onChange={(e) => onChange({ ...tier, name: e.target.value })}
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Price
          <Input
            value={tier.price}
            onChange={(e) => onChange({ ...tier, price: e.target.value })}
            className="mt-2"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={tier.featured}
          onChange={(e) => onChange({ ...tier, featured: e.target.checked })}
        />
        Featured tier
      </label>
      <div>
        <p className="text-sm">Features</p>
        <div className="mt-2 space-y-2">
          {tier.features.map((feature, i) => (
            <div key={i} className="flex gap-2">
              <Input value={feature} onChange={(e) => updateFeature(i, e.target.value)} />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                aria-label="Remove feature"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-2">
          <Plus className="h-3.5 w-3.5" /> Add feature
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" /> Remove tier
      </Button>
    </div>
  );
}

function PricingEditor() {
  const { data, isLoading, save, saving } = useContentSection("pricing");
  const [form, setForm] = useState<PricingContent | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const updateTier = (i: number, tier: PricingTier) => {
    const tiers = [...form.tiers];
    tiers[i] = tier;
    setForm({ ...form, tiers });
  };
  const removeTier = (i: number) =>
    setForm({ ...form, tiers: form.tiers.filter((_, idx) => idx !== i) });
  const addTier = () =>
    setForm({
      ...form,
      tiers: [...form.tiers, { name: "", price: "", features: [], featured: false }],
    });

  const updateFaq = (i: number, field: "q" | "a", value: string) => {
    const faqs = [...form.faqs];
    faqs[i] = { ...faqs[i]!, [field]: value };
    setForm({ ...form, faqs });
  };
  const removeFaq = (i: number) =>
    setForm({ ...form, faqs: form.faqs.filter((_, idx) => idx !== i) });
  const addFaq = () => setForm({ ...form, faqs: [...form.faqs, { q: "", a: "" }] });

  const onSave = async () => {
    try {
      await save(form);
      toast.success("Saved — committed to GitHub, live shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Pricing</p>
        <h1 className="display mt-2 text-3xl">Sessions & Rates</h1>
      </div>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tiers</h2>
        {form.tiers.map((tier, i) => (
          <TierCard
            key={i}
            tier={tier}
            onChange={(t) => updateTier(i, t)}
            onRemove={() => removeTier(i)}
          />
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addTier}>
          <Plus className="h-3.5 w-3.5" /> Add tier
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">FAQs</h2>
        {form.faqs.map((faq, i) => (
          <div key={i} className="space-y-2 rounded-lg bg-surface p-5">
            <div className="flex gap-2">
              <Input
                value={faq.q}
                onChange={(e) => updateFaq(i, "q", e.target.value)}
                placeholder="Question"
              />
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
                aria-label="Remove FAQ"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={faq.a}
              onChange={(e) => updateFaq(i, "a", e.target.value)}
              placeholder="Answer"
              rows={2}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addFaq}>
          <Plus className="h-3.5 w-3.5" /> Add FAQ
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
