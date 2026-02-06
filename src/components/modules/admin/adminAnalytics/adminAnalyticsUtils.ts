import type { IOrder, IOrderUserInfo, IUser, OrderProductSummary } from "@/types";
import { getOrderAmount } from "@/utils/orderUtils";

export type AdminChartPoint = {
  date: string;
  orders: number;
  revenue: number;
};

export type AdminCategoryInsight = {
  label: string;
  count: number;
  share: number;
};

export type AdminVendorInsight = {
  id: string;
  label: string;
  orders: number;
  revenue: number;
};

const getOrderDate = (order: IOrder) => {
  if (!order.createdAt) return null;
  const date = new Date(order.createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
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

const getOrderTime = (order: IOrder) => {
  if (!order.createdAt) return 0;
  const time = new Date(order.createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const getUserTime = (user: IUser) => {
  if (!user.createdAt) return 0;
  const time = new Date(user.createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const getProductSummary = (order: IOrder): OrderProductSummary | undefined => {
  if (order.productId && typeof order.productId === "object") {
    return order.productId as OrderProductSummary;
  }
  return undefined;
};

const getVendorInfo = (order: IOrder): IOrderUserInfo | undefined => {
  if (order.vendorId && typeof order.vendorId === "object") {
    return order.vendorId as IOrderUserInfo;
  }
  return undefined;
};

const formatCategory = (category?: string) => {
  if (!category) return "Uncategorized";
  return category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const getVendorKey = (order: IOrder) => {
  if (typeof order.vendorId === "string") return order.vendorId;
  const vendor = getVendorInfo(order);
  return vendor?._id || vendor?.email || vendor?.name || "unknown";
};

const getVendorLabel = (order: IOrder) => {
  if (typeof order.vendorId === "string") {
    return `Vendor ${order.vendorId.slice(-6)}`;
  }
  const vendor = getVendorInfo(order);
  if (!vendor) return "Unknown vendor";
  return (
    vendor.name ||
    vendor.email ||
    (vendor._id ? `Vendor ${vendor._id.slice(-6)}` : "Unknown vendor")
  );
};

const buildChartData = (orders: IOrder[], days: number) => {
  const resolvedDays = Math.max(days, 1);
  const referenceDate = getLatestOrderDate(orders) ?? new Date();
  const startDate = new Date(referenceDate);
  startDate.setDate(referenceDate.getDate() - (resolvedDays - 1));

  const dataMap = new Map<string, AdminChartPoint>();

  for (let i = 0; i < resolvedDays; i += 1) {
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

  return { data: Array.from(dataMap.values()), referenceDate };
};

const buildCategoryInsights = (
  orders: IOrder[],
  totalOrders: number
): AdminCategoryInsight[] => {
  const categoryMap = new Map<string, number>();

  orders.forEach((order) => {
    const product = getProductSummary(order);
    const category = formatCategory(product?.category);
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
  });

  return Array.from(categoryMap.entries()).map(([label, count]) => ({
    label,
    count,
    share: totalOrders ? Math.round((count / totalOrders) * 100) : 0,
  }));
};

const buildVendorInsights = (orders: IOrder[]): AdminVendorInsight[] => {
  const vendorStats = new Map<
    string,
    { label: string; orders: number; revenue: number }
  >();

  orders.forEach((order) => {
    const key = getVendorKey(order);
    const label = getVendorLabel(order);
    const entry = vendorStats.get(key) || { label, orders: 0, revenue: 0 };
    entry.orders += 1;
    if (order.paymentStatus === "PAID") {
      const amount = getOrderAmount(order);
      if (amount !== undefined) {
        entry.revenue += amount;
      }
    }
    vendorStats.set(key, entry);
  });

  return Array.from(vendorStats.entries()).map(([id, value]) => ({
    id,
    ...value,
  }));
};

const getUniqueProductCount = (orders: IOrder[]) => {
  const productKeys = new Set<string>();

  orders.forEach((order) => {
    if (typeof order.productId === "string") {
      productKeys.add(order.productId);
      return;
    }
    const product = getProductSummary(order);
    if (product?._id) {
      productKeys.add(product._id);
      return;
    }
    if (product?.title) {
      productKeys.add(product.title);
    }
  });

  return productKeys.size;
};

const getRecentOrders = (orders: IOrder[], limit: number) => {
  const resolvedLimit = Math.max(limit, 0);
  return [...orders]
    .sort((a, b) => getOrderTime(b) - getOrderTime(a))
    .slice(0, resolvedLimit);
};

const getRecentUsers = (users: IUser[], limit: number) => {
  const resolvedLimit = Math.max(limit, 0);
  return [...users]
    .sort((a, b) => getUserTime(b) - getUserTime(a))
    .slice(0, resolvedLimit);
};

export {
  buildCategoryInsights,
  buildChartData,
  buildVendorInsights,
  getRecentOrders,
  getRecentUsers,
  getUniqueProductCount,
};
