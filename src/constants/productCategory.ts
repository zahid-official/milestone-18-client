import { ProductCategory, ProductMaterials } from "@/types/product.interface";

export const productCategory = {
  CHAIR: "CHAIR",
  BED: "BED",
  SOFA: "SOFA",
  TABLE: "TABLE",
  SIDE_DRAWER: "SIDE DRAWER",
  DINING_CHAIR: "DINING CHAIR",
} as const satisfies Record<string, ProductCategory>;

export const productMaterials = {
  WOODEN: "WOODEN",
  METAL: "METAL",
  BAMBOO: "BAMBOO",
} as const satisfies Record<ProductMaterials, ProductMaterials>;
