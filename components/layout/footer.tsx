import Link from "next/link";
import { CreditCard, Lock, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BRANDS } from "@/lib/products";
import { Logo } from "./logo";
import { NAV_LINKS } from "./nav-links";
import { NewsletterForm } from "./newsletter-form";

const TRUST = [
  { icon: Truck, label: "Envío a todo el país" },
  { icon: ShieldCheck, label: "Garantía oficial" },
  { icon: Lock, label: "Pago 100% seguro" },
  { icon: CreditCard, label: "Hasta 12 cuotas" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-surface/40">
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]"
      />

      <Container className="relative">
        {/* Newsletter */}
        <div className="flex flex-col gap-6 border-b border-border py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Ofertas exclusivas en tu correo</h2>
            <p className="mt-1 text-muted">Lanzamientos, descuentos y preventas antes que nadie.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm text-muted">
              Los mejores celulares del mercado, con garantía oficial, envío rápido a todo el país y pagos seguros.
            </p>
            <ul className="grid max-w-sm grid-cols-2 gap-3 pt-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-xs text-muted">
                  <Icon className="size-4 text-brand-2" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Enlaces del sitio">
            <h2 className="mb-4 text-sm font-semibold">Tienda</h2>
            <ul className="space-y-2 text-sm text-muted">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 text-sm font-semibold">Marcas</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm text-muted lg:grid-cols-1">
              {BRANDS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Marca gigante */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.22em] text-center text-[19vw] leading-none font-bold tracking-tighter text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.08)]"
      >
        CelluStore
      </p>

      <div className="relative border-t border-border py-6 text-center text-xs text-muted">
        © CelluStore · Proyecto de demostración
      </div>
    </footer>
  );
}
