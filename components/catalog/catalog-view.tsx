"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product, ProductFilters } from "@/lib/types";
import { BRANDS, DEFAULT_FILTERS, MAX_PRICE, STORAGE_OPTIONS, filterProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { CatalogFilters } from "./catalog-filters";

const MIN_PRICE = 1_000_000;

export function CatalogView({ products }: { products: readonly Product[] }) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const deferredFilters = useDeferredValue(filters);
  const results = useMemo(() => filterProducts(products, deferredFilters), [products, deferredFilters]);

  const update = (patch: Partial<ProductFilters>) => setFilters((prev) => ({ ...prev, ...patch }));
  const reset = () => setFilters(DEFAULT_FILTERS);

  const activeCount =
    filters.brands.length + filters.storage.length + Number(filters.onlyDeals) + Number(filters.maxPrice < MAX_PRICE);

  const filterPanel = (
    <CatalogFilters
      filters={filters}
      onChange={update}
      brands={BRANDS}
      storageOptions={STORAGE_OPTIONS}
      minPrice={MIN_PRICE}
      maxPrice={MAX_PRICE}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Panel lateral (escritorio) */}
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-24 rounded-3xl border border-border bg-surface p-6">
          {filterPanel}
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="mt-6 w-full">
              <RotateCcw className="size-4" aria-hidden="true" /> Limpiar filtros
            </Button>
          )}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="catalog-search" className="sr-only">
              Buscar celulares
            </label>
            <input
              id="catalog-search"
              type="search"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="Buscar por modelo o marca…"
              className="h-12 w-full rounded-full border border-border bg-surface pr-4 pl-11 text-sm placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>
          <Button
            variant="secondary"
            className="h-12 lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="mobile-filters"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros{activeCount > 0 && ` (${activeCount})`}
          </Button>
        </div>

        {/* Panel de filtros (móvil / tableta) */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <m.div
              id="mobile-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mb-6 rounded-3xl border border-border bg-surface p-5">
                {filterPanel}
                <div className="mt-6 flex gap-3">
                  <Button variant="ghost" size="sm" onClick={reset} className="flex-1">
                    <RotateCcw className="size-4" aria-hidden="true" /> Limpiar
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)} className="flex-1">
                    <X className="size-4" aria-hidden="true" /> Cerrar
                  </Button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <p className="mb-4 text-sm text-muted" aria-live="polite">
          {results.length === 1 ? "1 resultado" : `${results.length} resultados`}
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-20 text-center">
            <p className="text-lg font-medium">No encontramos celulares con esos filtros.</p>
            <Button variant="secondary" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" /> Limpiar filtros
            </Button>
          </div>
        ) : (
          <m.ul layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((product) => (
                <m.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <ProductCard product={product} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        )}
      </div>
    </div>
  );
}
