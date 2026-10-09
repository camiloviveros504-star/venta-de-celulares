"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { Brand, ProductColor } from "@/lib/types";
import { PhoneIllustration } from "@/components/product/phone-illustration";
import { cn } from "@/lib/cn";

const PhoneCanvas = dynamic(() => import("./phone-canvas"), { ssr: false });

interface Props {
  color: ProductColor;
  brand: Brand;
  mode: "hero" | "viewer";
  label: string;
  className?: string;
}

/** Espera a que el navegador esté libre (con tope) para no competir con el primer render. */
function whenIdle(cb: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 300);
  return () => clearTimeout(id);
}

/**
 * Visor 3D con carga progresiva: primero se pinta la ilustración SVG (rápida
 * para el LCP); Three.js se descarga solo cuando el bloque es visible y el
 * hilo principal está libre. El render se pausa fuera del viewport.
 */
export function PhoneScene({ color, brand, mode, label, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });
  const reduce = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!inView || shouldLoad) return;
    return whenIdle(() => setShouldLoad(true));
  }, [inView, shouldLoad]);

  return (
    <div ref={ref} role="img" aria-label={label} className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 grid place-items-center p-10 transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-80",
        )}
      >
        <PhoneIllustration brand={brand} color={color} className="max-h-full" />
      </div>
      {shouldLoad && (
        <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          <PhoneCanvas
            color={color}
            brand={brand}
            mode={mode}
            active={inView}
            animate={!reduce}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
