import CustomerDashboardCard from "@/components/modules/dashboard/customerDashboard/CustomerDashboardCard";
import CustomerDashboardChart from "@/components/modules/dashboard/customerDashboard/CustomerDashboardChart";
import CustomerDashboardTable from "@/components/modules/dashboard/customerDashboard/CustomerDashboardTable";
import { getUserOrders } from "@/services/order/orderManagement";

const CustomerDashboardPage = async () => {
  const orderResult = await getUserOrders("limit=120");
  const orders = orderResult?.data ?? [];
  const totalOrders = orderResult?.meta?.totalDocs ?? orders.length;

  return (
    <div className="space-y-8 pb-14 lg:px-10 sm:px-3">
      <CustomerDashboardCard orders={orders} totalOrders={totalOrders} />
      <CustomerDashboardChart orders={orders} />
      <CustomerDashboardTable orders={orders} />
    </div>
  );
};

export default CustomerDashboardPage;
