import DashboardCardUI from "@/components/ui/dashboard-card";
import type { IOrder, OrderStatus } from "@/types";
import { Truck, XCircle } from "lucide-react";
import { getOrderAmount } from "@/components/modules/customer/customerAnalytics/orderUtils";

export interface CustomerAnalyticsCardProps {
  orders: IOrder[];
  totalOrders?: number;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const numberFormatter = new Intl.NumberFormat("en-US");

const sumOrderAmounts = (orders: IOrder[]) =>
  orders.reduce((sum, order) => sum + (getOrderAmount(order) ?? 0), 0);

const CustomerAnalyticsCard = ({
  orders,
  totalOrders,
}: CustomerAnalyticsCardProps) => {
  const totalOrderCount = totalOrders ?? orders.length;

  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const paidSpend = sumOrderAmounts(paidOrders);

  const activeDeliveryStatuses: OrderStatus[] = ["CONFIRMED", "IN_PROCESSING"];
  const activeDeliveries = orders.filter((order) =>
    activeDeliveryStatuses.includes(order.orderStatus)
  );
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "CANCELLED"
  );

  const cards = [
    {
      description: "Total Spend",
      value: currencyFormatter.format(paidSpend),
      footerText: "Lifetime paid spend",
      footerSubText: "Total value of paid orders",
    },
    {
      description: "Total Orders",
      value: numberFormatter.format(totalOrderCount),
      footerText: "All orders to date",
      footerSubText: "Lifetime total",
    },
    {
      description: "Active Deliveries",
      value: numberFormatter.format(activeDeliveries.length),
      badgeText: activeDeliveries.length ? "In progress" : undefined,
      badgeIcon: activeDeliveries.length ? Truck : undefined,
      footerText: "Currently in progress",
      footerSubText: "Confirmed or processing",
    },
    {
      description: "Cancelled Orders",
      value: numberFormatter.format(cancelledOrders.length),
      badgeText: cancelledOrders.length ? "Cancelled" : "No cancellations",
      badgeIcon: cancelledOrders.length ? XCircle : undefined,
      footerText: "Cancelled to date",
      footerSubText: "Customer cancellations",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardCardUI
          key={card.description}
          description={card.description}
          value={card.value}
          badgeText={card.badgeText}
          badgeIcon={card.badgeIcon}
          footerText={card.footerText}
          footerSubText={card.footerSubText}
        />
      ))}
    </div>
  );
};

export default CustomerAnalyticsCard;
