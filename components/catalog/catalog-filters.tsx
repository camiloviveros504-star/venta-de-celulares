"use client";

import { useId } from "react";
import type { Brand, ProductFilters, SortOption } from "@/lib/types";
import { formatPrice, formatStorage } from "@/lib/format";
import { cn } from "@/lib/cn";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Destacados",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  rating: "Mejor calificados",
  newest: "Más nuevos",
};

interface Props {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  brands: readonly Brand[];
  storageOptions: readonly number[];
  minPrice: number;
  maxPrice: number;
}

function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const chip =
  "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-2";

export function CatalogFilters({ filters, onChange, brands, storageOptions, minPrice, maxPrice }: Props) {
  const id = useId();
  const sortId = `${id}-sort`;
  const priceId = `${id}-price`;
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor={sortId} className="mb-3 block text-sm font-semibold">
          Ordenar por
        </label>
        <select
          id={sortId}
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          className="w-full cursor-pointer rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Marca</legend>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
            const active = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className={cn(chip, active ? "border-brand bg-brand/20 text-foreground" : "border-border text-muted hover:text-foreground")}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => onChange({ brands: toggle(filters.brands, brand) })}
                />
                {brand}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Almacenamiento</legend>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((gb) => {
            const active = filters.storage.includes(gb);
            return (
              <label
                key={gb}
                className={cn(chip, active ? "border-brand-2 bg-brand-2/15 text-foreground" : "border-border text-muted hover:text-foreground")}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => onChange({ storage: toggle(filters.storage, gb) })}
                />
                {formatStorage(gb)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor={priceId} className="text-sm font-semibold">
            Precio máximo
          </label>
          <output htmlFor={priceId} className="text-sm text-brand-2">
            {formatPrice(filters.maxPrice)}
          </output>
        </div>
        <input
          id={priceId}
          type="range"
          min={minPrice}
          max={maxPrice}
          step={100_000}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full cursor-pointer accent-violet-500"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4">
        <span className="text-sm font-semibold">Solo ofertas</span>
        <input
          type="checkbox"
          role="switch"
          checked={filters.onlyDeals}
          onChange={(e) => onChange({ onlyDeals: e.target.checked })}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="relative h-6 w-11 rounded-full bg-white/10 transition-colors peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-2 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
        />
      </label>
    </div>
  );
}
