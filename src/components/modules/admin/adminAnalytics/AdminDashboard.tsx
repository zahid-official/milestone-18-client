import AdminAnalyticsActivityChart from "@/components/modules/admin/adminAnalytics/AdminAnalyticsActivityChart";
import AdminAnalyticsHeader from "@/components/modules/admin/adminAnalytics/AdminAnalyticsHeader";
import AdminAnalyticsMarketplaceMix from "@/components/modules/admin/adminAnalytics/AdminAnalyticsMarketplaceMix";
import AdminAnalyticsOperationsSnapshot from "@/components/modules/admin/adminAnalytics/AdminAnalyticsOperationsSnapshot";
import AdminAnalyticsRecentOrders from "@/components/modules/admin/adminAnalytics/AdminAnalyticsRecentOrders";
import AdminAnalyticsRecentUsers from "@/components/modules/admin/adminAnalytics/AdminAnalyticsRecentUsers";
import AdminAnalyticsStats from "@/components/modules/admin/adminAnalytics/AdminAnalyticsStats";
import {
  buildCategoryInsights,
  buildChartData,
  buildVendorInsights,
  getRecentOrders,
  getRecentUsers,
  getUniqueProductCount,
} from "@/components/modules/admin/adminAnalytics/adminAnalyticsUtils";
import { getOrders } from "@/services/order/orderManagement";
import { getUsers } from "@/services/user/userManagement";
import { getProducts } from "@/services/vendor/productManagement";
import { getOrderAmount } from "@/utils/orderUtils";
import type { IOrder } from "@/types";
import { CircleDollarSign, Package, Store, Users } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const numberFormatter = new Intl.NumberFormat("en-US");

const openStatuses: IOrder["orderStatus"][] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROCESSING",
];

const AdminDashboard = async () => {
  // Load summary datasets in parallel for the dashboard KPIs.
  const [ordersResult, usersResult, vendorResult, customerResult, productsResult] =
    await Promise.all([
      getOrders("limit=200"),
      getUsers("limit=60"),
      getUsers("role=VENDOR&limit=1"),
      getUsers("role=CUSTOMER&limit=1"),
      getProducts("limit=1"),
    ]);

  const orders = ordersResult?.data ?? [];
  const users = usersResult?.data ?? [];

  const totalOrders = ordersResult?.meta?.totalDocs ?? orders.length;
  const totalUsers = usersResult?.meta?.totalDocs ?? users.length;
  const totalVendors =
    vendorResult?.meta?.totalDocs ?? vendorResult?.data?.length ?? 0;
  const totalCustomers =
    customerResult?.meta?.totalDocs ?? customerResult?.data?.length ?? 0;
  const totalProducts =
    productsResult?.meta?.totalDocs ?? productsResult?.data?.length ?? 0;

  // Revenue and order status aggregates for cards and insights.
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const paidRevenue = paidOrders.reduce(
    (sum, order) => sum + (getOrderAmount(order) ?? 0),
    0
  );
  const averagePaidOrder =
    paidOrders.length > 0 ? paidRevenue / paidOrders.length : 0;

  const openOrders = orders.filter((order) =>
    openStatuses.includes(order.orderStatus)
  );
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  );
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "CANCELLED"
  );
  const paymentIssues = orders.filter((order) =>
    ["UNPAID", "FAILED"].includes(order.paymentStatus ?? "")
  );

  const deliveryRate = totalOrders
    ? Math.round((deliveredOrders.length / totalOrders) * 100)
    : 0;

  const uniqueProducts = getUniqueProductCount(orders);
  const ordersWithVendor = orders.filter((order) => Boolean(order.vendorId))
    .length;

  // Derived insights for the right-hand cards and mix panel.
  const topCategories = buildCategoryInsights(orders, totalOrders)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const topVendors = buildVendorInsights(orders)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 4);

  // Trend chart and recency tables.
  const { data: chartData, referenceDate } = buildChartData(orders, 90);
  const recentOrders = getRecentOrders(orders, 6);
  const recentUsers = getRecentUsers(users, 6);

  // Dashboard KPI cards.
  const cards = [
    {
      description: "Paid Revenue",
      value: currencyFormatter.format(paidRevenue),
      badgeText: paidOrders.length ? "Paid orders" : "No paid orders",
      badgeIcon: CircleDollarSign,
      footerText:
        paidOrders.length > 0
          ? `Avg order ${currencyFormatter.format(averagePaidOrder)}`
          : "Awaiting first paid order",
      footerSubText: `${numberFormatter.format(paidOrders.length)} paid orders`,
    },
    {
      description: "Total Orders",
      value: numberFormatter.format(totalOrders),
      badgeText: deliveryRate ? `${deliveryRate}% delivered` : "No deliveries yet",
      badgeIcon: Package,
      footerText: `${numberFormatter.format(openOrders.length)} open orders`,
      footerSubText: `${numberFormatter.format(deliveredOrders.length)} delivered, ${numberFormatter.format(cancelledOrders.length)} cancelled`,
    },
    {
      description: "Total Customers",
      value: numberFormatter.format(totalCustomers),
      badgeText: totalCustomers ? "Active customers" : "No customers",
      badgeIcon: Users,
      footerText: `${numberFormatter.format(totalUsers)} total users`,
      footerSubText: `${numberFormatter.format(totalVendors)} vendors onboarded`,
    },
    {
      description: "Total Vendors",
      value: numberFormatter.format(totalVendors),
      badgeText: ordersWithVendor ? "Active vendors" : "No vendor orders",
      badgeIcon: Store,
      footerText: `${numberFormatter.format(ordersWithVendor)} orders assigned`,
      footerSubText: "Track vendor fulfillment and SLAs",
    },
    {
      description: "Total Products",
      value: numberFormatter.format(totalProducts),
      badgeText: totalProducts ? "Catalog size" : "No products",
      badgeIcon: Package,
      footerText: totalProducts ? "Active listings" : "Catalog empty",
      footerSubText: "Across all vendors",
    },
    {
      description: "Products Ordered",
      value: numberFormatter.format(uniqueProducts),
      badgeText: uniqueProducts ? "Catalog activity" : "No products yet",
      badgeIcon: Package,
      footerText: topCategories[0]?.label || "No category data",
      footerSubText: topCategories[0]
        ? `${numberFormatter.format(topCategories[0].count)} orders`
        : "Products will appear once orders land",
    },
  ];

  return (
    <div className="space-y-8 pb-14 sm:px-10">
      <AdminAnalyticsHeader />
      <AdminAnalyticsStats cards={cards} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <AdminAnalyticsActivityChart
          data={chartData}
          referenceDate={referenceDate}
        />
        <div className="grid lg:grid-cols-2 gap-6">
          <AdminAnalyticsOperationsSnapshot
            openOrders={openOrders.length}
            paymentIssues={paymentIssues.length}
            cancelledOrders={cancelledOrders.length}
          />
          <AdminAnalyticsMarketplaceMix
            topCategories={topCategories}
            topVendors={topVendors}
          />
        </div>
      </section>

      <section className="space-y-8">
        <AdminAnalyticsRecentOrders orders={recentOrders} />
        <AdminAnalyticsRecentUsers users={recentUsers} />
      </section>
    </div>
  );
};

export default AdminDashboard;
