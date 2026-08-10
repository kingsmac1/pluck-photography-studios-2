import { BookNow } from "./BookNow";
import { Reveal } from "./Reveal";
import { pricing } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PricingSection({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      {withHeading ? (
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Pricing Plan</p>
          <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.6rem)]">Sessions & Rates</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            Studio session pricing, all inclusive of direction, professional lighting and hand
            editing. Wedding and event coverage is quoted per day — get in touch for a tailored
            estimate.
          </p>
        </Reveal>
      ) : null}

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {pricing.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 110}>
            <div
              className={cn(
                "flex h-full flex-col rounded-lg p-8 transition-transform duration-700 hover:-translate-y-1.5 lg:p-10",
                plan.featured ? "bg-light text-light-foreground" : "bg-surface",
              )}
            >
              <p
                className={cn(
                  "text-[11px] uppercase tracking-[0.28em]",
                  plan.featured ? "text-light-foreground/60" : "text-muted-foreground",
                )}
              >
                {plan.name}
              </p>
              <p className="display mt-6 text-5xl">{plan.price}</p>
              <ul
                className={cn(
                  "mt-8 flex-1 space-y-4 border-t pt-8 text-sm",
                  plan.featured
                    ? "border-light-foreground/15 text-light-foreground/75"
                    : "border-border text-muted-foreground",
                )}
              >
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <BookNow className="mt-10 w-fit" tone={plan.featured ? "dark" : "light"} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
