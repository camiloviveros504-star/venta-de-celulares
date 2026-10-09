import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Catálogo de celulares",
  description: "Explora y filtra celulares por marca, precio, almacenamiento y ofertas.",
};

export default function ProductsPage() {
  const products = getAllProducts();
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Catálogo"
        title="Encuentra tu celular ideal"
        description={`${products.length} modelos de las mejores marcas, con envío gratis y garantía oficial.`}
      />
      <CatalogView products={products} />
    </Container>
  );
}
