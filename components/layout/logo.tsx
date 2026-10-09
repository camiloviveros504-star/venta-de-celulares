import Link from "next/link";
import { Smartphone } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight" aria-label="CelluStore, ir al inicio">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-2 shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:rotate-12">
        <Smartphone className="size-5 text-white" aria-hidden="true" />
      </span>
      <span className="text-lg">
        Cellu<span className="text-brand-2">Store</span>
      </span>
    </Link>
  );
}
