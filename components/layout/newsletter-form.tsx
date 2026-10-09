"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo: aquí se integraría el proveedor de email marketing.
    setDone(true);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <m.p
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-12 items-center gap-2 text-emerald-300"
          role="status"
        >
          <Check className="size-5" aria-hidden="true" /> ¡Listo! Te avisaremos de las mejores ofertas.
        </m.p>
      ) : (
        <m.form key="form" exit={{ opacity: 0, y: -8 }} onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className="h-12 min-w-0 flex-1 rounded-full border border-border bg-surface-2 px-5 text-sm placeholder:text-muted focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-gradient-to-r from-brand to-brand-2 text-white transition-transform hover:scale-105 active:scale-95"
            aria-label="Suscribirme"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </m.form>
      )}
    </AnimatePresence>
  );
}
