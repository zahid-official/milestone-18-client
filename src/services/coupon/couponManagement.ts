"use server";

import { createCouponSchema, updateCouponSchema } from "@/schemas/coupon.validation";
import { ActionState, ICoupon } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";

type CouponsResponse = {
  success: boolean;
  data: ICoupon[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    totalDocs: number;
  };
  message?: string;
};

type CouponFormPayload = {
  code?: string;
  title?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  minQuantity?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  usageLimit?: number;
};

const parseMeta = (meta: unknown) => {
  if (meta && typeof meta === "object") {
    const parsedMeta = meta as Record<string, unknown>;
    return {
      page: Number(parsedMeta.page) || 1,
      limit: Number(parsedMeta.limit) || 10,
      totalPage: Number(parsedMeta.totalPage) || 1,
      totalDocs: Number(parsedMeta.totalDocs) || 0,
    };
  }
  return undefined;
};

const parseNumber = (value: FormDataEntryValue | null) => {
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  if (typeof value === "number") return value;
  return undefined;
};

const parseBoolean = (value: FormDataEntryValue | null) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return undefined;
};

const getTextValue = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

// Get all coupons (admin/vendor)
const getCoupons = async (queryString?: string): Promise<CouponsResponse> => {
  try {
    const endpoint = queryString ? `/coupon?${queryString}` : "/coupon";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load coupons. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? (result.data as ICoupon[]) : [],
      meta: parseMeta(result?.meta),
      message: result?.message,
    };
  } catch (error) {
    console.error("getCoupons error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get available coupons (customer)
const getAvailableCoupons = async (
  queryString?: string
): Promise<CouponsResponse> => {
  try {
    const endpoint = queryString
      ? `/coupon/available?${queryString}`
      : "/coupon/available";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load available coupons. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? (result.data as ICoupon[]) : [],
      meta: parseMeta(result?.meta),
      message: result?.message,
    };
  } catch (error) {
    console.error("getAvailableCoupons error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get single coupon (admin/vendor)
const getCouponById = async (
  couponId: string
): Promise<{ success: boolean; data: ICoupon | null; message?: string }> => {
  try {
    if (!couponId) {
      return {
        success: false,
        data: null,
        message: "Coupon id is missing.",
      };
    }

    const res = await serverFetchApi.get(`/coupon/singleCoupon/${couponId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load coupon. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: null, message };
    }

    const coupon =
      result?.data && typeof result.data === "object"
        ? (result.data as ICoupon)
        : null;

    return {
      success: true,
      data: coupon,
      message: result?.message,
    };
  } catch (error) {
    console.error("getCouponById error", error);
    return {
      success: false,
      data: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Create coupon
const createCoupon = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    const payload: CouponFormPayload = {
      code: getTextValue(formData.get("code")),
      title: getTextValue(formData.get("title")),
      description: getTextValue(formData.get("description")),
      discountType: getTextValue(formData.get("discountType")),
      discountValue: parseNumber(formData.get("discountValue")),
      maxDiscount: parseNumber(formData.get("maxDiscount")),
      minOrderAmount: parseNumber(formData.get("minOrderAmount")),
      minQuantity: parseNumber(formData.get("minQuantity")),
      startDate: getTextValue(formData.get("startDate")),
      endDate: getTextValue(formData.get("endDate")),
      isActive: parseBoolean(formData.get("isActive")),
      usageLimit: parseNumber(formData.get("usageLimit")),
    };

    const validatedPayload = zodValidator(createCouponSchema, payload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const res = await serverFetchApi.post("/coupon/create", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload.data),
    });
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to create coupon. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, message };
    }

    return {
      success: true,
      message: result?.message || "Coupon created successfully.",
    };
  } catch (error) {
    console.error("createCoupon error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Update coupon
const updateCoupon = async (
  couponId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    if (!couponId) {
      return {
        success: false,
        message: "Coupon id is missing.",
      };
    }

    const payload: CouponFormPayload = {
      code: getTextValue(formData.get("code")),
      title: getTextValue(formData.get("title")),
      description: getTextValue(formData.get("description")),
      discountType: getTextValue(formData.get("discountType")),
      discountValue: parseNumber(formData.get("discountValue")),
      maxDiscount: parseNumber(formData.get("maxDiscount")),
      minOrderAmount: parseNumber(formData.get("minOrderAmount")),
      minQuantity: parseNumber(formData.get("minQuantity")),
      startDate: getTextValue(formData.get("startDate")),
      endDate: getTextValue(formData.get("endDate")),
      isActive: parseBoolean(formData.get("isActive")),
      usageLimit: parseNumber(formData.get("usageLimit")),
    };

    const validatedPayload = zodValidator(updateCouponSchema, payload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const validatedData = validatedPayload.data ?? {};
    const hasUpdates = Object.values(validatedData).some(
      (value) => value !== undefined
    );

    if (!hasUpdates) {
      return {
        success: false,
        message: "No changes to update.",
      };
    }

    const res = await serverFetchApi.patch(`/coupon/${couponId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to update coupon. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, message };
    }

    return {
      success: true,
      message: result?.message || "Coupon updated successfully.",
    };
  } catch (error) {
    console.error("updateCoupon error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Delete coupon
const deleteCoupon = async (couponId: string): Promise<ActionState> => {
  try {
    if (!couponId) {
      return {
        success: false,
        message: "Coupon id is missing.",
      };
    }

    const res = await serverFetchApi.delete(`/coupon/${couponId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to delete coupon. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, message };
    }

    return {
      success: true,
      message: result?.message || "Coupon deleted successfully.",
    };
  } catch (error) {
    console.error("deleteCoupon error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export {
  createCoupon,
  deleteCoupon,
  getAvailableCoupons,
  getCouponById,
  getCoupons,
  updateCoupon,
};
