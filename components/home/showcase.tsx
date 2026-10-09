"use client";

import { useRef } from "react";
import { m, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { BatteryCharging, Camera, Cpu, MonitorSmartphone, type LucideIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";
import { Phone3D } from "@/components/product/phone-3d";

interface Callout {
  icon: LucideIcon;
  title: string;
  value: string;
  side: "left" | "right";
  range: [number, number];
}

function CalloutCard({ callout, progress }: { callout: Callout; progress: MotionValue<number> }) {
  const [start, end] = callout.range;
  const fadeIn = start + (end - start) * 0.2;
  const fadeOut = end - (end - start) * 0.2;
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const offset = callout.side === "left" ? -60 : 60;
  const x = useTransform(progress, [start, fadeIn, fadeOut, end], [offset, 0, 0, -offset]);
  const Icon = callout.icon;

  return (
    <m.div
      style={{ opacity, x }}
      className={`absolute bottom-24 left-1/2 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:translate-x-0 ${
        callout.side === "left" ? "md:left-[6%]" : "md:right-[6%] md:left-auto"
      }`}
    >
      <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-2">
          <Icon className="size-5 text-white" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold tracking-widest text-brand-2 uppercase">{callout.title}</p>
        <p className="mt-2 text-xl font-semibold text-balance">{callout.value}</p>
      </div>
    </m.div>
  );
}

/**
 * Sección "pegajosa" estilo página de producto: el teléfono 3D (CSS) gira con
 * el scroll mientras aparecen sus características.
 */
export function Showcase({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });

  const rotateY = useTransform(progress, [0, 1], [-30, 510]);
  const rotateX = useTransform(progress, [0, 0.5, 1], [18, -6, 12]);
  const scale = useTransform(progress, [0, 0.12, 0.88, 1], [0.75, 1, 1, 0.85]);
  const titleX = useTransform(progress, [0, 1], ["10%", "-40%"]);
  const glow = useTransform(progress, [0, 0.5, 1], [0.2, 0.55, 0.2]);
  const ctaOpacity = useTransform(progress, [0.9, 1], [0, 1]);
  const color = product.colors[1] ?? product.colors[0];

  const callouts: Callout[] = [
    { icon: MonitorSmartphone, title: "Pantalla", value: product.specs.display, side: "left", range: [0.02, 0.27] },
    { icon: Cpu, title: "Procesador", value: product.specs.chip, side: "right", range: [0.25, 0.5] },
    { icon: Camera, title: "Cámaras", value: product.specs.camera, side: "left", range: [0.48, 0.73] },
    { icon: BatteryCharging, title: "Batería", value: product.specs.battery, side: "right", range: [0.71, 0.98] },
  ];

  return (
    <section ref={ref} aria-labelledby="showcase-title" className="relative h-[400vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <h2 id="showcase-title" className="sr-only">
          {product.name} en detalle
        </h2>

        {/* Texto gigante con parallax */}
        <m.p
          aria-hidden="true"
          style={{ x: titleX }}
          className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[22vw] leading-none font-bold tracking-tighter whitespace-nowrap text-white/[0.04]"
        >
          {product.name}
        </m.p>

        <m.div
          aria-hidden="true"
          style={{ opacity: glow, background: color.accent }}
          className="absolute size-[30rem] rounded-full blur-[140px]"
        />

        <div className="[perspective:1400px]">
          <m.div style={{ rotateY, rotateX, scale }} className="[transform-style:preserve-3d]">
            <Phone3D brand={product.brand} color={color} width={210} className="-translate-y-16 scale-[0.6] sm:translate-y-0 sm:scale-100" />
          </m.div>
        </div>

        {callouts.map((c) => (
          <CalloutCard key={c.title} callout={c} progress={progress} />
        ))}

        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm font-semibold tracking-widest text-brand-2 uppercase">En detalle</p>
          <p className="mt-1 text-2xl font-semibold sm:text-3xl">{product.name}</p>
        </div>

        <m.div style={{ opacity: ctaOpacity }} className="absolute bottom-10">
          <ButtonLink href={`/productos/${product.slug}`} size="lg">
            Descubrir {product.name}
          </ButtonLink>
        </m.div>
      </div>
    </section>
  );
}
