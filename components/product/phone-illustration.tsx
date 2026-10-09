import { useId } from "react";
import type { Brand, ProductColor } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  brand: Brand;
  color: ProductColor;
  className?: string;
  /** Texto alternativo; si se omite, la ilustración se trata como decorativa. */
  label?: string;
}

/**
 * Render vectorial ligero del teléfono (frente + reverso). Evita depender de
 * imágenes externas y se adapta al color seleccionado.
 */
export function PhoneIllustration({ brand, color, className, label }: Props) {
  const id = useId().replace(/:/g, "");
  const body = `${id}-body`;
  const screen = `${id}-screen`;
  const shine = `${id}-shine`;

  return (
    <svg
      viewBox="0 0 240 300"
      className={cn("h-full w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.hex} />
          <stop offset="55%" stopColor={color.hex} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={screen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.accent} />
          <stop offset="50%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id={shine} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Frente: pantalla */}
      <g transform="translate(28 22) rotate(-8 60 125)">
        <rect width="118" height="240" rx="22" fill="#0b0b10" stroke={color.hex} strokeWidth="3" />
        <rect x="6" y="6" width="106" height="228" rx="17" fill={`url(#${screen})`} />
        <rect x="44" y="13" width="30" height="9" rx="4.5" fill="#000" />
        <text x="59" y="72" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="600" fontFamily="system-ui">
          9:41
        </text>
        <rect x="18" y="190" width="82" height="22" rx="11" fill="#fff" fillOpacity="0.15" />
      </g>

      {/* Reverso: chasis y módulo de cámara */}
      <g transform="translate(96 40) rotate(6 60 125)">
        <rect width="118" height="240" rx="22" fill={`url(#${body})`} stroke="#fff" strokeOpacity="0.2" />
        <rect x="-20" y="0" width="40" height="240" fill={`url(#${shine})`} opacity="0.5" transform="skewX(-12)" />
        <CameraModule brand={brand} />
      </g>
    </svg>
  );
}

function Lens({ cx, cy, r = 11 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#111" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#1e293b" />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.18} fill="#fff" fillOpacity="0.6" />
    </g>
  );
}

export function CameraModule({ brand }: { brand: Brand }) {
  switch (brand) {
    case "Apple":
      return (
        <g>
          <rect x="10" y="10" width="62" height="62" rx="16" fill="#000" fillOpacity="0.25" stroke="#fff" strokeOpacity="0.2" />
          <Lens cx={27} cy={27} />
          <Lens cx={27} cy={55} />
          <Lens cx={55} cy={41} />
        </g>
      );
    case "Samsung":
      return (
        <g>
          <Lens cx={24} cy={26} />
          <Lens cx={24} cy={54} />
          <Lens cx={24} cy={82} />
          <circle cx={46} cy={26} r={4} fill="#fde68a" fillOpacity="0.7" />
        </g>
      );
    case "Google":
      return (
        <g>
          <rect x="-2" y="30" width="122" height="34" rx="17" fill="#000" fillOpacity="0.55" />
          <Lens cx={26} cy={47} r={10} />
          <Lens cx={52} cy={47} r={10} />
          <Lens cx={78} cy={47} r={10} />
        </g>
      );
    case "Xiaomi":
      return (
        <g>
          <circle cx={59} cy={58} r={42} fill="#000" fillOpacity="0.35" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" />
          <Lens cx={42} cy={42} />
          <Lens cx={76} cy={42} />
          <Lens cx={42} cy={74} />
          <Lens cx={76} cy={74} />
        </g>
      );
    default:
      return (
        <g>
          <rect x="10" y="10" width="48" height="76" rx="14" fill="#000" fillOpacity="0.3" />
          <Lens cx={34} cy={30} />
          <Lens cx={34} cy={62} />
        </g>
      );
  }
}
