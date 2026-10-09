import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-gradient animate-shimmer text-8xl font-bold">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">No encontramos esta página</h1>
      <p className="max-w-md text-muted">Es posible que el producto ya no esté disponible o que el enlace sea incorrecto.</p>
      <ButtonLink href="/productos">Ir al catálogo</ButtonLink>
    </Container>
  );
}
