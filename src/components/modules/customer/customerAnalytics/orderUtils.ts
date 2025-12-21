import type { IOrder, OrderProductSummary } from "@/types";

const parseNumber = (value?: number) => {
  if (typeof value !== "number") return undefined;
  return Number.isNaN(value) ? undefined : value;
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

  if (itemTotal !== undefined) {
    return shippingFee !== undefined ? itemTotal + shippingFee : itemTotal;
  }

  return shippingFee;
};

export { getOrderAmount };
