import DashboardChartUI, {
  type DashboardChartProps as DashboardChartUIProps,
  type DashboardChartSeries,
} from "@/components/ui/dashboard-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { IOrder, OrderProductSummary } from "@/types";

export interface CustomerDashboardChartProps
  extends Omit<
    DashboardChartUIProps,
    "data" | "config" | "series" | "tooltipFields"
  > {
  orders: IOrder[];
  days?: number;
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const chartSeries = [
  { dataKey: "orders", type: "natural" },
] satisfies DashboardChartSeries[];

const chartTooltipFields: NonNullable<DashboardChartUIProps["tooltipFields"]> = [
  { key: "orders", label: "Orders", format: "number" },
  { key: "amount", label: "Amount", format: "currency" },
];

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

const getOrderDate = (order: IOrder) => {
  if (!order.createdAt) return null;
  const date = new Date(order.createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const getLatestOrderDate = (orders: IOrder[]) => {
  let latestTime = 0;

  orders.forEach((order) => {
    const date = getOrderDate(order);
    if (!date) return;
    const time = date.getTime();
    if (time > latestTime) {
      latestTime = time;
    }
  });

  return latestTime ? new Date(latestTime) : null;
};

const getStartDate = (referenceDate: Date, days: number) => {
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - (days - 1));
  return start;
};

const buildChartData = (orders: IOrder[], referenceDate: Date, days: number) => {
  const startDate = getStartDate(referenceDate, days);
  const dataMap = new Map<
    string,
    { date: string; orders: number; amount: number }
  >();

  for (let i = 0; i < days; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    dataMap.set(key, { date: key, orders: 0, amount: 0 });
  }

  orders.forEach((order) => {
    const date = getOrderDate(order);
    if (!date || date < startDate || date > referenceDate) return;
    const key = date.toISOString().slice(0, 10);
    const entry = dataMap.get(key);
    if (!entry) return;
    entry.orders += 1;
    const amount = getOrderAmount(order);
    if (amount !== undefined) {
      entry.amount += amount;
    }
  });

  return Array.from(dataMap.values());
};

const getResolvedReferenceDate = (
  orders: IOrder[],
  referenceDate?: Date | string
) => {
  if (referenceDate) {
    const parsedDate = new Date(referenceDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return getLatestOrderDate(orders) ?? new Date();
};

// CustomerDashboardChart Component
const CustomerDashboardChart = ({
  orders,
  days = 90,
  title = "Order activity",
  description,
  descriptionShort,
  referenceDate,
  defaultRange = "30d",
  ...props
}: CustomerDashboardChartProps) => {
  const resolvedReferenceDate = getResolvedReferenceDate(orders, referenceDate);
  const chartData = buildChartData(orders, resolvedReferenceDate, days);
  const resolvedDescription =
    description ?? `Orders placed in the last ${days} days`;
  const resolvedDescriptionShort = descriptionShort ?? `Last ${days} days`;

  return (
    <DashboardChartUI
      title={title}
      description={resolvedDescription}
      descriptionShort={resolvedDescriptionShort}
      data={chartData}
      config={chartConfig}
      series={chartSeries}
      tooltipFields={chartTooltipFields}
      referenceDate={resolvedReferenceDate.toISOString()}
      defaultRange={defaultRange}
      {...props}
    />
  );
};

export default CustomerDashboardChart;
