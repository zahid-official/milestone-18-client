import DashboardChartUI, {
  type DashboardChartProps as DashboardChartUIProps,
  type DashboardChartSeries,
} from "@/components/ui/dashboard-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { IOrder } from "@/types";
import { getOrderAmount } from "@/utils/orderUtils";

export interface VendorAnalyticsChartProps
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
  { key: "revenue", label: "Paid revenue", format: "currency" },
];

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
    { date: string; orders: number; revenue: number }
  >();

  for (let i = 0; i < days; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    dataMap.set(key, { date: key, orders: 0, revenue: 0 });
  }

  orders.forEach((order) => {
    const date = getOrderDate(order);
    if (!date || date < startDate || date > referenceDate) return;
    const key = date.toISOString().slice(0, 10);
    const entry = dataMap.get(key);
    if (!entry) return;
    entry.orders += 1;
    if (order.paymentStatus === "PAID") {
      const amount = getOrderAmount(order);
      if (amount !== undefined) {
        entry.revenue += amount;
      }
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

const VendorAnalyticsChart = ({
  orders,
  days = 90,
  title = "Sales activity",
  description,
  descriptionShort,
  referenceDate,
  defaultRange = "30d",
  ...props
}: VendorAnalyticsChartProps) => {
  const resolvedReferenceDate = getResolvedReferenceDate(orders, referenceDate);
  const chartData = buildChartData(orders, resolvedReferenceDate, days);
  const resolvedDescription =
    description ?? `Orders and paid revenue in the last ${days} days`;
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

export default VendorAnalyticsChart;
