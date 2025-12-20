"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import orderColumns from "@/components/modules/customer/order/OrderColumns";
import { Button } from "@/components/ui/button";
import type { IOrder } from "@/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CustomerDashboardTableProps {
  orders: IOrder[];
  limit?: number;
}

const getRowKey = (order: IOrder) => {
  if (order._id) return order._id;
  if (order.createdAt) return `${order.createdAt}-${order.quantity}`;
  if (typeof order.productId === "string") return order.productId;
  if (order.productId && typeof order.productId === "object") {
    return String(order.productId._id || order.productId.title || order.quantity);
  }
  return `order-${order.quantity}`;
};

const getOrderTime = (order: IOrder) => {
  if (!order.createdAt) return 0;
  const time = new Date(order.createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const CustomerDashboardTable = ({
  orders,
  limit = 6,
}: CustomerDashboardTableProps) => {
  const recentOrders = [...orders]
    .sort((a, b) => getOrderTime(b) - getOrderTime(a))
    .slice(0, Math.max(limit, 0));

  const dashboardColumns = orderColumns.filter((column) =>
    ["Product", "Total Amount", "Order Status", "Placed On"].includes(
      column.header
    )
  );

  return (
    <div className="rounded-3xl border bg-background p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Most recent 6 orders</h2>
            <p className="text-sm text-muted-foreground">
              Showing your latest orders and their current status.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2"
            >
              View all orders
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <ManagementTable
          data={recentOrders}
          columns={dashboardColumns}
          getRowKey={getRowKey}
          emptyMessage="No recent orders"
        />
      </div>
    </div>
  );
};

export default CustomerDashboardTable;

