import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookNow } from "./BookNow";
import { photos } from "@/lib/photos";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 transition-all duration-500",
          open ? "z-[70]" : "z-50",
          scrolled && !open ? "bg-background/80 py-3 backdrop-blur-xl" : "bg-transparent py-5",
        )}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 lg:grid-cols-[auto_1fr_auto] lg:px-10">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <img
              src={photos.logoLight}
              alt="Pluck Photography Studios"
              className={cn("w-auto transition-all duration-500", scrolled ? "h-11" : "h-14")}
            />
          </Link>


          <nav className="hidden items-center justify-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="link-underline text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-3">
            <BookNow className="hidden sm:inline-flex lg:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-[70] grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-foreground transition-transform duration-300",
                    open && "top-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-foreground transition-transform duration-300",
                    open && "bottom-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen overlay menu — mobile and tablet */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background transition-opacity duration-400 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-6 px-6">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-[clamp(2rem,9vw,3.5rem)] font-black uppercase leading-none tracking-tight text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <BookNow className="mt-8" />
        </nav>
      </div>
    </>
  );
}
