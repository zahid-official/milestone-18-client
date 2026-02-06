import DashboardChartUI from "@/components/ui/dashboard-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { DashboardChartSeries } from "@/components/ui/dashboard-chart";
import type { AdminChartPoint } from "@/components/modules/admin/adminAnalytics/adminAnalyticsUtils";

interface AdminAnalyticsActivityChartProps {
  data: AdminChartPoint[];
  referenceDate: Date;
}

const chartConfig = {
  revenue: {
    label: "Paid Revenue",
    color: "var(--primary)",
  },
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const chartSeries = [
  { dataKey: "revenue", type: "natural" },
  { dataKey: "orders", type: "natural" },
] satisfies DashboardChartSeries[];

const AdminAnalyticsActivityChart = ({
  data,
  referenceDate,
}: AdminAnalyticsActivityChartProps) => {
  return (
    <DashboardChartUI
      title="Marketplace activity"
      description="Orders and paid revenue in the last 90 days"
      descriptionShort="Last 90 days"
      data={data}
      config={chartConfig}
      series={chartSeries}
      tooltipFields={[
        { key: "orders", label: "Orders", format: "number" },
        { key: "revenue", label: "Paid revenue", format: "currency" },
      ]}
      referenceDate={referenceDate.toISOString()}
      defaultRange="30d"
    />
  );
};

export default AdminAnalyticsActivityChart;
