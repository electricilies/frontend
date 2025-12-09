export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ResponseMetadata {
  currentPage: number;
  itemsPerPage: number;
  pageItems: number;
  totalItems: number;
  totalPages: number;
}

export interface AttributeValue {
  id: string;
  value: string;
  deletedAt: string | null;
  tempId?: string;
}

export interface Attribute {
  id: string;
  code: string;
  name: string;
  values: AttributeValue[];
  deletedAt: string | null;
}

export interface ProductAttribute {
  id: string;
  code: string;
  name: string;
  value: AttributeValue;
  deletedAt: string | null;
}

export interface Image {
  id: string;
  url: string;
  order: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OptionValue {
  id: string;
  value: string;
  deletedAt: string | null;
}

export interface Option {
  id: string;
  name: string;
  values: OptionValue[];
  deletedAt: string | null;
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  quantity: number;
  purchaseCount: number;
  optionValues: OptionValue[];
  images: Image[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  viewsCount: number;
  totalPurchase: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  category: Category;
  attributes: ProductAttribute[];
  images: Image[];
  options: Option[];
  variants: Variant[];
}

export interface CartItem {
  id: string;
  product: Product;
  productVariant: Variant;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  updatedAt: string;
  userId: string;
}

export interface ProductResponse {
  data: Product[];
  meta: ResponseMetadata;
}

export interface CategoryResponse {
  data: Category[];
  meta: ResponseMetadata;
}

export interface AttributeResponse {
  data: Attribute[];
  meta: ResponseMetadata;
}

export interface CategoryResponse {
  data: Category[];
  meta: ResponseMetadata;
}
