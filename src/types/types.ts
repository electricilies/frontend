export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ResponseMetadata {
  currentPage?: number;
  itemsPerPage?: number;
  pageItems?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface AttributeValue {
  id: string;
  value: string;
  deletedAt: string | null;
}

export interface Attribute {
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
  attributes: Attribute[];
  images: Image[];
  options: Option[];
  variants: Variant[];
}

export interface ProductResponse {
  data: Product[];
  meta: ResponseMetadata;
}

export interface CategoryResponse {
  data: Category[];
  meta: ResponseMetadata;
}
