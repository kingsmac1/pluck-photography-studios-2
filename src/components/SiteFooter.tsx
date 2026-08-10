import { Link } from "@tanstack/react-router";
import { BookNow } from "./BookNow";
import { photos } from "@/lib/photos";
import { contact, galleries, navLinks } from "@/lib/site";

/** Footer content revealed from beneath the page as you reach the bottom. */
export function SiteFooter() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:px-10 lg:py-20">
      <div>
        <img src={photos.logo} alt="Pluck Photography Studios" className="h-10 w-auto" />
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
          A Calgary photography studio capturing portraits, weddings, events and family sessions —
          exquisite, timeless images made with precision and a little artistic flair.
        </p>
        <BookNow className="mt-8" />
      </div>

      <div>
        <h3 className="eyebrow">Contact</h3>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          <li>
            <a className="link-underline hover:text-foreground" href={contact.phoneHref}>
              {contact.phone}
            </a>
          </li>
          <li>
            <a className="link-underline hover:text-foreground" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </li>
          <li>{contact.address}</li>
        </ul>
        <ul className="mt-8 flex gap-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {contact.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-foreground"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow">Quick Links</h3>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {navLinks.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="link-underline hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow">Galleries</h3>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {galleries.map((g) => (
            <li key={g.slug}>
              <Link
                to="/gallery/$slug"
                params={{ slug: g.slug }}
                className="link-underline hover:text-foreground"
              >
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-full flex flex-col gap-3 border-t border-border pt-8 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Pluck Photography Studios</span>
        <span>Calgary, Alberta &middot; By Appointment</span>
      </div>
    </div>
  );
}
