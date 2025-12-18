import { IProduct } from "./product.interface";

// Defines order status
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROCESSING"
  | "DELIVERED"
  | "CANCELLED";

// Defines payment status
export type PaymentStatus = "PAID" | "UNPAID" | "FAILED";

// Lightweight user info returned with an order
export interface IOrderUserInfo {
  _id?: string;
  email?: string;
  role?: string;
  status?: string;
  name?: string;
}

// Payment info attached to an order
export interface IOrderPaymentInfo {
  _id?: string;
  transactionId?: string;
}

// Product summary returned with an order
export type OrderProductSummary = Pick<
  IProduct,
  "title" | "price" | "category" | "thumbnail"
> & {
  _id?: string;
};

// Order interface definition
export interface IOrder {
  _id?: string;
  userId: string | IOrderUserInfo;
  productId: string | OrderProductSummary;
  paymentId?: string | IOrderPaymentInfo;
  quantity: number;
  amount?: number;
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}
