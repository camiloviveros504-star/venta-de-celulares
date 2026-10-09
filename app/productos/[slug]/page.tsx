import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import type { ProductSpecs } from "@/lib/types";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchase } from "@/components/product/product-purchase";

const SPEC_LABELS: Record<keyof ProductSpecs, string> = {
  display: "Pantalla",
  chip: "Procesador",
  camera: "Cámaras",
  battery: "Batería",
  os: "Sistema operativo",
};

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return { title: product.name, description: `${product.tagline} ${product.description}` };
}

export default async function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <Container className="py-10">
      <nav aria-label="Ruta de navegación" className="mb-8">
        <ol className="flex items-center gap-1 text-sm text-muted">
          <li className="flex items-center gap-1">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
            <ChevronRight className="size-4" aria-hidden="true" />
          </li>
          <li className="flex items-center gap-1">
            <Link href="/productos" className="hover:text-foreground">
              Catálogo
            </Link>
            <ChevronRight className="size-4" aria-hidden="true" />
          </li>
          <li aria-current="page" className="truncate text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* `key` reinicia la selección de color/capacidad al cambiar de producto. */}
      <ProductPurchase key={product.id} product={product} />

      <section aria-labelledby="specs-title" className="mt-24">
        <Reveal>
          <h2 id="specs-title" className="mb-6 text-2xl font-semibold tracking-tight">
            Especificaciones técnicas
          </h2>
          <dl className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
            {(Object.keys(SPEC_LABELS) as (keyof ProductSpecs)[]).map((key) => (
              <div key={key} className="grid gap-1 px-6 py-4 sm:grid-cols-3">
                <dt className="text-sm text-muted">{SPEC_LABELS[key]}</dt>
                <dd className="font-medium sm:col-span-2">{product.specs[key]}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="mt-24">
        <SectionHeading eyebrow="También te puede gustar" title="Productos relacionados" />
        <ProductGrid products={related} />
      </section>
    </Container>
  );
}
