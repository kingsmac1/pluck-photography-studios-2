import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { contact } from "@/lib/site";

/** Presentation-only enquiry form with a success state. */
export function ContactSection() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.6rem)]">Get In Touch</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tell us what you are planning — a session, a wedding, an event — and we will come back
            with availability and a recommendation.
          </p>

          <dl className="mt-12 space-y-8">
            <div>
              <dt className="eyebrow">Visit Us</dt>
              <dd className="mt-2 text-sm">{contact.address}</dd>
            </div>
            <div>
              <dt className="eyebrow">Contact Us</dt>
              <dd className="mt-2 text-sm">
                <a className="link-underline" href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email Us</dt>
              <dd className="mt-2 text-sm">
                <a className="link-underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={140}>
          <form onSubmit={onSubmit} className="rounded-lg bg-surface p-8 lg:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow">Name</span>
                <input
                  required
                  name="name"
                  className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm outline-hidden transition-colors focus:border-foreground"
                />
              </label>
              <label className="block">
                <span className="eyebrow">Email Address</span>
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm outline-hidden transition-colors focus:border-foreground"
                />
              </label>
            </div>
            <label className="mt-8 block">
              <span className="eyebrow">Message</span>
              <textarea
                required
                name="message"
                rows={5}
                className="mt-3 w-full resize-none border-b border-border bg-transparent pb-3 text-sm outline-hidden transition-colors focus:border-foreground"
              />
            </label>
            <button
              type="submit"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-85"
            >
              {sent ? "Thanks — we'll be in touch" : "Submit"}
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              Prefer email? Write to {contact.email} and we usually reply within one business day.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
