import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function PromoBanner() {
  return (
    <section aria-labelledby="promo-title">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-brand/30 via-surface to-brand-2/20 px-6 py-14 text-center sm:px-16">
            <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
            <p className="mb-3 text-sm font-semibold tracking-widest text-brand-2 uppercase">Plan retoma</p>
            <h2 id="promo-title" className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Entrega tu celular usado y ahorra hasta un 40%
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Cotiza en minutos y usa el valor de tu equipo actual como parte de pago.
            </p>
            <ButtonLink href="/productos" size="lg" className="mt-8">
              Ver ofertas <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
