import InfoRow from "@/components/modules/dashboard/managementPage/InfoRow";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { getUserOrderById } from "@/services/order/orderManagement";
import { IOrder, IOrderPaymentInfo, OrderProductSummary } from "@/types";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PaymentSuccessPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatStatus = (status?: string) => {
  if (!status) return "N/A";
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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

const getProductInfo = (
  productId: IOrder["productId"]
): OrderProductSummary | undefined => {
  if (productId && typeof productId === "object") {
    return productId as OrderProductSummary;
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

// PaymentSuccessPage Component
const PaymentSuccessPage = async ({
  searchParams,
}: PaymentSuccessPageProps) => {
  const params = (await searchParams) || {};
  const orderParam = params.order_id;
  const orderId = Array.isArray(orderParam)
    ? orderParam[0]
    : orderParam?.trim();
  const orderResult = orderId ? await getUserOrderById(orderId) : null;
  const order = orderResult?.success ? orderResult.data : null;

  const product = order ? getProductInfo(order.productId) : undefined;
  const payment = order ? getPaymentInfo(order.paymentId) : undefined;

  const quantity = order?.quantity ?? 1;
  const unitPrice = parseNumber(product?.price);
  const shippingFee = parseNumber(order?.shippingFee);
  const subtotal =
    unitPrice !== undefined ? unitPrice * Math.max(1, quantity) : undefined;
  const total =
    parseNumber(order?.amount) ??
    (subtotal !== undefined
      ? subtotal + (shippingFee ?? 0)
      : undefined);

  return (
    <div className="bg-muted/30">
      <PageBanner
        heading="Payment Successful"
        subHeading="Thanks for completing your payment. Your order is now in progress."
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 size-6 text-emerald-600" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Payment confirmed</h1>
              <p className="text-muted-foreground">
                We have received your payment and will start processing your
                order shortly.
              </p>
            </div>
          </div>

          {orderId ? (
            <div className="mt-5 rounded-lg bg-muted/40 p-4 text-sm">
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-semibold break-all">{orderId}</p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              Order id was not provided in the payment redirect.
            </p>
          )}

          {order ? (
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-background">
                    {product?.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title || "Product thumbnail"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="text-lg font-semibold">
                      {product?.title || "Order item"}
                    </p>
                    {product?.category && (
                      <p className="text-xs uppercase text-muted-foreground">
                        {formatStatus(product.category)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Order Details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <InfoRow
                    label="Order Status"
                    value={formatStatus(order.orderStatus)}
                  />
                  <InfoRow
                    label="Payment Status"
                    value={formatStatus(order.paymentStatus)}
                  />
                  <InfoRow label="Quantity" value={quantity} />
                  <InfoRow
                    label="Unit Price"
                    value={
                      unitPrice !== undefined
                        ? currencyFormatter.format(unitPrice)
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Shipping Fee"
                    value={
                      shippingFee !== undefined
                        ? currencyFormatter.format(shippingFee)
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Total Paid"
                    value={
                      total !== undefined
                        ? currencyFormatter.format(total)
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Placed On"
                    value={formatDate(order.createdAt)}
                  />
                  <InfoRow
                    label="Transaction ID"
                    value={
                      payment?.transactionId ||
                      payment?._id ||
                      (typeof order.paymentId === "string"
                        ? order.paymentId
                        : "N/A")
                    }
                  />
                </div>
              </div>
            </div>
          ) : orderId ? (
            <div className="mt-6 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
              Unable to load order details for this payment. You can still view
              your order list for the latest status.
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
