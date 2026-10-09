"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { selectSubtotal, useCart } from "@/store/cart";
import { formatPrice, formatStorage } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";
import { Button, ButtonLink } from "@/components/ui/button";
import { PhoneIllustration } from "@/components/product/phone-illustration";

const FREE_SHIPPING_THRESHOLD = 2_000_000;

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const subtotal = useCart(selectSubtotal);
  const closeRef = useRef<HTMLButtonElement>(null);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <m.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden="true"
          />
          <m.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 id="cart-title" className="text-lg font-semibold">
                Tu carrito
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-white/10"
                aria-label="Cerrar carrito"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-white/5">
                  <ShoppingBag className="size-7 text-muted" aria-hidden="true" />
                </div>
                <p className="text-muted">Tu carrito está vacío.</p>
                <ButtonLink href="/productos" onClick={close}>
                  Explorar celulares
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="border-b border-border px-5 py-3 text-sm">
                  {remaining > 0 ? (
                    <p className="text-muted">
                      Te faltan <span className="font-medium text-foreground">{formatPrice(remaining)}</span> para el
                      envío gratis.
                    </p>
                  ) : (
                    <p className="text-emerald-300">¡Tienes envío gratis!</p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <m.div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                      animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 space-y-3 overflow-y-auto p-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const brand = getProductBySlug(item.slug)?.brand ?? "Apple";
                      return (
                        <m.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4 rounded-2xl border border-border bg-surface-2 p-3"
                        >
                          <div className="size-20 shrink-0 rounded-xl bg-white/5 p-1">
                            <PhoneIllustration brand={brand} color={item.color} />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link
                              href={`/productos/${item.slug}`}
                              onClick={close}
                              className="truncate font-medium hover:underline"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-muted">
                              {item.color.name} · {formatStorage(item.storage)}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-full border border-border">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                  className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-white/10"
                                  aria-label={`Disminuir cantidad de ${item.name}`}
                                >
                                  <Minus className="size-3.5" aria-hidden="true" />
                                </button>
                                <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                  className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-white/10"
                                  aria-label={`Aumentar cantidad de ${item.name}`}
                                >
                                  <Plus className="size-3.5" aria-hidden="true" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            className="cursor-pointer self-start rounded-full p-1.5 text-muted hover:bg-white/10 hover:text-red-400"
                            aria-label={`Eliminar ${item.name} del carrito`}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </m.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="space-y-4 border-t border-border p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-xl font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => window.alert("Checkout de demostración: integra aquí tu pasarela de pago.")}
                  >
                    Finalizar compra
                  </Button>
                </div>
              </>
            )}
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
