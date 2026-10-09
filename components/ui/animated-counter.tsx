"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface Props {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function formatValue(v: number, decimals: number, prefix: string, suffix: string): string {
  return `${prefix}${v.toFixed(decimals)}${suffix}`;
}

/** Número que cuenta hacia arriba al entrar en pantalla (escribe en el DOM sin re-renders). */
export function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = formatValue(value, decimals, prefix, suffix);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = formatValue(v, decimals, prefix, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatValue(value, decimals, prefix, suffix)}
    </span>
  );
}
