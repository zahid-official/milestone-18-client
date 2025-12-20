import CustomerDashboardCard from "@/components/modules/dashboard/customerDashboard/CustomerDashboardCard";
import CustomerDashboardChart from "@/components/modules/dashboard/customerDashboard/CustomerDashboardChart";
import { getUserOrders } from "@/services/order/orderManagement";

// CustomerDashboardPage Component
const CustomerDashboardPage = async () => {
  const orderResult = await getUserOrders("limit=120");
  const orders = orderResult?.data ?? [];
  const totalOrders = orderResult?.meta?.totalDocs ?? orders.length;

  return (
    <div className="space-y-6 pb-14 lg:px-10 sm:px-3">
      {/* Cards */}
      <div>
        <CustomerDashboardCard orders={orders} totalOrders={totalOrders} />
      </div>

      {/* Chart */}
      <div>
        <CustomerDashboardChart orders={orders} />
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
