"use server";
import createOrderSchema from "@/schemas/order.validation";
import { ActionState, IOrder } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";

type OrdersResponse = {
  success: boolean;
  data: IOrder[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    totalDocs: number;
  };
  message?: string;
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

// Get all orders (vendor)
const getOrders = async (queryString?: string): Promise<OrdersResponse> => {
  try {
    const endpoint = queryString ? `/order?${queryString}` : "/order";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load orders. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? (result.data as IOrder[]) : [],
      meta: parseMeta(result?.meta),
      message: result?.message,
    };
  } catch (error) {
    console.error("getOrders error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get orders for logged-in customer
const getUserOrders = async (queryString?: string): Promise<OrdersResponse> => {
  try {
    const endpoint = queryString
      ? `/order/userOrders?${queryString}`
      : "/order/userOrders";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load your orders. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? (result.data as IOrder[]) : [],
      meta: parseMeta(result?.meta),
      message: result?.message,
    };
  } catch (error) {
    console.error("getUserOrders error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get single order (vendor)
const getOrderById = async (
  orderId: string
): Promise<{ success: boolean; data: IOrder | null; message?: string }> => {
  try {
    if (!orderId) {
      return {
        success: false,
        data: null,
        message: "Order id is missing.",
      };
    }

    const res = await serverFetchApi.get(`/order/singleOrder/${orderId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load order. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: null, message };
    }

    const order =
      result?.data && typeof result.data === "object"
        ? (result.data as IOrder)
        : null;

    return {
      success: true,
      data: order,
      message: result?.message,
    };
  } catch (error) {
    console.error("getOrderById error", error);
    return {
      success: false,
      data: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get single order for logged-in customer
const getUserOrderById = async (
  orderId: string
): Promise<{ success: boolean; data: IOrder | null; message?: string }> => {
  try {
    if (!orderId) {
      return {
        success: false,
        data: null,
        message: "Order id is missing.",
      };
    }

    const res = await serverFetchApi.get(`/order/userOrder/${orderId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load order. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: null, message };
    }

    const order =
      result?.data && typeof result.data === "object"
        ? (result.data as IOrder)
        : null;

    return {
      success: true,
      data: order,
      message: result?.message,
    };
  } catch (error) {
    console.error("getUserOrderById error", error);
    return {
      success: false,
      data: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Create order (customer)
const createOrder = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState<{ paymentURL?: string; order?: IOrder }>> => {
  try {
    const parseNumber = (value: FormDataEntryValue | null) => {
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      if (typeof value === "number") return value;
      return undefined;
    };
    const getTextValue = (value: FormDataEntryValue | null) =>
      typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : undefined;

    const payload = {
      productId: getTextValue(formData.get("productId")),
      quantity: parseNumber(formData.get("quantity")),
    };

    const validatedPayload = zodValidator(createOrderSchema, payload);
    if (!validatedPayload.success) {
      return {
        success: false,
        message: validatedPayload.message,
        errors: validatedPayload.errors,
      };
    }
    const validatedData = validatedPayload.data!;

    const res = await serverFetchApi.post("/order/create", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to place order. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    const paymentURL =
      result?.data?.paymentURL ||
      (typeof result?.paymentURL === "string" ? result.paymentURL : undefined);

    return {
      success: true,
      message: result?.message || "Order placed successfully.",
      data: {
        paymentURL,
        order:
          result?.data?.order && typeof result.data.order === "object"
            ? (result.data.order as IOrder)
            : undefined,
      },
    };
  } catch (error) {
    console.error("createOrder error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Helpers for status updates
const updateOrderStatus = async (endpoint: string): Promise<ActionState> => {
  try {
    const res = await serverFetchApi.patch(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to update order status. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, message };
    }

    return {
      success: true,
      message: result?.message || "Order status updated successfully.",
    };
  } catch (error) {
    console.error("updateOrderStatus error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Vendor transitions
const markOrderInProgress = async (orderId: string): Promise<ActionState> => {
  if (!orderId) {
    return { success: false, message: "Order id is missing." };
  }
  return updateOrderStatus(`/order/${orderId}/in-progress`);
};

const markOrderDelivered = async (orderId: string): Promise<ActionState> => {
  if (!orderId) {
    return { success: false, message: "Order id is missing." };
  }
  return updateOrderStatus(`/order/${orderId}/delivered`);
};

// Customer transition
const cancelOrder = async (orderId: string): Promise<ActionState> => {
  if (!orderId) {
    return { success: false, message: "Order id is missing." };
  }
  return updateOrderStatus(`/order/${orderId}/cancel`);
};

export {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
  getUserOrderById,
  getUserOrders,
  markOrderDelivered,
  markOrderInProgress,
};
