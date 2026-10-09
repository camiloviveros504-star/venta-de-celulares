"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { selectCount, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { NAV_LINKS } from "./nav-links";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.open);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled || menuOpen ? "border-border bg-background/75 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive(link.href) ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {isActive(link.href) && (
                    <m.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-white/5 transition-colors hover:bg-white/10"
            aria-label={`Abrir carrito${hydrated && count > 0 ? `, ${count} productos` : ""}`}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            <AnimatePresence>
              {hydrated && count > 0 && (
                <m.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-brand-2 px-1 text-[11px] font-bold text-black"
                  aria-hidden="true"
                >
                  {count}
                </m.span>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-white/5 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <m.nav
            id="mobile-menu"
            aria-label="Móvil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <Container className="pb-4">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <m.li key={link.href} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base text-muted hover:bg-white/5 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </m.li>
                ))}
              </ul>
            </Container>
          </m.nav>
        )}
      </AnimatePresence>

      <m.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-brand to-brand-2"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
