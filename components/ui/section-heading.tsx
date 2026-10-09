import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: Props) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold tracking-widest text-brand-2 uppercase">{eyebrow}</p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-muted text-pretty">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
