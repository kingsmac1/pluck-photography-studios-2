import { createFileRoute, Link } from "@tanstack/react-router";
import { Images, Star, Tag, GalleryHorizontal, Phone, FileText } from "lucide-react";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: DashboardOverview,
});

const quickLinks = [
  { to: "/dashboard/galleries", label: "Galleries", icon: Images },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  { to: "/dashboard/pricing", label: "Pricing", icon: Tag },
  { to: "/dashboard/hero", label: "Hero Slides", icon: GalleryHorizontal },
  { to: "/dashboard/contact", label: "Contact Info", icon: Phone },
  { to: "/dashboard/pages/about", label: "About Page", icon: FileText },
  { to: "/dashboard/pages/services", label: "Services Page", icon: FileText },
] as const;

function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="display mt-2 text-3xl">Overview</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Edits here commit straight to the live site's GitHub repo. Changes go live after a short
          redeploy — usually 1–2 minutes.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-lg bg-surface p-5 transition-colors hover:bg-surface-raised"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
