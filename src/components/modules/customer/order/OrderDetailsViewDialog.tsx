"use client";

import InfoRow from "@/components/modules/dashboard/managementPage/InfoRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IOrder,
  IOrderPaymentInfo,
  IOrderUserInfo,
  OrderProductSummary,
} from "@/types";
import { CreditCard, Package, Receipt, Tag } from "lucide-react";
import Image from "next/image";

interface OrderDetailsViewDialogProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusBadgeBase =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";

const orderStatusStyles: Record<string, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100",
  CONFIRMED: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-100",
  IN_PROCESSING:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100",
  DELIVERED:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100",
  CANCELLED:
    "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
};

const paymentStatusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100",
  UNPAID: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100",
  FAILED:
    "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
};

const formatStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getProductInfo = (
  productId: IOrder["productId"]
): OrderProductSummary | undefined => {
  if (productId && typeof productId === "object") {
    return productId as OrderProductSummary;
  }
  return undefined;
};

const getUserInfo = (userId: IOrder["userId"]): IOrderUserInfo | undefined => {
  if (userId && typeof userId === "object") {
    return userId as IOrderUserInfo;
  }
  return undefined;
};

const getPaymentInfo = (
  paymentId: IOrder["paymentId"]
): IOrderPaymentInfo | undefined => {
  if (paymentId && typeof paymentId === "object") {
    return paymentId as IOrderPaymentInfo;
  }
  return undefined;
};

const formatCategory = (category?: string) => {
  if (!category) return "N/A";
  return category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const OrderDetailsViewDialog = ({
  open,
  onClose,
  order,
}: OrderDetailsViewDialogProps) => {
  if (!order) {
    return null;
  }

  const product = getProductInfo(order.productId);
  const user = getUserInfo(order.userId);
  const payment = getPaymentInfo(order.paymentId);

  const totalAmount =
    typeof order.amount === "number"
      ? order.amount
      : typeof order.amount === "string" && !Number.isNaN(Number(order.amount))
      ? Number(order.amount)
      : product?.price
      ? product.price * order.quantity
      : undefined;

  const totalAmountLabel =
    totalAmount !== undefined
      ? currencyFormatter.format(totalAmount)
      : "Amount N/A";

  const unitPriceLabel =
    product?.price !== undefined
      ? currencyFormatter.format(product.price)
      : "N/A";

  const placedOn = formatDateTime(order.createdAt);

  const orderStatusBadge = (
    <span
      className={`${statusBadgeBase} ${
        orderStatusStyles[order.orderStatus] || "bg-muted text-foreground"
      }`}
    >
      {formatStatus(order.orderStatus)}
    </span>
  );

  const paymentStatusBadge = (
    <span
      className={`${statusBadgeBase} ${
        paymentStatusStyles[order.paymentStatus || ""] ||
        "bg-muted text-foreground"
      }`}
    >
      {formatStatus(order.paymentStatus)}
    </span>
  );

  const transactionId =
    payment?.transactionId ||
    payment?._id ||
    (typeof order.paymentId === "string" ? order.paymentId : undefined);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" max-h-[calc(100vh-3rem)] overflow-y-auto border-0 bg-background p-0 shadow-2xl">
        <DialogHeader className="sm:px-8 px-4 pt-8">
          <DialogTitle className="text-2xl font-semibold">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-4 pb-6 sm:px-6 sm:pb-6">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-xl border bg-muted shadow-sm">
            <div className="relative max-h-72 w-full from-muted to-background">
              {product?.thumbnail ? (
                <div className="w-full max-w-sm mx-auto drop-shadow-lg">
                  <Image
                    src={product.thumbnail}
                    alt={product.title || "Product thumbnail"}
                    width={1200}
                    height={900}
                    sizes="(min-width: 768px) 720px, 100vw"
                    className="h-72 w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-muted-foreground">
                  No thumbnail available
                </div>
              )}
            </div>
          </div>

          {/* Title row */}
          <div className="flex flex-wrap items-start gap-4 rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="inline-flex uppercase rounded items-center gap-2 bg-primary/10 px-3 py-1 text-primary">
                  <Tag className="size-4" />
                  {formatCategory(product?.category)}
                </span>
              </div>

              <div>
                <h2 className="text-xl py-1 font-semibold leading-tight">
                  {product?.title || "Unknown product"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Placed on {placedOn}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Total
              </p>
              <p className="text-xl font-bold text-primary">
                {totalAmountLabel}
              </p>

              <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold">
                <span className="rounded-full bg-muted px-3 py-1 text-foreground">
                  Qty: {order.quantity}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-foreground">
                  {unitPriceLabel} each
                </span>
              </div>
            </div>
          </div>

          {/* Snapshot */}
          <div className="space-y-4 rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Receipt className="size-4 text-muted-foreground" />
              Order Snapshot
            </div>
            <div className="grid gap-4 justify-center items-center grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Order Status" value={orderStatusBadge} />
              <InfoRow label="Payment Status" value={paymentStatusBadge} />
              <InfoRow label="Placed On" value={placedOn} />
            </div>

            <div className="grid gap-4 justify-center items-center sm:grid-cols-2">
              <InfoRow
                label="Transaction ID"
                value={
                  <span className="break-all whitespace-normal">
                    {transactionId || "N/A"}
                  </span>
                }
              />
              <InfoRow
                label="Customer"
                value={user?.email || user?.name || "Current user"}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Package className="size-4 text-muted-foreground" />
                Product Details
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Product" value={product?.title || "N/A"} />
                <InfoRow
                  label="Category"
                  value={formatCategory(product?.category)}
                />
                <InfoRow label="Unit Price" value={unitPriceLabel} />
                <InfoRow label="Quantity" value={order.quantity} />
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="size-4 text-muted-foreground" />
                Payment
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Per Unit" value={unitPriceLabel} />
                <InfoRow label="Quantity" value={order.quantity} />
                <InfoRow label="Total Paid" value={totalAmountLabel} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsViewDialog;
