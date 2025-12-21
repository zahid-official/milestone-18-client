import VendorAnalyticsCard from "@/components/modules/vendor/vendorAnalytics/VendorAnalyticsCard";
import VendorAnalyticsChart from "@/components/modules/vendor/vendorAnalytics/VendorAnalyticsChart";
import VendorAnalyticsTable from "@/components/modules/vendor/vendorAnalytics/VendorAnalyticsTable";
import { getOrders } from "@/services/order/orderManagement";

const VendorDashboardPage = async () => {
  const orderResult = await getOrders("limit=120");
  const orders = orderResult?.data ?? [];
  const totalOrders = orderResult?.meta?.totalDocs ?? orders.length;

  return (
    <div className="space-y-8 pb-14 lg:px-10 sm:px-3">
      <VendorAnalyticsCard orders={orders} totalOrders={totalOrders} />
      <VendorAnalyticsChart orders={orders} />
      <VendorAnalyticsTable orders={orders} />
    </div>
  );
};

export default VendorDashboardPage;
