import type { CSSProperties } from "react";
import type { Brand, ProductColor } from "@/lib/types";
import { cn } from "@/lib/cn";
import { CameraModule } from "./phone-illustration";

interface Props {
  brand: Brand;
  color: ProductColor;
  /** Ancho en px; alto y grosor se derivan de él. */
  width?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Teléfono 3D construido con CSS (6 caras con `preserve-3d`). No usa WebGL:
 * es muy ligero, nítido a cualquier escala y se anima solo con `transform`.
 * Rotarlo desde el contenedor padre (p. ej. `rotateY`).
 */
export function Phone3D({ brand, color, width = 220, className, style }: Props) {
  const w = width;
  const h = Math.round(width * 2.05);
  const d = Math.max(8, Math.round(width * 0.075));
  const r = Math.round(width * 0.17);

  const face = (fw: number, fh: number, transform: string): CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: fw,
    height: fh,
    marginLeft: -fw / 2,
    marginTop: -fh / 2,
    transform,
    backfaceVisibility: "hidden",
  });

  const edge = `linear-gradient(90deg, #000 0%, ${color.hex} 30%, #fff 50%, ${color.hex} 70%, #000 100%)`;
  const edgeV = `linear-gradient(180deg, #000 0%, ${color.hex} 30%, #fff 50%, ${color.hex} 70%, #000 100%)`;

  return (
    <div
      aria-hidden="true"
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={{ width: w, height: h, ...style }}
    >
      {/* Frente: pantalla */}
      <div style={{ ...face(w, h, `translateZ(${d / 2}px)`), borderRadius: r }} className="overflow-hidden bg-black p-[3%]">
        <div
          className="relative flex h-full flex-col items-center overflow-hidden"
          style={{
            borderRadius: r * 0.85,
            background: `linear-gradient(160deg, ${color.accent} 0%, #3b0764 55%, #020617 100%)`,
          }}
        >
          <div className="mt-[5%] h-[3.5%] w-[28%] rounded-full bg-black" />
          <p className="mt-[18%] font-semibold text-white" style={{ fontSize: w * 0.22 }}>
            9:41
          </p>
          <p className="text-white/80" style={{ fontSize: w * 0.055 }}>
            CelluStore
          </p>
          <div className="mt-auto mb-[12%] grid w-[80%] grid-cols-2 gap-[6%]">
            <div className="aspect-square rounded-[22%] bg-white/15" />
            <div className="aspect-square rounded-[22%] bg-white/15" />
          </div>
          {/* Reflejo de cristal */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.18)_45%,transparent_55%)]" />
        </div>
      </div>

      {/* Reverso: chasis y cámaras */}
      <div
        style={{
          ...face(w, h, `rotateY(180deg) translateZ(${d / 2}px)`),
          borderRadius: r,
          background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex} 55%, #000 140%)`,
        }}
        className="overflow-hidden ring-1 ring-white/20 ring-inset"
      >
        <svg viewBox="0 0 118 240" className="h-full w-full">
          <CameraModule brand={brand} />
        </svg>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgb(255_255_255/0.25)_45%,transparent_60%)]" />
      </div>

      {/* Laterales */}
      <div style={{ ...face(d, h - r * 2, `rotateY(90deg) translateZ(${w / 2}px)`), background: edgeV }} />
      <div style={{ ...face(d, h - r * 2, `rotateY(-90deg) translateZ(${w / 2}px)`), background: edgeV }} />
      <div style={{ ...face(w - r * 2, d, `rotateX(90deg) translateZ(${h / 2}px)`), background: edge }} />
      <div style={{ ...face(w - r * 2, d, `rotateX(-90deg) translateZ(${h / 2}px)`), background: edge }} />
    </div>
  );
}
