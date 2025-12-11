import { z } from "zod";

// Defines product materials
export enum Materials {
  WOODEN = "WOODEN",
  METAL = "METAL",
  BAMBOO = "BAMBOO",
}

// Zod schema for product specifications
const productSpecificationsSchema = z.object({
  height: z
    .number({ error: "Height must be a number" })
    .nonnegative({ error: "Height cannot be negative" })
    .optional(),

  weight: z
    .number({ error: "Weight must be a number" })
    .nonnegative({ error: "Weight cannot be negative" })
    .optional(),

  width: z
    .number({ error: "Width must be a number" })
    .nonnegative({ error: "Width cannot be negative" })
    .optional(),

  length: z
    .number({ error: "Length must be a number" })
    .nonnegative({ error: "Length cannot be negative" })
    .optional(),

  materials: z
    .enum(Object.values(Materials) as [string, ...string[]])
    .optional(),
});

// Zod schema for creating a product
const createProductSchema = z.object({
  // Title
  title: z
    .string({ error: "Title is required" })
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(100, { error: "Title cannot exceed 100 characters." })
    .trim(),

  // Price
  price: z
    .number({ error: "Price is required" })
    .nonnegative({ error: "Price cannot be negative number." }),

  // Stock
  stock: z
    .number({ error: "Stock is required" })
    .int({ error: "Stock must be an integer." })
    .nonnegative({ error: "Stock cannot be negative number." }),

  // Category
  category: z
    .string({ error: "Category is required" })
    .min(2, { error: "Category must be at least 2 characters long." })
    .max(50, { error: "Category cannot exceed 50 characters." })
    .trim(),

  // Thumbnail
  thumbnail: z.string({ error: "Thumbnail must be string" }).trim().optional(),

  // Description
  description: z
    .string({ error: "Description must be a string" })
    .min(20, { error: "Description must be at least 20 characters long." })
    .max(500, { error: "Description cannot exceed 500 characters." })
    .trim(),

  // Product Overview
  productOverview: z
    .string({ error: "Product details must be a string" })
    .max(1000, { error: "Product details cannot exceed 1000 characters." })
    .trim()
    .optional(),

  // Specifications
  specifications: productSpecificationsSchema.optional(),
});

// Zod schema for updating a product (all fields optional)
const updateProductSchema = createProductSchema.partial();

export { createProductSchema, updateProductSchema };
