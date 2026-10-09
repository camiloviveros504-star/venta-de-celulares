import { BRANDS } from "@/lib/products";

export function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <section aria-label="Marcas disponibles" className="relative overflow-hidden border-y border-border bg-surface/40 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <ul className="flex w-max animate-marquee gap-16 hover:[animation-play-state:paused]">
        {items.map((brand, i) => (
          <li
            key={`${brand}-${i}`}
            aria-hidden={i >= BRANDS.length}
            className="text-2xl font-semibold tracking-tight text-white/30 transition-colors hover:text-white"
          >
            {brand}
          </li>
        ))}
      </ul>
    </section>
  );
}
