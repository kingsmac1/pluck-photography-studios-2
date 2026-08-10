import { BOOKING_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type BookNowProps = {
  className?: string;
  tone?: "light" | "dark";
  label?: string;
};

/** Pill CTA that opens the external Pixieset booking page in a new tab. */
export function BookNow({ className, tone = "light", label = "Book Now" }: BookNowProps) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] transition-all duration-500",
        tone === "light"
          ? "bg-foreground text-background hover:bg-foreground/85"
          : "bg-light-foreground text-light hover:bg-light-foreground/85",
        className,
      )}
    >
      {label}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
        &#8594;
      </span>
    </a>
  );
}
