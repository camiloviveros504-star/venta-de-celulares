"use client";

import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados. */
  max?: number;
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.5 };

/**
 * Contenedor con inclinación 3D, brillo que sigue al puntero y reflejo
 * especular. Los hijos pueden usar `translateZ` (p. ej. `[transform:translateZ(60px)]`)
 * para obtener parallax de profundidad. Solo reacciona al mouse.
 */
export function TiltCard({ children, className, max = 10 }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), SPRING);
  const px = useTransform(x, (v) => `${v * 100}%`);
  const py = useTransform(y, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${px} ${py}, rgb(139 92 246 / 0.22), transparent 50%)`;
  const sheen = useMotionTemplate`linear-gradient(105deg, transparent 30%, rgb(255 255 255 / 0.10) ${px}, transparent 70%)`;

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div className="h-full [perspective:1000px]">
      <m.div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={reduce ? undefined : { rotateX, rotateY }}
        className={cn("group relative h-full [transform-style:preserve-3d] will-change-transform", className)}
      >
        {children}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: sheen }}
        />
      </m.div>
    </div>
  );
}
