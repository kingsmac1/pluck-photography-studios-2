# Pluck Photography — Navigation, Galleries, Logo & SEO Pass

## About the images (important clarification)

Every photo on the site is already a real `.jpg` / `.png` file, served from Lovable's image CDN. The `.asset.json` files in `src/assets/photos/` are not images — they are one-line pointer files that record where each real JPEG lives. Nothing is converted to JSON, and the browser only ever loads `.jpg`/`.png`. This keeps the project fast and is the recommended setup, so those pointer files stay as they are. All of them are verified working and already referenced through `src/lib/photos.ts`.

## What changes

**1. Mobile & tablet menu — fullscreen overlay**
- Replace the current collapsing panel with a true fullscreen overlay (covers the whole viewport, solid background, no page scroll behind it).
- Menu items become very large and super bold, vertically stacked and centered, with the Book Now button beneath them.
- Close by tapping the X or any link. Applies to mobile and tablet; desktop nav unchanged.

**2. Centered desktop navigation**
- Navbar becomes three zones: logo left, menu links centered, Book Now right.

**3. Bigger logo, new file**
- Use the uploaded "Pluck Photography 2" mark for both navbar and footer.
- Navbar logo roughly doubles in height (about 18px → the largest size that still fits the bar cleanly, shrinking slightly when the header condenses on scroll). Footer logo scales up similarly.

**4. Favicon**
- Generate a square favicon from the Pluck logo, place it in `public/`, point the site at it, and remove the default Lovable icon.

**5. Masonry galleries everywhere**
- Gallery detail pages: forced masonry — a real staggered column layout with varied image heights so no two columns line up, natural photo proportions preserved (no cropping to a fixed box).
- The category cards grid on the homepage/galleries section becomes masonry-styled as well, keeping the hover zoom and labels.

**6. At least 5 images per gallery**
- Each of the 7 galleries (Wedding, Birthdays, Events, Portraits, Family, Kids, Maternity) is checked and topped up to a minimum of 5 photos, reusing suitable frames across galleries where needed. Current sets already carry 8 each, so this is a verification pass plus any swaps needed for better fit.

**7. Meta / OG data**
- Every route gets Pluck-specific, SEO-compliant metadata: unique title under 60 chars with Calgary + service keywords, description under 160 chars, matching `og:title` / `og:description` / `og:type` / `og:url`, `twitter:card`, self-referencing canonical, plus a hero `og:image` / `twitter:image` on each page that has one.
- Root keeps sitewide defaults and LocalBusiness JSON-LD (studio name, Calgary location, phone, socials).

Everything else — copy, colours, pricing, testimonials, layout of other sections — stays exactly as it is.

## Technical notes

- `SiteHeader.tsx`: `grid-cols-[auto_1fr_auto]` desktop bar; overlay rendered as `fixed inset-0 z-[60]` with `overflow-hidden` on body while open.
- Masonry: CSS `columns` with per-item aspect variation on gallery pages; `GalleryCards` moves to a column-based masonry with alternating card heights.
- New logo uploaded via the asset CLI and added to `src/lib/photos.ts` as `logoLight`; favicon written as a real square PNG in `public/`.
- Metadata edited per route in each `head()`; canonical/og:url stay relative until a domain is set.
