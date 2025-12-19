"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import orderColumns from "@/components/modules/customer/order/OrderColumns";
import OrderDetailsViewDialog from "@/components/modules/customer/order/OrderDetailsViewDialog";
import ConfirmDeleteDialog from "@/components/modules/features/ConfirmDeleteDialog";
import { cancelOrder } from "@/services/order/orderManagement";
import { IOrder } from "@/types";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface OrderTableProps {
  orders: IOrder[];
}

// OrderTable Component
const OrderTable = ({ orders }: OrderTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [viewingOrder, setViewingOrder] = useState<IOrder | null>(null);
  const [cancelingOrder, setCancelingOrder] = useState<IOrder | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const getOrderLabel = (order: IOrder | null) => {
    if (!order) return "this order";
    const product =
      order.productId && typeof order.productId === "object"
        ? (order.productId as { title?: string })
        : undefined;
    if (product?.title) return product.title;
    if (order._id) return `Order ${order._id.slice(-6)}`;
    if (typeof order.productId === "string") {
      return `Product ${order.productId.slice(-6)}`;
    }
    return "this order";
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleCancel = (order: IOrder) => {
    if (order.orderStatus === "CANCELLED") {
      toast.info("Order is already cancelled.");
      return;
    }
    if (order.orderStatus === "DELIVERED") {
      toast.error("Delivered orders cannot be cancelled.");
      return;
    }
    setCancelingOrder(order);
  };

  const confirmCancel = async () => {
    if (!cancelingOrder) return;

    const orderId = cancelingOrder._id;
    if (!orderId) {
      toast.error("Order id is missing.");
      return;
    }

    setIsCancelling(true);
    const result = await cancelOrder(orderId);
    setIsCancelling(false);

    if (result.success) {
      toast.success(result.message || "Order cancelled successfully");
      setCancelingOrder(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to cancel order");
    }
  };

  return (
    <>
      <ManagementTable
        data={orders}
        columns={orderColumns}
        onView={(order) => setViewingOrder(order)}
        onDelete={handleCancel}
        deleteLabel="Cancel Order"
        deleteIcon={<Ban className="size-4 text-destructive" />}
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

      <ConfirmDeleteDialog
        open={!!cancelingOrder}
        onOpenChange={(open) => !open && setCancelingOrder(null)}
        onConfirm={confirmCancel}
        title="Cancel Order"
        description={
          <>
            This will cancel{" "}
            <span className="font-semibold text-foreground">
              {getOrderLabel(cancelingOrder)}
            </span>
            . This action cannot be undone.
          </>
        }
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        processingLabel="Canceling..."
        isDeleting={isCancelling}
      />
    </>
  );
};

export default OrderTable;
