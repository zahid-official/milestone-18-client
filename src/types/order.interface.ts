// Defines order status
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROCESSING"
  | "DELIVERED"
  | "CANCELLED";

// Defines payment status
export type PaymentStatus = "PAID" | "UNPAID" | "FAILED";

// Order interface definition
export interface IOrder {
  _id?: string;
  userId: string;
  productId: string;
  paymentId?: string;
  quantity: number;
  amount?: number;
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}
