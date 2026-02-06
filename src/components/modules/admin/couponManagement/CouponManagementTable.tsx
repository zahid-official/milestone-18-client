"use client";

import CouponManagementColumns from "@/components/modules/admin/couponManagement/CouponManagementColumns";
import CouponManagementDetailsViewDialog from "@/components/modules/admin/couponManagement/CouponManagementDetailsViewDialog";
import CouponManagementFormDialog from "@/components/modules/admin/couponManagement/CouponManagementFormDialog";
import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import ConfirmDeleteDialog from "@/components/modules/features/ConfirmDeleteDialog";
import { deleteCoupon } from "@/services/coupon/couponManagement";
import { ICoupon, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CouponManagementTableProps {
  coupons: ICoupon[];
  currentUserId?: string | null;
  currentUserRole?: UserRole | null;
}

const getRowKey = (coupon: ICoupon) =>
  coupon._id || coupon.code || coupon.title || "coupon-row";

const getCreatedById = (coupon: ICoupon) => {
  const createdBy = coupon.createdBy as
    | string
    | { _id?: string }
    | undefined;
  if (typeof createdBy === "string") return createdBy;
  if (createdBy && typeof createdBy === "object") {
    return typeof createdBy._id === "string" ? createdBy._id : undefined;
  }
  return undefined;
};

// CouponManagementTable Component
const CouponManagementTable = ({
  coupons,
  currentUserId,
  currentUserRole,
}: CouponManagementTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [viewingCoupon, setViewingCoupon] = useState<ICoupon | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<ICoupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const canEdit = (coupon: ICoupon) => {
    if (!currentUserRole) return false;

    if (coupon.scope === "GLOBAL") {
      return currentUserRole === "ADMIN";
    }

    if (coupon.scope === "VENDOR") {
      return currentUserRole === "VENDOR";
    }

    return false;
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (coupon: ICoupon) => {
    setDeletingCoupon(coupon);
  };

  const confirmDelete = async () => {
    if (!deletingCoupon?._id) {
      toast.error("Coupon id is missing.");
      return;
    }

    setIsDeleting(true);
    const result = await deleteCoupon(deletingCoupon._id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || "Coupon deleted successfully.");
      setDeletingCoupon(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete coupon.");
    }
  };

  return (
    <>
      <ManagementTable
        data={coupons}
        columns={CouponManagementColumns}
        onView={(coupon) => setViewingCoupon(coupon)}
        onEdit={(coupon) => setEditingCoupon(coupon)}
        onDelete={(coupon) => handleDelete(coupon)}
        isEditDisabled={(coupon) => !canEdit(coupon)}
        getRowKey={getRowKey}
        emptyMessage="No coupons found"
        viewLabel="View Details"
        editLabel="Edit Coupon"
        deleteLabel="Delete Coupon"
      />

      {viewingCoupon && (
        <CouponManagementDetailsViewDialog
          open={!!viewingCoupon}
          onClose={() => setViewingCoupon(null)}
          coupon={viewingCoupon}
        />
      )}

      {editingCoupon && (
        <CouponManagementFormDialog
          key={editingCoupon?._id ?? "edit-coupon"}
          open={!!editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSuccess={() => {
            setEditingCoupon(null);
            handleRefresh();
          }}
          coupon={editingCoupon}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deletingCoupon}
        onOpenChange={(open) => !open && setDeletingCoupon(null)}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        itemName={deletingCoupon?.code}
        isDeleting={isDeleting}
        confirmLabel="Delete Coupon"
        processingLabel="Deleting coupon..."
      />
    </>
  );
};

export default CouponManagementTable;
