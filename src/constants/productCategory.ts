import { ProductCategory, ProductMaterials } from "@/types/product.interface";

export const productCategory = {
  CHAIR: "CHAIR",
  BED: "BED",
  SOFA: "SOFA",
  TABLE: "TABLE",
  SIDE_DRAWER: "SIDE_DRAWER",
  DINING_CHAIR: "DINING_CHAIR",
} as const satisfies Record<ProductCategory, ProductCategory>;

export const productMaterials = {
  WOODEN: "WOODEN",
  METAL: "METAL",
  BAMBOO: "BAMBOO",
} as const satisfies Record<ProductMaterials, ProductMaterials>;
