import type { Brand, Product, ProductFilters } from "./types";

/**
 * Catálogo de ejemplo. En producción, sustituir por una fuente de datos
 * (CMS, base de datos o API) manteniendo la misma interfaz de funciones.
 */
const PRODUCTS: readonly Product[] = [
  {
    id: "p-001",
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    tagline: "Titanio. Potencia sin límites.",
    description:
      "Chasis de titanio, pantalla ProMotion de 120 Hz y un sistema de cámaras profesional que captura video 4K a 120 fps.",
    price: 5_899_000,
    storage: [256, 512, 1024],
    colors: [
      { name: "Titanio natural", hex: "#b9b2a6", accent: "#f5d0a9" },
      { name: "Azul cósmico", hex: "#3b4a63", accent: "#60a5fa" },
      { name: "Negro espacial", hex: "#2b2b2e", accent: "#a78bfa" },
    ],
    rating: 4.9,
    reviews: 1284,
    stock: 18,
    isNew: true,
    featured: true,
    specs: {
      display: '6.3" Super Retina XDR OLED, 120 Hz',
      chip: "A19 Pro",
      camera: "48 MP + 48 MP UltraWide + 48 MP Tele 5x",
      battery: "Hasta 30 h de video",
      os: "iOS 26",
    },
  },
  {
    id: "p-002",
    slug: "iphone-17",
    name: "iPhone 17",
    brand: "Apple",
    tagline: "Colorido. Brillante. Tuyo.",
    description:
      "El equilibrio perfecto entre diseño y rendimiento, con pantalla de 120 Hz y cámara dual de 48 MP.",
    price: 4_299_000,
    compareAtPrice: 4_599_000,
    storage: [128, 256, 512],
    colors: [
      { name: "Lavanda", hex: "#c4b5fd", accent: "#f0abfc" },
      { name: "Salvia", hex: "#a7c4a0", accent: "#86efac" },
      { name: "Blanco", hex: "#ececec", accent: "#7dd3fc" },
    ],
    rating: 4.7,
    reviews: 982,
    stock: 32,
    specs: {
      display: '6.3" Super Retina XDR OLED, 120 Hz',
      chip: "A19",
      camera: "48 MP Fusion + 48 MP UltraWide",
      battery: "Hasta 26 h de video",
      os: "iOS 26",
    },
  },
  {
    id: "p-003",
    slug: "galaxy-s26-ultra",
    name: "Galaxy S26 Ultra",
    brand: "Samsung",
    tagline: "La IA más avanzada en tu mano.",
    description:
      "S Pen integrado, cámara de 200 MP con zoom espacial 100x y Galaxy AI para traducir, editar y crear al instante.",
    price: 6_199_000,
    storage: [256, 512, 1024],
    colors: [
      { name: "Titanio gris", hex: "#6b6e73", accent: "#93c5fd" },
      { name: "Titanio violeta", hex: "#7c6b8f", accent: "#e879f9" },
      { name: "Titanio negro", hex: "#1f2023", accent: "#38bdf8" },
    ],
    rating: 4.8,
    reviews: 1102,
    stock: 12,
    isNew: true,
    featured: true,
    specs: {
      display: '6.9" Dynamic AMOLED 2X, 120 Hz',
      chip: "Snapdragon 8 Elite Gen 2",
      camera: "200 MP + 50 MP + 50 MP Tele 5x + 10 MP",
      battery: "5000 mAh, carga 45 W",
      os: "Android 16 · One UI 8",
    },
  },
  {
    id: "p-004",
    slug: "galaxy-s26",
    name: "Galaxy S26",
    brand: "Samsung",
    tagline: "Compacto. Inteligente. Imparable.",
    description:
      "Todo el poder de Galaxy AI en un diseño compacto con pantalla Dynamic AMOLED y batería para todo el día.",
    price: 3_899_000,
    compareAtPrice: 4_299_000,
    storage: [128, 256, 512],
    colors: [
      { name: "Menta", hex: "#9fd8c4", accent: "#5eead4" },
      { name: "Crema", hex: "#e9e0cf", accent: "#fcd34d" },
      { name: "Grafito", hex: "#3a3c40", accent: "#818cf8" },
    ],
    rating: 4.6,
    reviews: 740,
    stock: 40,
    specs: {
      display: '6.2" Dynamic AMOLED 2X, 120 Hz',
      chip: "Exynos 2600",
      camera: "50 MP + 12 MP + 10 MP Tele 3x",
      battery: "4000 mAh, carga 25 W",
      os: "Android 16 · One UI 8",
    },
  },
  {
    id: "p-005",
    slug: "galaxy-z-flip-7",
    name: "Galaxy Z Flip7",
    brand: "Samsung",
    tagline: "Dóblalo. Exprésate.",
    description:
      "Plegable icónico con pantalla externa FlexWindow a borde completo y cámara para selfies sin manos.",
    price: 4_999_000,
    storage: [256, 512],
    colors: [
      { name: "Coral", hex: "#f28b82", accent: "#fda4af" },
      { name: "Azul hielo", hex: "#a5c8e4", accent: "#67e8f9" },
    ],
    rating: 4.5,
    reviews: 412,
    stock: 9,
    isNew: true,
    specs: {
      display: '6.9" plegable + 4.1" externa',
      chip: "Exynos 2500",
      camera: "50 MP + 12 MP UltraWide",
      battery: "4300 mAh",
      os: "Android 16 · One UI 8",
    },
  },
  {
    id: "p-006",
    slug: "pixel-10-pro",
    name: "Pixel 10 Pro",
    brand: "Google",
    tagline: "La magia de Google, en tu bolsillo.",
    description:
      "Fotografía computacional líder con Gemini integrado, 7 años de actualizaciones y chip Tensor G5.",
    price: 4_799_000,
    storage: [128, 256, 512],
    colors: [
      { name: "Porcelana", hex: "#e8e3da", accent: "#fbbf24" },
      { name: "Obsidiana", hex: "#25272b", accent: "#34d399" },
      { name: "Musgo", hex: "#6e7d64", accent: "#a3e635" },
    ],
    rating: 4.7,
    reviews: 655,
    stock: 21,
    featured: true,
    specs: {
      display: '6.3" LTPO OLED Super Actua, 120 Hz',
      chip: "Google Tensor G5",
      camera: "50 MP + 48 MP UltraWide + 48 MP Tele 5x",
      battery: "4870 mAh, carga 30 W",
      os: "Android 16",
    },
  },
  {
    id: "p-007",
    slug: "pixel-10",
    name: "Pixel 10",
    brand: "Google",
    tagline: "Inteligente desde el primer día.",
    description:
      "Gemini en cada rincón, cámara triple con teleobjetivo y un diseño suave al tacto en colores vibrantes.",
    price: 3_299_000,
    compareAtPrice: 3_599_000,
    storage: [128, 256],
    colors: [
      { name: "Índigo", hex: "#4f5bd5", accent: "#a5b4fc" },
      { name: "Limón", hex: "#e4e98a", accent: "#facc15" },
    ],
    rating: 4.5,
    reviews: 389,
    stock: 27,
    specs: {
      display: '6.3" Actua OLED, 120 Hz',
      chip: "Google Tensor G5",
      camera: "48 MP + 13 MP UltraWide + 10.8 MP Tele 5x",
      battery: "4970 mAh",
      os: "Android 16",
    },
  },
  {
    id: "p-008",
    slug: "xiaomi-15-ultra",
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    tagline: "Óptica Leica. Pasión fotográfica.",
    description:
      "Cuatro cámaras co-diseñadas con Leica, sensor de 1 pulgada y un diseño inspirado en las cámaras clásicas.",
    price: 4_599_000,
    storage: [512, 1024],
    colors: [
      { name: "Plata cromo", hex: "#c9ccd1", accent: "#f87171" },
      { name: "Negro", hex: "#1c1c1e", accent: "#fb923c" },
    ],
    rating: 4.6,
    reviews: 318,
    stock: 14,
    featured: true,
    specs: {
      display: '6.73" AMOLED LTPO, 120 Hz',
      chip: "Snapdragon 8 Elite",
      camera: "50 MP 1\" + 50 MP + 50 MP + 200 MP Tele",
      battery: "5410 mAh, carga 90 W",
      os: "Android 15 · HyperOS 2",
    },
  },
  {
    id: "p-009",
    slug: "redmi-note-15-pro",
    name: "Redmi Note 15 Pro",
    brand: "Xiaomi",
    tagline: "Rendimiento pro a precio justo.",
    description:
      "Cámara de 200 MP, carga turbo de 120 W y pantalla AMOLED con resistencia IP68 para el día a día.",
    price: 1_499_000,
    compareAtPrice: 1_799_000,
    storage: [256, 512],
    colors: [
      { name: "Púrpura aurora", hex: "#8b5cf6", accent: "#f0abfc" },
      { name: "Negro medianoche", hex: "#22232a", accent: "#22d3ee" },
    ],
    rating: 4.4,
    reviews: 1520,
    stock: 60,
    specs: {
      display: '6.67" AMOLED, 120 Hz',
      chip: "MediaTek Dimensity 7300 Ultra",
      camera: "200 MP + 8 MP + 2 MP",
      battery: "5110 mAh, carga 120 W",
      os: "Android 15 · HyperOS 2",
    },
  },
  {
    id: "p-010",
    slug: "motorola-edge-60-pro",
    name: "Motorola Edge 60 Pro",
    brand: "Motorola",
    tagline: "Curvas perfectas. Colores Pantone.",
    description:
      "Pantalla curva pOLED de 6.7\", acabados validados por Pantone y cámaras con IA moto ai.",
    price: 2_199_000,
    compareAtPrice: 2_499_000,
    storage: [256, 512],
    colors: [
      { name: "Azul shadow", hex: "#2f4a6d", accent: "#38bdf8" },
      { name: "Uva", hex: "#6d3b6e", accent: "#f472b6" },
    ],
    rating: 4.3,
    reviews: 276,
    stock: 25,
    specs: {
      display: '6.7" pOLED curva, 120 Hz',
      chip: "MediaTek Dimensity 8350",
      camera: "50 MP + 50 MP + 10 MP Tele 3x",
      battery: "6000 mAh, carga 90 W",
      os: "Android 15",
    },
  },
  {
    id: "p-011",
    slug: "motorola-razr-60",
    name: "Motorola razr 60",
    brand: "Motorola",
    tagline: "El ícono que se dobla.",
    description:
      "El clásico plegable reinventado con bisagra sin espacios y pantalla externa para usar apps sin abrirlo.",
    price: 2_899_000,
    storage: [256],
    colors: [
      { name: "Verde menta", hex: "#7fc8a9", accent: "#4ade80" },
      { name: "Rosa", hex: "#e8a0b4", accent: "#fb7185" },
    ],
    rating: 4.2,
    reviews: 198,
    stock: 7,
    isNew: true,
    specs: {
      display: '6.9" pOLED plegable + 3.6" externa',
      chip: "MediaTek Dimensity 7400X",
      camera: "50 MP + 13 MP UltraWide",
      battery: "4500 mAh, carga 30 W",
      os: "Android 15",
    },
  },
  {
    id: "p-012",
    slug: "oneplus-13",
    name: "OnePlus 13",
    brand: "OnePlus",
    tagline: "Rápido. Fluido. Sin compromisos.",
    description:
      "Cámaras Hasselblad, batería de 6000 mAh con carga de 100 W y la fluidez característica de OxygenOS.",
    price: 3_699_000,
    storage: [256, 512],
    colors: [
      { name: "Azul medianoche", hex: "#1e2a4a", accent: "#60a5fa" },
      { name: "Blanco perla", hex: "#f1efe9", accent: "#fda4af" },
    ],
    rating: 4.6,
    reviews: 503,
    stock: 19,
    specs: {
      display: '6.82" LTPO AMOLED, 120 Hz',
      chip: "Snapdragon 8 Elite",
      camera: "50 MP + 50 MP + 50 MP Tele 3x · Hasselblad",
      battery: "6000 mAh, carga 100 W",
      os: "Android 15 · OxygenOS 15",
    },
  },
];

/** Incremento de precio por cada salto de capacidad respecto a la base. */
const STORAGE_STEP_PRICE = 600_000;

export const BRANDS: readonly Brand[] = ["Apple", "Samsung", "Google", "Xiaomi", "Motorola", "OnePlus"];

export const STORAGE_OPTIONS: readonly number[] = Array.from(
  new Set(PRODUCTS.flatMap((p) => p.storage)),
).sort((a, b) => a - b);

export const MAX_PRICE: number = Math.max(...PRODUCTS.map((p) => p.price));

export function getAllProducts(): readonly Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): readonly Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4): readonly Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.brand === product.brand) - Number(a.brand === product.brand))
    .slice(0, limit);
}

export function priceForStorage(product: Product, storage: number): number {
  const index = Math.max(0, product.storage.indexOf(storage));
  return product.price + index * STORAGE_STEP_PRICE;
}

export const DEFAULT_FILTERS: ProductFilters = {
  query: "",
  brands: [],
  storage: [],
  maxPrice: MAX_PRICE,
  onlyDeals: false,
  sort: "featured",
};

export function filterProducts(products: readonly Product[], filters: ProductFilters): Product[] {
  const query = filters.query.trim().toLowerCase();

  const result = products.filter((p) => {
    if (query && !`${p.name} ${p.brand} ${p.tagline}`.toLowerCase().includes(query)) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.storage.length > 0 && !p.storage.some((s) => filters.storage.includes(s))) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.onlyDeals && !p.compareAtPrice) return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return result.sort((a, b) => a.price - b.price);
    case "price-desc":
      return result.sort((a, b) => b.price - a.price);
    case "rating":
      return result.sort((a, b) => b.rating - a.rating);
    case "newest":
      return result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    case "featured":
    default:
      return result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
}
