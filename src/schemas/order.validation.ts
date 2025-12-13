import { z } from "zod";

// Zod schema for creating an order
const createOrderSchema = z.object({
  // Product Id
  productId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Product ID is required"
          : "Product ID must be a string",
    })
    .trim(),

  // Quantity
  quantity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Quantity is required"
          : "Quantity must be a number",
    })
    .int({ error: "Quantity must be an integer." })
    .min(1, { error: "Quantity must be at least 1." }),
});

export default createOrderSchema;
