import { ProductCategory } from "@/types";

export const productCategory = {
  CHAIR: "CHAIR",
  BED: "BED",
  SOFA: "SOFA",
  TABLE: "TABLE",
  SIDE_DRAWER: "SIDE_DRAWER",
  DINING_CHAIR: "DINING_CHAIR",
} as const satisfies Record<ProductCategory, ProductCategory>;
