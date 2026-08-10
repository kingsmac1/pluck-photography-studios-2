import { BookNow } from "./BookNow";
import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";
import { photos } from "@/lib/photos";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden">
      <Parallax speed={0.28} className="absolute inset-0 -z-10">
        <img
          src={photos.bannerWide2}
          alt=""
          aria-hidden
          loading="lazy"
          className="h-[130%] w-full scale-110 object-cover opacity-40"
        />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background/60 to-background" />
      <div className="mx-auto max-w-[1400px] px-6 py-32 text-center lg:px-10 lg:py-44">
        <Reveal>
          <p className="eyebrow">Book Your Session</p>
          <h2 className="display mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,5.6vw,4.4rem)]">
            Timeless Images. Exceptional Experience.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Studio dates in Calgary fill quickly through the season. Choose a time that works and we
            will take care of the rest.
          </p>
          <BookNow className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}
