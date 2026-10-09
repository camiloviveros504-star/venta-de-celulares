"use client";

import { useRef, useState, type PointerEvent } from "react";
import { m, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Camera, Cpu, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { PhoneScene } from "@/components/three/phone-scene";
import { ColorSwatches } from "@/components/product/color-swatches";

const HEADLINE: readonly { word: string; accent?: boolean }[] = [
  { word: "El" },
  { word: "futuro" },
  { word: "cabe" },
  { word: "en" },
  { word: "tu", accent: true },
  { word: "mano.", accent: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const [color, setColor] = useState(product.colors[0]);

  // Parallax por scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Parallax por puntero (capas a distinta profundidad).
  const px = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const nearX = useTransform(px, (v) => v * 30);
  const nearY = useTransform(py, (v) => v * 30);
  const farX = useTransform(px, (v) => v * -14);
  const farY = useTransform(py, (v) => v * -14);

  function handlePointer(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  }

  const chips = [
    { icon: Cpu, label: product.specs.chip, className: "top-[14%] -left-2 sm:left-0", depth: "near" as const, delay: "0s" },
    { icon: Camera, label: "48 MP Pro", className: "top-[42%] -right-2 sm:right-2", depth: "far" as const, delay: "-2s" },
    { icon: Zap, label: "5G ultrarrápido", className: "bottom-[24%] left-2 sm:left-8", depth: "near" as const, delay: "-4s" },
  ];

  return (
    <section
      ref={ref}
      onPointerMove={handlePointer}
      className="relative isolate -mt-16 overflow-hidden pt-16"
      aria-labelledby="hero-title"
    >
      {/* Auroras */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <m.div
          className="animate-aurora absolute -top-40 left-1/4 size-[38rem] rounded-full opacity-30 blur-[120px]"
          animate={{ backgroundColor: color.accent }}
          transition={{ duration: 0.8 }}
        />
        <div className="animate-aurora absolute top-1/3 -right-40 size-[30rem] rounded-full bg-brand opacity-20 blur-[120px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute -bottom-20 -left-40 size-[26rem] rounded-full bg-brand-2 opacity-15 blur-[120px] [animation-delay:-12s]" />
      </div>

      {/* Suelo 3D en perspectiva */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[55%] [perspective:600px]">
        <div className="absolute inset-x-[-50%] top-0 h-[200%] origin-top overflow-hidden [transform:rotateX(65deg)] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]">
          <div className="bg-grid animate-floor absolute inset-x-0 -top-12 bottom-0 will-change-transform" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr]">
        <m.div style={{ y: textY, opacity: fade }} className="relative z-10 text-center lg:text-left">
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-1.5 text-sm text-muted backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-2 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-2" />
            </span>
            Nuevo {product.name} ya disponible
          </m.p>

          <h1 id="hero-title" className="text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl xl:text-7xl">
            {HEADLINE.map(({ word, accent }, i) => (
              <span key={word} className="inline-block overflow-hidden pb-2 align-bottom">
                <m.span
                  className={`inline-block ${accent ? "text-gradient animate-shimmer" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.8, ease: EASE }}
                >
                  {word}&nbsp;
                </m.span>
              </span>
            ))}
          </h1>

          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted text-pretty lg:mx-0"
          >
            Descubre los celulares más potentes del mercado. Gíralos en 3D, compáralos y llévatelos con envío gratis y
            garantía oficial.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Magnetic>
              <ButtonLink href="/productos" size="lg">
                Ver catálogo <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <ButtonLink href={`/productos/${product.slug}`} variant="secondary" size="lg">
                {product.name} · {formatPrice(product.price)}
              </ButtonLink>
            </Magnetic>
          </m.div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8 text-center lg:text-left">
            <div>
              <dt className="text-xs text-muted sm:text-sm">Modelos</dt>
              <dd className="text-2xl font-semibold sm:text-3xl">
                <AnimatedCounter value={12} suffix="+" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted sm:text-sm">Calificación</dt>
              <dd className="text-2xl font-semibold sm:text-3xl">
                <AnimatedCounter value={4.8} decimals={1} suffix="★" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted sm:text-sm">Envío</dt>
              <dd className="text-2xl font-semibold sm:text-3xl">
                <AnimatedCounter value={24} suffix="h" />
              </dd>
            </div>
          </dl>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted lg:justify-start">
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-brand-2" aria-hidden="true" /> Envío gratis
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-2" aria-hidden="true" /> Garantía oficial
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-2" aria-hidden="true" /> Hasta 12 cuotas sin interés
            </li>
          </ul>
        </m.div>

        <m.div style={{ y: sceneY }} className="relative flex flex-col items-center">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="relative w-full max-w-xl"
          >
            <PhoneScene
              color={color}
              brand={product.brand}
              mode="hero"
              label={`Modelo 3D interactivo del ${product.name} en color ${color.name}`}
              className="aspect-square w-full"
            />

            {/* Chips flotantes con parallax según la profundidad */}
            {chips.map(({ icon: Icon, label, className, depth, delay }) => (
              <m.div
                key={label}
                aria-hidden="true"
                style={depth === "near" ? { x: nearX, y: nearY } : { x: farX, y: farY }}
                className={`pointer-events-none absolute ${className}`}
              >
                <div
                  className="animate-float flex items-center gap-2 rounded-2xl border border-white/10 bg-surface/70 px-3 py-2 text-xs font-medium shadow-xl shadow-black/40 backdrop-blur-md sm:text-sm"
                  style={{ animationDelay: delay }}
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-2">
                    <Icon className="size-4 text-white" />
                  </span>
                  {label}
                </div>
              </m.div>
            ))}
          </m.div>

          <div className="-mt-2 flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface/70 px-5 py-3 backdrop-blur">
            <ColorSwatches colors={product.colors} value={color} onChange={setColor} size="sm" />
            <p className="text-xs text-muted" aria-live="polite">
              {color.name} · Mueve el cursor para girarlo
            </p>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
