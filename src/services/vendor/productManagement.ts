"use server";

import serverFetchApi from "@/utils/serverFetchApi";
import { createProductSchema } from "@/schemas/product.validation";

// Create Product
const createProduct = async (_currentState: any, formData: FormData) => {
  try {
    // Helper to safely parse numbers; empty values remain undefined so zod can flag required fields
    const parseNumber = (value: FormDataEntryValue | null) => {
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? NaN : parsed;
      }
      return undefined;
    };

    // Build payload from incoming form data for validation
    const materials = formData.get("materials");
    const specifications = {
      height: parseNumber(formData.get("height")),
      weight: parseNumber(formData.get("weight")),
      width: parseNumber(formData.get("width")),
      length: parseNumber(formData.get("length")),
      materials:
        typeof materials === "string" && materials.trim().length
          ? materials.trim()
          : undefined,
    };

    // Remove specs block if user left all specification fields empty
    const hasSpecifications = Object.values(specifications).some(
      (value) => value !== undefined
    );

    const productPayload = {
      title: formData.get("title"),
      price: parseNumber(formData.get("price")),
      stock: parseNumber(formData.get("stock")),
      category: formData.get("category"),
      description: formData.get("description"),
      productOverview: formData.get("productOverview"),
      specifications: hasSpecifications ? specifications : undefined,
    };

    // Validate payload against product schema before sending to backend
    const parsed = createProductSchema.safeParse(productPayload);

    // Surface validation errors back to the UI
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path[issue.path.length - 1]?.toString(),
          message: issue.message,
        })),
        message: "Please fix the highlighted errors.",
      };
    }

    // Use validated data to build multipart payload for backend (JSON + file)
    const validatedData = parsed.data;
    const backendFormData = new FormData();
    backendFormData.append("data", JSON.stringify(validatedData));

    // Attach thumbnail/file only when provided
    const file = formData.get("file");
    if (file && typeof file !== "string") {
      backendFormData.append("file", file);
    }

    // Call backend API with access token forwarded via cookie for backend middleware
    const res = await serverFetchApi.post("/product/create", {
      body: backendFormData,
    });
    const result = await res.json();

    // Handle unsuccessful creation response
    if (!result?.success) {
      let message = "Product creation failed. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    // Return success result for UI handling
    return {
      success: true,
      message: result?.message || "Product created successfully.",
    };
  } catch (error) {
    console.error("createProduct error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Export Product Management Service
const productManagementService = {
  createProduct,
};

export default productManagementService;
