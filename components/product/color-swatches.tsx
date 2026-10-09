"use client";

import { useId } from "react";
import { m } from "motion/react";
import type { ProductColor } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  colors: readonly ProductColor[];
  value: ProductColor;
  onChange: (color: ProductColor) => void;
  size?: "sm" | "md";
  label?: string;
}

/** Selector de color accesible basado en radios nativos. */
export function ColorSwatches({ colors, value, onChange, size = "md", label = "Color" }: Props) {
  const name = useId();
  const dim = size === "sm" ? "size-7" : "size-10";

  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="flex gap-3">
        {colors.map((c) => {
          const checked = c.name === value.name;
          return (
            <label key={c.name} className={cn("relative grid cursor-pointer place-items-center rounded-full", dim)} title={c.name}>
              <input
                type="radio"
                name={name}
                value={c.name}
                checked={checked}
                onChange={() => onChange(c)}
                className="peer sr-only"
              />
              <span className="sr-only">{c.name}</span>
              {checked && (
                <m.span
                  layoutId={`${name}-ring`}
                  className="absolute -inset-1 rounded-full ring-2 ring-brand-2"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                aria-hidden="true"
                className="size-full rounded-full ring-1 ring-white/25 transition-transform peer-hover:scale-110 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-2"
                style={{ background: `linear-gradient(135deg, ${c.hex}, ${c.accent})` }}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
