"use server";
import { IProduct } from "@/types/product.interface";
import { createProductSchema } from "@/schemas/product.validation";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";
import { ActionState } from "@/types";

// Get Products
const getProducts = async (): Promise<{
  success: boolean;
  data: IProduct[];
  message?: string;
}> => {
  try {
    const res = await serverFetchApi.get("/product");
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load products. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? result.data : [],
      message: result?.message,
    };
  } catch (error) {
    console.error("getProducts error", error);
    return {
      success: false,
      data: [],
      message: "Something went wrong. Please try again.",
    };
  }
};

// Create Product
const createProduct = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    // Helper to safely parse numbers from form data
    const parseNumber = (value: FormDataEntryValue | null) => {
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    };

    // Build product payload from form data
    const materials = formData.get("materials");
    const specifications = {
      height: parseNumber(formData.get("height")),
      weight: parseNumber(formData.get("weight")),
      width: parseNumber(formData.get("width")),
      length: parseNumber(formData.get("length")),
      materials:
        typeof materials === "string" && materials.trim().length > 0
          ? materials.trim()
          : undefined,
    };

    // Check if at least one specification is provided
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
    const file = formData.get("file");
    const validFile = file instanceof File && file.size > 0 ? file : null;

    // Enforce 4.5MB upload limit to match Next/Vercel configuration
    const MAX_FILE_BYTES = 4.5 * 1024 * 1024;
    if (validFile && validFile.size > MAX_FILE_BYTES) {
      return {
        success: false,
        errors: [
          {
            field: "file",
            message: "Image must be 4.5MB or smaller.",
          },
        ],
        message: "Image exceeds the 4.5MB upload limit.",
      };
    }

    // Validate product payload using Zod schema
    const validatedPayload = zodValidator(createProductSchema, productPayload);

    // Handle validation errors
    if (!validatedPayload.success || !validFile) {
      const errors = [
        ...(validatedPayload.errors ?? []),
        ...(validFile
          ? []
          : [{ field: "file", message: "Thumbnail is required." }]),
      ];

      return {
        success: false,
        errors,
        message:
          validatedPayload.message || "Please fix the highlighted errors.",
      };
    }

    // Prepare FormData for backend submission
    const validatedData = validatedPayload.data!;
    const backendPayload: Record<string, unknown> = { ...validatedData };
    if (validatedData.specifications) {
      const { materials: materialValue, ...restSpecs } =
        validatedData.specifications;
      backendPayload.specifications = {
        ...restSpecs,
        ...(materialValue ? { meterials: materialValue } : {}),
      };
    }

    const backendFormData = new FormData();
    backendFormData.append("data", JSON.stringify(backendPayload));
    backendFormData.append("file", validFile);

    // Send create product request to backend
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

    // Return success result
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

// Delete Product
const deleteProduct = async (productId: string): Promise<ActionState> => {
  try {
    if (!productId) {
      return {
        success: false,
        message: "Product id is missing.",
      };
    }

    const res = await serverFetchApi.delete(`/product/${productId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to delete product. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: result?.message || "Product deleted successfully.",
    };
  } catch (error) {
    console.error("deleteProduct error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export { getProducts, createProduct, deleteProduct };
