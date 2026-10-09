import { ArrowRight } from "lucide-react";
import { getAllProducts, getFeaturedProducts, getProductBySlug } from "@/lib/products";
import { Hero } from "@/components/home/hero";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { Showcase } from "@/components/home/showcase";
import { Carousel3D } from "@/components/home/carousel-3d";
import { Features } from "@/components/home/features";
import { PromoBanner } from "@/components/home/promo-banner";
import { ProductGrid } from "@/components/product/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export default function Home() {
  const featured = getFeaturedProducts();
  const [heroProduct] = featured;
  const showcaseProduct = getProductBySlug("galaxy-s26-ultra") ?? heroProduct;

  return (
    <>
      <Hero product={heroProduct} />
      <BrandMarquee />

      <section id="destacados" className="scroll-mt-24 py-24">
        <Container>
          <SectionHeading
            eyebrow="Destacados"
            title="Los favoritos de la temporada"
            description="Seleccionados por rendimiento, cámara y diseño. Pasa el cursor sobre ellos para verlos en 3D."
            action={
              <ButtonLink href="/productos" variant="secondary">
                Ver todos <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            }
          />
          <ProductGrid products={featured} />
        </Container>
      </section>

      <Showcase product={showcaseProduct} />

      <section aria-labelledby="carousel-title" className="overflow-hidden py-24">
        <Container>
          <SectionHeading
            eyebrow="Explora en 360°"
            title={<span id="carousel-title">Toda la colección, girando para ti</span>}
            description="Arrástralo, usa las flechas o navega con el teclado."
          />
        </Container>
        <Carousel3D products={getAllProducts()} />
      </section>

      <PromoBanner />
      <Features product={heroProduct} />
    </>
  );
}
