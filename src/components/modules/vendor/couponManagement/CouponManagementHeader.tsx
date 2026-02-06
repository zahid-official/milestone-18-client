"use client";

import CouponManagementFormDialog from "@/components/modules/admin/couponManagement/CouponManagementFormDialog";
import ManagementHeader from "@/components/modules/dashboard/managementPage/ManagementHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

// CouponManagementHeader Component (vendor)
const CouponManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      {isDialogOpen && (
        <CouponManagementFormDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      <ManagementHeader
        title="Coupon Management"
        description="Create coupons for your storefront and track their usage."
        action={{
          label: "Create Coupon",
          icon: Plus,
          onClick: () => setIsDialogOpen(true),
        }}
      />
    </>
  );
};

export default CouponManagementHeader;
