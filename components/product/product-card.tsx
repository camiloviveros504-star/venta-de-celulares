import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";
import { TiltCard } from "@/components/ui/tilt-card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { PhoneIllustration } from "./phone-illustration";
import { QuickAddButton } from "./quick-add-button";

/**
 * Tarjeta de producto (Server Component). Las capas usan `translateZ` dentro
 * del contexto 3D de `TiltCard` para crear parallax de profundidad.
 */
export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const [color] = product.colors;

  return (
    <TiltCard className="rounded-3xl">
      <article className="relative flex h-full flex-col rounded-3xl border border-border bg-surface/80 p-5 transition-colors duration-300 [transform-style:preserve-3d] group-hover:border-brand/40">
        {/* Fondo con resplandor (recortado aparte para no aplanar el 3D). */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl">
          <div
            className="absolute top-6 left-1/2 size-48 -translate-x-1/2 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: color.accent }}
          />
        </div>

        {/* Enlace que cubre toda la tarjeta. */}
        <Link href={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="absolute inset-0 rounded-3xl" />

        <div className="pointer-events-none absolute top-4 left-4 flex gap-2 [transform:translateZ(40px)]">
          {product.isNew && <Badge tone="brand">Nuevo</Badge>}
          {discount && <Badge tone="success">-{discount}%</Badge>}
        </div>

        <div className="pointer-events-none relative mx-auto mb-4 aspect-[4/5] w-full max-w-60 [transform:translateZ(70px)]">
          <PhoneIllustration
            brand={product.brand}
            color={color}
            className="drop-shadow-[0_25px_25px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2"
          />
        </div>

        <div className="pointer-events-none relative mt-auto flex flex-col gap-2 [transform:translateZ(35px)]">
          <p className="text-xs font-medium tracking-wider text-muted uppercase">{product.brand}</p>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <Rating value={product.rating} />
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              {product.compareAtPrice && (
                <p className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</p>
              )}
              <p className="text-xl font-semibold">{formatPrice(product.price)}</p>
            </div>
            <QuickAddButton product={product} className="pointer-events-auto" />
          </div>
          <ul className="flex gap-1.5 pt-1" aria-label="Colores disponibles">
            {product.colors.map((c) => (
              <li key={c.name} title={c.name} className="size-3.5 rounded-full ring-1 ring-white/20" style={{ backgroundColor: c.hex }}>
                <span className="sr-only">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </TiltCard>
  );
}
