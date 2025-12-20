"use server";
import {
  IProduct,
  IProductSpecifications,
  ProductMaterials,
} from "@/types/product.interface";
import {
  createProductSchema,
  updateProductSchema,
} from "@/schemas/product.validation";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";
import { ActionState } from "@/types";

// Get Products
const getProducts = async (
  queryString?: string
): Promise<{
  success: boolean;
  data: IProduct[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    totalDocs: number;
  };
  message?: string;
}> => {
  try {
    const endpoint = queryString ? `/product?${queryString}` : "/product";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load products. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    const meta = result?.meta;
    return {
      success: true,
      data: Array.isArray(result?.data) ? result.data : [],
      meta:
        meta && typeof meta === "object"
          ? {
              page: Number(meta.page) || 1,
              limit: Number(meta.limit) || 9,
              totalPage: Number(meta.totalPage) || 1,
              totalDocs: Number(meta.totalDocs) || 0,
            }
          : undefined,
      message: result?.message,
    };
  } catch (error) {
    console.error("getProducts error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get Single Product (uses backend singleProduct route)
const getProductById = async (
  productId: string
): Promise<{ success: boolean; data: IProduct | null; message?: string }> => {
  try {
    if (!productId) {
      return {
        success: false,
        data: null,
        message: "Product id is missing.",
      };
    }

    const res = await serverFetchApi.get(`/product/singleProduct/${productId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load product. Please try again.";
      message = result?.message ?? result?.error ?? message;

      return { success: false, data: null, message };
    }

    const product =
      (result?.data && typeof result.data === "object"
        ? (result.data as IProduct)
        : null) || null;

    return {
      success: true,
      data: product,
      message: result?.message,
    };
  } catch (error) {
    console.error("getProductById error", error);
    return {
      success: false,
      data: null,
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
    const specifications: IProductSpecifications = {
      height: parseNumber(formData.get("height")),
      weight: parseNumber(formData.get("weight")),
      width: parseNumber(formData.get("width")),
      length: parseNumber(formData.get("length")),
      materials:
        typeof materials === "string" && materials.trim().length > 0
          ? (materials.trim() as ProductMaterials)
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

// Update Product
const updateProduct = async (
  productId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    if (!productId) {
      return {
        success: false,
        message: "Product id is missing.",
      };
    }

    const MAX_FILE_BYTES = 4.5 * 1024 * 1024;
    const parseNumber = (value: FormDataEntryValue | null) => {
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    };
    const getTextValue = (value: FormDataEntryValue | null) =>
      typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : undefined;

    const file = formData.get("file");
    const validFile = file instanceof File && file.size > 0 ? file : null;

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

    const materials = formData.get("materials");
    const specifications: IProductSpecifications = {
      height: parseNumber(formData.get("height")),
      weight: parseNumber(formData.get("weight")),
      width: parseNumber(formData.get("width")),
      length: parseNumber(formData.get("length")),
      materials:
        typeof materials === "string" && materials.trim().length > 0
          ? (materials.trim() as ProductMaterials)
          : undefined,
    };
    const hasSpecifications = Object.values(specifications).some(
      (value) => value !== undefined
    );

    const productPayload: Partial<IProduct> = {
      title: getTextValue(formData.get("title")),
      price: parseNumber(formData.get("price")),
      stock: parseNumber(formData.get("stock")),
      category: getTextValue(formData.get("category")),
      description: getTextValue(formData.get("description")),
      productOverview: getTextValue(formData.get("productOverview")),
      specifications: hasSpecifications ? specifications : undefined,
    };

    const validatedPayload = zodValidator(updateProductSchema, productPayload);

    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const validatedData = validatedPayload.data ?? {};
    const hasBodyUpdates = Object.values(validatedData).some(
      (value) => value !== undefined
    );
    const hasFileUpdate = Boolean(validFile);

    if (!hasBodyUpdates && !hasFileUpdate) {
      return {
        success: false,
        message: "No changes to update.",
      };
    }

    const backendPayload: Record<string, unknown> = { ...validatedData };

    if (validatedData.specifications) {
      const { materials: materialValue, ...restSpecs } =
        validatedData.specifications;
      backendPayload.specifications = {
        ...restSpecs,
        ...(materialValue ? { meterials: materialValue } : {}),
      };
    }

    let response: Response;

    if (hasFileUpdate) {
      const backendFormData = new FormData();
      backendFormData.append("data", JSON.stringify(backendPayload));
      backendFormData.append("file", validFile!);

      response = await serverFetchApi.patch(`/product/${productId}`, {
        body: backendFormData,
      });
    } else {
      response = await serverFetchApi.patch(`/product/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendPayload),
      });
    }

    const result = await response.json();

    if (!result?.success) {
      let message = "Failed to update product. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: result?.message || "Product updated successfully.",
    };
  } catch (error) {
    console.error("updateProduct error", error);
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

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
