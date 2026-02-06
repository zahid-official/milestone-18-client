"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import OrderOverviewDetailsViewDialog from "@/components/modules/admin/orderOverview/OrderOverviewDetailsViewDialog";
import orderOverviewColumns from "@/components/modules/admin/orderOverview/OrderOverviewColumns";
import { IOrder } from "@/types";
import { useState } from "react";

interface OrderOverviewTableProps {
  orders: IOrder[];
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

// OrderOverviewTable Component
const OrderOverviewTable = ({ orders }: OrderOverviewTableProps) => {
  const [viewingOrder, setViewingOrder] = useState<IOrder | null>(null);

  return (
    <>
      <ManagementTable
        data={orders}
        columns={orderOverviewColumns}
        onView={(order) => setViewingOrder(order)}
        getRowKey={getRowKey}
        emptyMessage="No orders found"
        viewLabel="View Details"
      />

      {viewingOrder && (
        <OrderOverviewDetailsViewDialog
          open={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          order={viewingOrder}
        />
      )}
    </>
  );
};

export default OrderOverviewTable;
