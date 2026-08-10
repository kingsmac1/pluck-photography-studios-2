import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";

/** Inner-page header with a parallax photographic backdrop. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
}) {
  return (
    <header className="relative overflow-hidden">
      <Parallax speed={0.22} className="absolute inset-0 -z-10">
        <img
          src={image}
          alt=""
          aria-hidden
          className="h-[130%] w-full scale-110 object-cover opacity-35 grayscale"
        />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background/85 via-background/70 to-background" />
      <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-44 lg:px-10 lg:pb-28 lg:pt-56">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5rem)]">{title}</h1>
          {intro ? (
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {intro}
            </p>
          ) : null}
        </Reveal>
      </div>
    </header>
  );
}
