// Bulk Order Types
export interface BulkOrder {
  _id: string;
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items?: BulkOrderItem[];
}

export interface BulkOrderItem {
  id?: string;
  bulkOrderId?: string;
  productId: string;
  quantity: number;
  price: number; // unit price
  subtotal: number;
  sku?: string;
  productName?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  rating?: number;
  reviews?: number;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface CartItem {
  productId: string;
  quantity?: number;
  variant?: any;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  position: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

export interface SiteLink {
  id: string;
  name: string;
  url: string;
  category: string;
  position: number;
  isActive: boolean;
}

export interface SiteLogo {
  id: string;
  name: string;
  imageUrl: string;
  altText?: string;
  isActive: boolean;
}

export interface ThemeSettings {
  id: string;
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  baseFontSize: string;
  buttonRoundness: string;
  buttonShadow: boolean;
  buttonPadding: string;
  updatedAt: string;
}
