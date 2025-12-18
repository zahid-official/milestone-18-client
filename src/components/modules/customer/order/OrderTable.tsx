"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import orderColumns from "@/components/modules/customer/order/OrderColumns";
import OrderDetailsViewDialog from "@/components/modules/customer/order/OrderDetailsViewDialog";
import { IOrder } from "@/types";
import { useState } from "react";

interface OrderTableProps {
  orders: IOrder[];
}

// OrderTable Component
const OrderTable = ({ orders }: OrderTableProps) => {
  const [viewingOrder, setViewingOrder] = useState<IOrder | null>(null);

  const getRowKey = (order: IOrder) => {
    if (order._id) return order._id;
    if (order.createdAt) return `${order.createdAt}-${order.quantity}`;
    if (typeof order.productId === "string") return order.productId;
    if (order.productId && typeof order.productId === "object") {
      return String(
        order.productId._id || order.productId.title || order.quantity
      );
    }
    return `order-${order.quantity}`;
  };

  return (
    <>
      <ManagementTable
        data={orders}
        columns={orderColumns}
        onView={(order) => setViewingOrder(order)}
        getRowKey={getRowKey}
        emptyMessage="No orders found"
      />

      {viewingOrder && (
        <OrderDetailsViewDialog
          open={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          order={viewingOrder}
        />
      )}
    </>
  );
};

export default OrderTable;
