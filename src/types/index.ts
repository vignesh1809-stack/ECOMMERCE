export interface ProductSize {
  size: string;
  inStock: boolean;
  chestCm: number;
  lengthCm: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  previewImage?: string;
}

export interface ProductFabric {
  name: string;
  composition: string;
  weight: string;
  origin: string;
  sustainabilityCert: string;
}

export interface ProductFit {
  cut: 'Slim' | 'Regular' | 'Relaxed' | 'Oversized' | 'Relaxed Tailored' | 'Relaxed Classic' | 'Relaxed Tapered' | 'Relaxed Wide-Taper' | string;
  runsSmallOrLarge: 'Runs Small' | 'True to Size' | 'Runs Large';
  modelWearing: string;
}

export interface RatingMetrics {
  softness: number;
  fitAccuracy: number;
  durability: number;
  styleVersatility: number;
  valueForMoney: number;
  finishQuality: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  purchasedSize: string;
  purchasedColor: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  atelierLocation?: string;
  category: string;
  occasion?: string;
  gender: 'men' | 'women' | 'unisex';
  description: string;
  highlightSummary: string;
  price: number;
  originalPrice?: number;
  isGuestFavorite?: boolean;
  isRareFind?: boolean;
  isSustainable?: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  fabric: ProductFabric;
  fit: ProductFit;
  ratingMetrics: RatingMetrics;
  reviews: Review[];
  inStock?: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  occasion: string;
  gender: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sustainableOnly: boolean;
  guestFavoriteOnly: boolean;
  inStockOnly: boolean;
  sortBy: 'recommended' | 'rating' | 'price-asc' | 'price-desc' | 'newest';
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface OrderShippingAddress {
  fullName: string;
  email: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: OrderShippingAddress;
  deliveryEstimate: string;
  paymentMethod: string;
  status: 'confirmed' | 'tailoring' | 'shipped' | 'delivered';
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'cart';
  productImage?: string;
}
