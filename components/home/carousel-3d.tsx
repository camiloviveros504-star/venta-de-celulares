"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { PhoneIllustration } from "@/components/product/phone-illustration";

const AUTO_SPEED = 0.006; // grados por ms
const DRAG_FACTOR = 0.25;

/**
 * Carrusel cilíndrico en CSS 3D. Gira solo, se arrastra con inercia y se
 * controla con teclado (al enfocar una tarjeta, gira hasta ponerla al frente).
 */
export function Carousel3D({ products }: { products: readonly Product[] }) {
  const n = products.length;
  const step = 360 / n;
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const reduce = useReducedMotion();
  const rotation = useMotionValue(0);
  const smooth = useSpring(rotation, { stiffness: 70, damping: 20 });
  const [cardWidth, setCardWidth] = useState(220);
  // Radio para que las tarjetas queden contiguas: ancho / (2·tan(π/n)), con un pequeño margen.
  const radius = Math.round((cardWidth * 1.08) / (2 * Math.tan(Math.PI / n)));
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const dragDistance = useRef(0);

  // Tamaño de tarjeta responsive según el ancho disponible.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCardWidth(Math.round(Math.min(250, Math.max(150, entry.contentRect.width * 0.42))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused.current || reduce || !inView) return;
    rotation.set(rotation.get() - delta * AUTO_SPEED);
  });

  useMotionValueEvent(smooth, "change", (v) => {
    const index = (((Math.round(-v / step) % n) + n) % n) as number;
    setActive((prev) => (prev === index ? prev : index));
  });

  const snapTo = (index: number) => {
    const current = rotation.get();
    const target = -index * step;
    // Elige la vuelta más cercana para no girar de más.
    const turns = Math.round((current - target) / 360);
    rotation.set(target + turns * 360);
  };

  const nudge = (dir: 1 | -1) => {
    const snapped = Math.round(rotation.get() / step) * step;
    rotation.set(snapped - dir * step);
  };

  const current = products[active];

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative h-[420px] w-full cursor-grab [perspective:1200px] active:cursor-grabbing sm:h-[480px]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <m.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          // Se aleja el anillo su radio: la tarjeta frontal queda a tamaño real (z = 0).
          style={{ z: -radius, rotateY: smooth, touchAction: "pan-y" }}
          onPanStart={() => {
            paused.current = true;
            dragDistance.current = 0;
          }}
          onPan={(_, info) => {
            dragDistance.current += Math.abs(info.delta.x);
            rotation.set(rotation.get() + info.delta.x * DRAG_FACTOR);
          }}
          onPanEnd={(_, info) => {
            rotation.set(rotation.get() + info.velocity.x * 0.04);
            paused.current = false;
          }}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="absolute top-1/2 left-1/2 [backface-visibility:hidden]"
              style={{
                width: cardWidth,
                marginLeft: -cardWidth / 2,
                marginTop: -cardWidth * 0.75,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              }}
            >
              <Link
                href={`/productos/${product.slug}`}
                draggable={false}
                onFocus={() => {
                  paused.current = true;
                  snapTo(i);
                }}
                onBlur={() => (paused.current = false)}
                onClickCapture={(e: MouseEvent) => {
                  if (dragDistance.current > 8) e.preventDefault();
                }}
                className="group block rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-4 shadow-2xl shadow-black/60 transition-colors hover:border-brand/50"
              >
                <div className="relative aspect-[4/5]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-6 rounded-full opacity-40 blur-2xl"
                    style={{ background: product.colors[0].accent }}
                  />
                  <PhoneIllustration
                    brand={product.brand}
                    color={product.colors[0]}
                    className="relative transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 truncate text-center text-sm font-semibold">{product.name}</p>
              </Link>
            </div>
          ))}
        </m.div>

        {/* Suelo reflectante */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,rgb(139_92_246/0.35),transparent_70%)] blur-xl"
        />
      </div>

      <div className="mt-6 flex items-center gap-6">
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="grid size-12 cursor-pointer place-items-center rounded-full border border-border bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Producto anterior"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="min-w-48 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-semibold">{current.name}</p>
              <p className="text-sm text-muted">Desde {formatPrice(current.price)}</p>
            </m.div>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => nudge(1)}
          className="grid size-12 cursor-pointer place-items-center rounded-full border border-border bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Producto siguiente"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
