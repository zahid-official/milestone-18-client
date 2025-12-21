"use client";

import ManagementHeader from "@/components/modules/dashboard/managementPage/ManagementHeader";

// OrderManagementHeader Component
const OrderManagementHeader = () => {
  return (
    // Reuse management header with vendor-specific copy
    <ManagementHeader
      title="Order Management"
      description="Track incoming orders and keep fulfillment up to date."
    />
  );
};

export default OrderManagementHeader;
