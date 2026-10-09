import { CreditCard, Headphones, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { Phone3D } from "@/components/product/phone-3d";
import { cn } from "@/lib/cn";

const tile = "relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8";
const iconBox =
  "mb-5 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/30 to-brand-2/20 ring-1 ring-white/10";

/** Beneficios en formato bento con un teléfono CSS 3D girando en la celda principal. */
export function Features({ product }: { product: Product }) {
  return (
    <section id="beneficios" className="scroll-mt-24 py-24">
      <Container>
        <SectionHeading eyebrow="Beneficios" title="Comprar tu próximo celular nunca fue tan fácil" />

        <ul className="grid auto-rows-[minmax(13rem,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
          <li className="md:col-span-2 lg:row-span-2">
            <Reveal className="h-full">
              <TiltCard className="rounded-3xl" max={6}>
                <div className={cn(tile, "bg-gradient-to-br from-brand/20 via-surface to-surface")}>
                  <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_70%_60%,black,transparent_70%)]" />
                  <span className={iconBox}>
                    <ShieldCheck className="size-6 text-brand-2" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-2xl font-semibold">Garantía oficial de fábrica</h3>
                  <p className="max-w-xs text-muted">
                    Equipos nuevos, sellados y 100% originales. Si algo falla, lo resolvemos sin costo.
                  </p>
                  <div className="relative mt-auto flex justify-center pt-8 [perspective:1000px] sm:justify-end">
                    <div className="animate-spin-y [transform-style:preserve-3d]">
                      <Phone3D brand={product.brand} color={product.colors[0]} width={130} />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </li>

          <li>
            <Reveal delay={0.1} className="h-full">
              <TiltCard className="rounded-3xl" max={8}>
                <div className={tile}>
                  <span className={iconBox}>
                    <Truck className="size-6 text-brand-2" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-lg font-semibold">Envío gratis</h3>
                  <p className="text-sm text-muted">En compras desde $2.000.000. Entrega en 24–72 h.</p>
                </div>
              </TiltCard>
            </Reveal>
          </li>

          <li>
            <Reveal delay={0.2} className="h-full">
              <TiltCard className="rounded-3xl" max={8}>
                <div className={tile}>
                  <span className={iconBox}>
                    <Headphones className="size-6 text-brand-2" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-lg font-semibold">Soporte experto</h3>
                  <p className="text-sm text-muted">Te asesoramos antes y después de tu compra, todos los días.</p>
                </div>
              </TiltCard>
            </Reveal>
          </li>

          <li className="md:col-span-2">
            <Reveal delay={0.3} className="h-full">
              <TiltCard className="rounded-3xl" max={6}>
                <div className={cn(tile, "sm:flex-row sm:items-center sm:gap-8")}>
                  <div className="flex-1">
                    <span className={iconBox}>
                      <CreditCard className="size-6 text-brand-2" aria-hidden="true" />
                    </span>
                    <h3 className="mb-2 text-lg font-semibold">Pagos seguros y a cuotas</h3>
                    <p className="text-sm text-muted">Tarjetas, PSE y hasta 12 cuotas sin interés con bancos aliados.</p>
                  </div>
                  {/* Tarjeta de crédito decorativa en 3D */}
                  <div aria-hidden="true" className="mt-6 [perspective:800px] sm:mt-0">
                    <div className="relative h-28 w-44 rounded-2xl bg-gradient-to-br from-brand via-violet-700 to-brand-2 p-4 shadow-2xl shadow-brand/30 transition-transform duration-700 [transform:rotateY(-25deg)_rotateX(12deg)] group-hover:[transform:rotateY(0deg)_rotateX(0deg)]">
                      <div className="h-6 w-8 rounded-md bg-amber-200/80" />
                      <p className="mt-4 font-mono text-xs tracking-widest text-white/90">•••• 4242</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </li>
        </ul>
      </Container>
    </section>
  );
}
