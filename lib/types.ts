export type Brand = "Apple" | "Samsung" | "Google" | "Xiaomi" | "Motorola" | "OnePlus";

export interface ProductColor {
  name: string;
  /** Color principal del chasis (hex). */
  hex: string;
  /** Color secundario para degradados de pantalla (hex). */
  accent: string;
}

export interface ProductSpecs {
  display: string;
  chip: string;
  camera: string;
  battery: string;
  os: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  tagline: string;
  description: string;
  /** Precio base en COP para la menor capacidad. */
  price: number;
  /** Precio anterior, si el producto está en oferta. */
  compareAtPrice?: number;
  /** Capacidades disponibles en GB. */
  storage: readonly number[];
  colors: readonly ProductColor[];
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  featured?: boolean;
  specs: ProductSpecs;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export interface ProductFilters {
  query: string;
  brands: Brand[];
  storage: number[];
  maxPrice: number;
  onlyDeals: boolean;
  sort: SortOption;
}

export interface CartItem {
  /** Clave única: producto + color + capacidad. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  color: ProductColor;
  storage: number;
  unitPrice: number;
  quantity: number;
}
