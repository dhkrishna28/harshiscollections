// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parent_id?: number | null;
  children?: Category[];
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface ProductImage {
  id: number;
  image_path: string;
  alt_text?: string;
  sort_order: number;
}

export interface SizeInventoryItem {
  size: string;
  stock_quantity: number;
  availability_status: 'in_stock' | 'out_of_stock';
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  // Descriptive attributes
  brand?: string;
  material?: string;
  craft_print_type?: string;
  style?: string;
  neckline?: string;
  // Rich-text sections
  description?: string;
  short_description?: string;
  specifications?: string;
  wash_care?: string;
  shipping_info?: string;
  ideal_for?: string;
  // Sizes
  sizes?: string[];
  size_inventory?: SizeInventoryItem[];
  // Identifiers / Pricing
  sku?: string;
  price: number;                          // selling price
  compare_at_price?: number | null;       // MRP / crossed-out price
  availability_status?: 'in_stock' | 'out_of_stock';
  stock_quantity: number;
  status?: 'draft' | 'published';
  is_featured: boolean;
  category?: Category;
  images?: ProductImage[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  selected_size?: string | null;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  selected_size?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Pick<Product, 'id' | 'name' | 'images'>;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  subtotal: number;
  shipping_charge: number;
  discount: number;
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal: string;
  shipping_country: string;
  items?: OrderItem[];
  created_at: string;
}

// ─── CMS ──────────────────────────────────────────────────────────────────────
export type CmsPageKey = 'about_us' | 'faq' | 'privacy_policy' | 'terms_conditions';

export interface CmsPage {
  id: number;
  page_key: CmsPageKey;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  pages?: number;
  data: T[];
}
