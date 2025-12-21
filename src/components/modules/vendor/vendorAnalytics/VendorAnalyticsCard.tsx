import DashboardCardUI from "@/components/ui/dashboard-card";
import type { IOrder, OrderStatus } from "@/types";
import { Truck, XCircle } from "lucide-react";
import { getOrderAmount } from "@/utils/orderUtils";

export interface VendorAnalyticsCardProps {
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

const VendorAnalyticsCard = ({
  orders,
  totalOrders,
}: VendorAnalyticsCardProps) => {
  const totalOrderCount = totalOrders ?? orders.length;

  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const paidRevenue = sumOrderAmounts(paidOrders);
  const averagePaidOrder =
    paidOrders.length > 0 ? paidRevenue / paidOrders.length : 0;

  const fulfillmentStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "IN_PROCESSING",
  ];
  const fulfillmentQueue = orders.filter((order) =>
    fulfillmentStatuses.includes(order.orderStatus)
  );
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  );
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "CANCELLED"
  );
  const deliveryRate = totalOrderCount
    ? Math.round((deliveredOrders.length / totalOrderCount) * 100)
    : 0;

  const cards = [
    {
      description: "Paid Revenue",
      value: currencyFormatter.format(paidRevenue),
      footerText: "Paid orders total",
      footerSubText:
        paidOrders.length > 0
          ? `Avg order ${currencyFormatter.format(averagePaidOrder)}`
          : "No paid orders yet",
    },
    {
      description: "Total Orders",
      value: numberFormatter.format(totalOrderCount),
      footerText: `${numberFormatter.format(deliveredOrders.length)} delivered`,
      footerSubText: totalOrderCount
        ? `${deliveryRate}% delivery rate`
        : "Delivery rate will appear here",
    },
    {
      description: "Fulfillment Queue",
      value: numberFormatter.format(fulfillmentQueue.length),
      badgeText: fulfillmentQueue.length ? "Needs action" : "All caught up",
      badgeIcon: fulfillmentQueue.length ? Truck : undefined,
      footerText: "Pending or processing",
      footerSubText: "Confirm, pack, and ship",
    },
    {
      description: "Cancelled Orders",
      value: numberFormatter.format(cancelledOrders.length),
      badgeText: cancelledOrders.length ? "Cancelled" : "No cancellations",
      badgeIcon: cancelledOrders.length ? XCircle : undefined,
      footerText: "Orders cancelled",
      footerSubText: "Monitor repeat issues",
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

export default VendorAnalyticsCard;
