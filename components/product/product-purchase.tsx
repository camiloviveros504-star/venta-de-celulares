"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice, formatStorage } from "@/lib/format";
import { priceForStorage } from "@/lib/products";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { PhoneScene } from "@/components/three/phone-scene";
import { ColorSwatches } from "./color-swatches";

export function ProductPurchase({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [color, setColor] = useState(product.colors[0]);
  const [storage, setStorage] = useState(product.storage[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = priceForStorage(product, storage);
  const compareAt = product.compareAtPrice ? product.compareAtPrice + (price - product.price) : undefined;
  const discount = discountPercent(price, compareAt);
  const lowStock = product.stock < 10;

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color,
      storage,
      unitPrice: price,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <div className="relative lg:sticky lg:top-24">
        <m.div
          aria-hidden="true"
          className="absolute inset-10 -z-10 rounded-full opacity-30 blur-[100px]"
          animate={{ backgroundColor: color.accent }}
        />
        <PhoneScene
          color={color}
          brand={product.brand}
          mode="viewer"
          label={`Modelo 3D del ${product.name} en ${color.name}. Arrastra para girarlo.`}
          className="aspect-square w-full rounded-[2rem] border border-border bg-surface/50"
        />
        <p className="mt-3 text-center text-xs text-muted">Arrastra para girar el modelo 360°</p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{product.brand}</Badge>
            {product.isNew && <Badge tone="brand">Nuevo</Badge>}
            {discount && <Badge tone="success">Ahorra {discount}%</Badge>}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted">{product.tagline}</p>
          <div className="mt-4">
            <Rating value={product.rating} reviews={product.reviews} />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.p
              key={price}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="text-3xl font-semibold"
            >
              {formatPrice(price)}
            </m.p>
          </AnimatePresence>
          {compareAt && <p className="text-lg text-muted line-through">{formatPrice(compareAt)}</p>}
        </div>

        <p className="text-muted text-pretty">{product.description}</p>

        <div>
          <p className="mb-3 text-sm font-semibold">
            Color: <span className="font-normal text-muted">{color.name}</span>
          </p>
          <ColorSwatches colors={product.colors} value={color} onChange={setColor} />
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Almacenamiento</legend>
          <div className="grid grid-cols-3 gap-3">
            {product.storage.map((gb) => {
              const active = gb === storage;
              return (
                <label
                  key={gb}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-3 text-center transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-2",
                    active ? "border-brand bg-brand/15" : "border-border hover:border-white/25",
                  )}
                >
                  <input
                    type="radio"
                    name="storage"
                    value={gb}
                    checked={active}
                    onChange={() => setStorage(gb)}
                    className="sr-only"
                  />
                  <span className="block font-semibold">{formatStorage(gb)}</span>
                  <span className="block text-xs text-muted">{formatPrice(priceForStorage(product, gb))}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-13 items-center justify-between rounded-full border border-border px-2 sm:w-36">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/10"
              aria-label="Disminuir cantidad"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="tabular-nums" aria-live="polite" aria-label={`Cantidad: ${quantity}`}>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, 10, q + 1))}
              className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/10"
              aria-label="Aumentar cantidad"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <Button size="lg" className="flex-1" onClick={handleAdd}>
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={added ? "added" : "add"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="flex items-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="size-5" aria-hidden="true" /> ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-5" aria-hidden="true" /> Agregar al carrito
                  </>
                )}
              </m.span>
            </AnimatePresence>
          </Button>
        </div>

        <ul className="space-y-2 rounded-2xl border border-border bg-surface p-4 text-sm">
          <li className="flex items-center gap-2 text-muted">
            <Truck className="size-4 text-brand-2" aria-hidden="true" /> Envío gratis · Entrega en 24–72 h
          </li>
          <li className={cn("flex items-center gap-2", lowStock ? "text-amber-300" : "text-emerald-300")}>
            <span className="size-2 rounded-full bg-current" aria-hidden="true" />
            {lowStock ? `¡Solo quedan ${product.stock} unidades!` : "En stock"}
          </li>
        </ul>
      </div>
    </div>
  );
}
