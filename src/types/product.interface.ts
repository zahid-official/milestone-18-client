import { Materials } from "@/schemas/product.validation";

export interface IProductSpecifications {
  height?: number;
  weight?: number;
  width?: number;
  length?: number;
  materials?: Materials;
  // Backend currently returns `meterials` for materials; keep optional for compatibility
  meterials?: Materials | string;
}

export interface IProduct {
  _id?: string;
  vendorId: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  thumbnail?: string;
  description?: string;
  productOverview?: string;
  specifications?: IProductSpecifications;
  createdAt?: string;
  updatedAt?: string;
}
