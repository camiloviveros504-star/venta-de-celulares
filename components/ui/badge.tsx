import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Tone = "brand" | "success" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand/15 text-violet-300 ring-brand/30",
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  neutral: "bg-white/5 text-muted ring-white/10",
};

export function Badge({ tone = "neutral", className, ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
