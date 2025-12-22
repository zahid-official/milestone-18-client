import CustomerAnalyticsCard from "@/components/modules/customer/customerAnalytics/CustomerAnalyticsCard";
import CustomerAnalyticsChart from "@/components/modules/customer/customerAnalytics/CustomerAnalyticsChart";
import CustomerAnalyticsTable from "@/components/modules/customer/customerAnalytics/CustomerAnalyticsTable";
import { getUserOrders } from "@/services/order/orderManagement";

const CustomerDashboardPage = async () => {
  const orderResult = await getUserOrders("limit=120");
  const orders = orderResult?.data ?? [];
  const totalOrders = orderResult?.meta?.totalDocs ?? orders.length;

  return (
    <div className="space-y-8 pb-14 lg:px-10 sm:px-3">
      <CustomerAnalyticsCard orders={orders} totalOrders={totalOrders} />
      <CustomerAnalyticsChart orders={orders} />
      <CustomerAnalyticsTable orders={orders} />
    </div>
  );
};

export default CustomerDashboardPage;
