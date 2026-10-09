"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/cn";

/** Agregado rápido con la configuración por defecto (primer color y capacidad). */
export function QuickAddButton({ product, className }: { product: Product; className?: string }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: product.colors[0],
      storage: product.storage[0],
      unitPrice: product.price,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative grid size-11 cursor-pointer place-items-center rounded-full bg-white text-black shadow-lg shadow-black/40 transition-transform hover:scale-110 active:scale-95",
        added && "bg-emerald-400",
        className,
      )}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      {added ? <Check className="size-5" aria-hidden="true" /> : <ShoppingBag className="size-5" aria-hidden="true" />}
    </button>
  );
}
