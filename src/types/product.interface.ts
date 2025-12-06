export interface IVariantOption {
  id: string;
  size: string;   // M, L, XL, XXL
  stock: number;
  productId: string;
}

export interface IProductDescription {
  id: string;
  productId: string;
  intro?: string | null;
  bulletPoints: string[];
  outro?: string | null;
}

export interface IProductCategory {
  id: string;
  categoryId: string;
  productId: string;
  // optional relation fields if returned populated:
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface IProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  sku?: string | null;
  barcode?: string | null;
  images: string[];
  color?: string | null;
  newArrival: boolean;

  createdAt: string;
  updatedAt: string;

  description?: IProductDescription | null;
  productCategory?: IProductCategory[];
  variantOption?: IVariantOption[];
}
