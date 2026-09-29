import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContentSection } from "@/lib/dashboard-content";
import type { ContactContent } from "@/content/types";

export const Route = createFileRoute("/dashboard/_layout/contact")({
  component: ContactEditor,
});

function ContactEditor() {
  const { data, isLoading, save, saving } = useContentSection("contact");
  const [form, setForm] = useState<ContactContent | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const updateSocial = (i: number, field: "label" | "href", value: string) => {
    const socials = [...form.socials];
    socials[i] = { ...socials[i]!, [field]: value };
    setForm({ ...form, socials });
  };
  const removeSocial = (i: number) =>
    setForm({ ...form, socials: form.socials.filter((_, idx) => idx !== i) });
  const addSocial = () => setForm({ ...form, socials: [...form.socials, { label: "", href: "" }] });

  const onSave = async () => {
    try {
      await save(form);
      toast.success("Saved — committed to GitHub, live shortly");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="display mt-2 text-3xl">Contact Info</h1>
      </div>

      <section className="grid gap-5 rounded-lg bg-surface p-6 sm:grid-cols-2">
        <label className="block text-sm">
          Phone (display)
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Phone link (tel:+1...)
          <Input
            value={form.phoneHref}
            onChange={(e) => setForm({ ...form, phoneHref: e.target.value })}
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Email
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2"
          />
        </label>
        <label className="block text-sm">
          Address
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-2"
          />
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Socials</h2>
        {form.socials.map((social, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={social.label}
              onChange={(e) => updateSocial(i, "label", e.target.value)}
              placeholder="Label"
              className="w-40"
            />
            <Input
              value={social.href}
              onChange={(e) => updateSocial(i, "href", e.target.value)}
              placeholder="https://…"
            />
            <button
              type="button"
              onClick={() => removeSocial(i)}
              className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-surface-raised hover:text-destructive"
              aria-label="Remove social"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSocial}>
          <Plus className="h-3.5 w-3.5" /> Add social link
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
