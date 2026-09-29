import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Images,
  Star,
  Tag,
  GalleryHorizontal,
  Phone,
  FileText,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { sessionFn, logoutFn } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout")({
  beforeLoad: async () => {
    const session = await sessionFn();
    if (!session.authenticated) {
      throw redirect({ to: "/dashboard/login" });
    }
  },
  component: DashboardLayout,
});

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/galleries", label: "Galleries", icon: Images },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  { to: "/dashboard/pricing", label: "Pricing", icon: Tag },
  { to: "/dashboard/hero", label: "Hero", icon: GalleryHorizontal },
  { to: "/dashboard/contact", label: "Contact", icon: Phone },
  { to: "/dashboard/pages/about", label: "About Page", icon: FileText },
  { to: "/dashboard/pages/services", label: "Services Page", icon: FileText },
] as const;

const primaryMobileItems = navItems.slice(0, 4);
const overflowMobileItems = navItems.slice(4);

function DashboardLayout() {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const onLogout = async () => {
    await logoutFn();
    await navigate({ to: "/dashboard/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface md:flex">
        <div className="px-6 py-8">
          <p className="eyebrow">Pluck Photography</p>
          <p className="display mt-1 text-lg">Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/dashboard" }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground [&.active]:bg-surface-raised [&.active]:text-foreground"
              activeProps={{ className: "active" }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="pb-20 md:pb-0 md:pl-64">
        <main className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        {primaryMobileItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/dashboard" }}
            className="flex flex-1 flex-col items-center gap-1 px-2 py-3 text-[10px] text-muted-foreground [&.active]:text-foreground"
            activeProps={{ className: "active" }}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex flex-1 flex-col items-center gap-1 px-2 py-3 text-[10px] text-muted-foreground"
            >
              <MoreHorizontal className="h-5 w-5" />
              More
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-xl bg-surface pb-[env(safe-area-inset-bottom)]"
          >
            <SheetTitle className="eyebrow">More</SheetTitle>
            <div className="grid grid-cols-3 gap-2 py-4">
              {overflowMobileItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-md p-4 text-xs text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 text-sm text-muted-foreground",
              )}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
