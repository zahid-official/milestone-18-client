// Defines product materials
export type ProductMaterials = "WOODEN" | "METAL" | "BAMBOO";

export type ProductCategory =
  | "CHAIR"
  | "BED"
  | "SOFA"
  | "TABLE"
  | "SIDE DRAWER"
  | "DINING CHAIR";

export interface IProductSpecifications {
  height?: number;
  weight?: number;
  width?: number;
  length?: number;
  materials?: ProductMaterials;
  // Backend currently returns `meterials` for materials; keep optional for compatibility
  meterials?: ProductMaterials | string;
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
