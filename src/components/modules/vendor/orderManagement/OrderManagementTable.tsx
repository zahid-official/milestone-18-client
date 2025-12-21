"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import OrderManagementDetailsViewDialog from "@/components/modules/vendor/orderManagement/OrderManagementDetailsViewDialog";
import orderManagementColumns from "@/components/modules/vendor/orderManagement/OrderManagementColumns";
import {
  markOrderDelivered,
  markOrderInProgress,
} from "@/services/order/orderManagement";
import { IOrder } from "@/types";
import { CheckCircle2, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface OrderManagementTableProps {
  orders: IOrder[];
}

type StatusAction = "in-progress" | "delivered";

const getRowKey = (order: IOrder) => {
  if (order._id) return order._id;
  if (order.createdAt) return `${order.createdAt}-${order.quantity}`;
  if (typeof order.productId === "string") return order.productId;
  if (order.productId && typeof order.productId === "object") {
    return String(order.productId._id || order.productId.title || order.quantity);
  }
  return `order-${order.quantity}`;
};

// OrderManagementTable Component
const OrderManagementTable = ({ orders }: OrderManagementTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [viewingOrder, setViewingOrder] = useState<IOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<{
    id: string;
    action: StatusAction;
  } | null>(null);

  // Refresh the current route after status updates
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Guard and apply vendor status transitions for an order
  const updateOrderStatus = async (order: IOrder, action: StatusAction) => {
    // Avoid overlapping transitions for the same list
    if (updatingStatus) {
      toast.info("An order update is already in progress.");
      return;
    }

    // Terminal or cancelled orders cannot be transitioned
    if (order.orderStatus === "CANCELLED") {
      toast.error("Cancelled orders cannot be updated.");
      return;
    }

    if (action === "in-progress") {
      if (order.orderStatus === "IN_PROCESSING") {
        toast.info("Order is already in progress.");
        return;
      }
      if (order.orderStatus !== "CONFIRMED") {
        toast.error("Only confirmed orders can be updated.");
        return;
      }
    }

    if (action === "delivered") {
      if (order.orderStatus === "DELIVERED") {
        toast.info("Order is already delivered.");
        return;
      }
      if (order.orderStatus !== "IN_PROCESSING") {
        toast.error("Only in-progress orders can be delivered.");
        return;
      }
    }

    if (order.orderStatus === "DELIVERED") {
      toast.error("Delivered orders cannot be updated.");
      return;
    }

    // Ensure a valid order id before issuing the request
    const orderId = order._id;
    if (!orderId) {
      toast.error("Order id is missing.");
      return;
    }

    // Perform backend transition
    setUpdatingStatus({ id: orderId, action });
    const result =
      action === "in-progress"
        ? await markOrderInProgress(orderId)
        : await markOrderDelivered(orderId);
    setUpdatingStatus(null);

    if (result.success) {
      const nextStatus =
        action === "in-progress" ? "IN_PROCESSING" : "DELIVERED";
      setViewingOrder((current) =>
        current && current._id === orderId
          ? { ...current, orderStatus: nextStatus }
          : current
      );
      toast.success(result.message || "Order status updated.");
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to update order status.");
    }
  };

  return (
    <>
      <ManagementTable
        data={orders}
        columns={orderManagementColumns}
        onView={(order) => setViewingOrder(order)}
        onEdit={(order) => updateOrderStatus(order, "in-progress")}
        onDelete={(order) => updateOrderStatus(order, "delivered")}
        // Enable actions only when the current status allows a transition
        isEditDisabled={(order) => {
          if (updatingStatus) return true;
          return order.orderStatus !== "CONFIRMED";
        }}
        isDeleteDisabled={(order) => {
          if (updatingStatus) return true;
          return order.orderStatus !== "IN_PROCESSING";
        }}
        getRowKey={getRowKey}
        emptyMessage="No orders found"
        viewLabel="View Details"
        editLabel="Mark In Progress"
        editIcon={<Clock3 className="size-4 text-indigo-600" />}
        deleteLabel="Mark Delivered"
        deleteIcon={<CheckCircle2 className="size-4 text-emerald-600" />}
      />

      {viewingOrder && (
        <OrderManagementDetailsViewDialog
          open={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          order={viewingOrder}
        />
      )}
    </>
  );
};

export default OrderManagementTable;
