import { IColumn } from "@/components/modules/dashboard/managementPage/ManagementTable";
import { IOrder, IOrderUserInfo, OrderProductSummary } from "@/types";
import Image from "next/image";

// Shared formatting helpers for order rows
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const truncateText = (text: string, max = 30) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

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

// Badge styling for status chips
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

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Extract normalized product info from the polymorphic order shape
const getProductInfo = (
  productId: IOrder["productId"]
): OrderProductSummary | undefined => {
  if (productId && typeof productId === "object") {
    return productId as OrderProductSummary;
  }
  return undefined;
};

// Extract normalized customer info (userId or customerId)
const getCustomerInfo = (order: IOrder): IOrderUserInfo | undefined => {
  const candidate = order.customerId ?? order.userId;
  if (candidate && typeof candidate === "object") {
    return candidate as IOrderUserInfo;
  }
  return undefined;
};

const getCustomerId = (order: IOrder) => {
  if (typeof order.customerId === "string") return order.customerId;
  if (typeof order.userId === "string") return order.userId;
  return undefined;
};

const formatCategory = (category?: string) => {
  if (!category) return "N/A";
  return category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

// Calculate display amount when backend total isn't provided
const calculateAmount = (order: IOrder) => {
  const explicitAmount = parseNumber(order.amount);
  if (explicitAmount !== undefined) return explicitAmount;

  const product = getProductInfo(order.productId);
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

const renderStatusBadge = (status?: string) => {
  if (!status) return "-";
  const className = `${statusBadgeBase} ${
    orderStatusStyles[status] || "bg-muted text-foreground"
  }`;
  return <span className={className}>{formatStatus(status)}</span>;
};

const renderPaymentBadge = (status?: string) => {
  if (!status) return "-";
  const className = `${statusBadgeBase} ${
    paymentStatusStyles[status] || "bg-muted text-foreground"
  }`;
  return <span className={className}>{formatStatus(status)}</span>;
};

// Customer column renderer
const renderCustomerCell = (order: IOrder) => {
  const customer = getCustomerInfo(order);
  const fallbackId = getCustomerId(order);
  const name =
    customer?.name ||
    customer?.email ||
    (fallbackId ? `Customer ${fallbackId.slice(-6)}` : "Unknown customer");
  const email = customer?.email || "N/A";

  return (
    <div className="space-y-0.5">
      <p className="text-sm font-semibold leading-tight">{name}</p>
      <p className="text-xs text-muted-foreground">{email}</p>
    </div>
  );
};

// Contact column renderer
const renderContactCell = (order: IOrder) => {
  const customer = getCustomerInfo(order);
  const phone = customer?.phone || "N/A";
  const address = customer?.address || "N/A";

  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium leading-tight">{phone}</p>
      <p className="text-xs text-muted-foreground">{address}</p>
    </div>
  );
};

// Product column renderer
const renderProductCell = (order: IOrder) => {
  const product = getProductInfo(order.productId);
  const title =
    product?.title ||
    (typeof order.productId === "string"
      ? `Product ${order.productId.slice(-6)}`
      : "Unknown product");
  const category = formatCategory(product?.category);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
        {product?.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title || "Product thumbnail"}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-1 text-[8px] uppercase tracking-wide text-muted-foreground text-center leading-tight wrap-break-word">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground uppercase">{category}</p>
      </div>
    </div>
  );
};

const renderOrderId = (order: IOrder) => {
  const orderId = order._id?.trim();
  return orderId ? truncateText(orderId) : "-";
};

// Column definitions for the vendor order management table
const orderManagementColumns: IColumn<IOrder>[] = [
  {
    header: "Product",
    accessor: (order) => renderProductCell(order),
    className: "min-w-[180px]",
  },
  {
    header: "Customer",
    accessor: (order) => renderCustomerCell(order),
    className: "min-w-[180px]",
  },
  {
    header: "Contact",
    accessor: (order) => renderContactCell(order),
    className: "min-w-[200px]",
  },
  {
    header: "Quantity",
    accessor: (order) => order.quantity ?? "-",
    className: "w-[110px]",
  },
  {
    header: "Total Amount",
    accessor: (order) => {
      const amount = calculateAmount(order);
      return amount !== undefined ? currencyFormatter.format(amount) : "-";
    },
    className: "min-w-[120px]",
  },
  {
    header: "Order Status",
    accessor: (order) => renderStatusBadge(order.orderStatus),
    className: "min-w-[120px]",
  },
  {
    header: "Payment Status",
    accessor: (order) => renderPaymentBadge(order.paymentStatus),
    className: "min-w-[120px]",
  },
  {
    header: "Order ID",
    accessor: (order) => renderOrderId(order),
    className: "min-w-[120px]",
  },
  {
    header: "Placed On",
    accessor: (order) => formatDate(order.createdAt),
    className: "min-w-[120px]",
  },
];

export default orderManagementColumns;
