import type { IOrder, OrderProductSummary } from "@/types";

const parseNumber = (value?: number | string) => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const getProductSummary = (order: IOrder): OrderProductSummary | undefined => {
  if (order.productId && typeof order.productId === "object") {
    return order.productId as OrderProductSummary;
  }
  return undefined;
};

const getOrderAmount = (order: IOrder) => {
  const explicitAmount = parseNumber(order.amount);
  if (explicitAmount !== undefined) return explicitAmount;

  const product = getProductSummary(order);
  const quantity = order.quantity || 1;
  const itemTotal = product?.price ? product.price * quantity : undefined;
  const shippingFee = parseNumber(order.shippingFee);
  const discountAmount = parseNumber(order.discountAmount);

  if (itemTotal !== undefined) {
    const total =
      shippingFee !== undefined ? itemTotal + shippingFee : itemTotal;
    if (discountAmount !== undefined) {
      return Math.max(0, total - discountAmount);
    }
    return total;
  }

  if (shippingFee !== undefined) {
    if (discountAmount !== undefined) {
      return Math.max(0, shippingFee - discountAmount);
    }
    return shippingFee;
  }

  return undefined;
};

export { getOrderAmount };
