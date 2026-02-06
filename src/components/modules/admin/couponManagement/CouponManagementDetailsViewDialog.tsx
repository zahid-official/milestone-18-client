"use client";

import InfoRow from "@/components/modules/dashboard/managementPage/InfoRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ICoupon } from "@/types";
import { Calendar, Receipt, ShieldCheck, Tag } from "lucide-react";

interface CouponManagementDetailsViewDialogProps {
  open: boolean;
  onClose: () => void;
  coupon: ICoupon | null;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const badgeBase =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100",
  inactive: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100",
};

const scopeStyles: Record<string, string> = {
  GLOBAL: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-100",
  VENDOR: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100",
};

const formatLabel = (value?: string) => {
  if (!value) return "Unknown";
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDiscountValue = (coupon: ICoupon) => {
  if (coupon.discountType === "PERCENTAGE") {
    return `${coupon.discountValue}%`;
  }
  if (coupon.discountType === "FIXED") {
    return currencyFormatter.format(coupon.discountValue);
  }
  return String(coupon.discountValue ?? "N/A");
};

const renderStatusBadge = (isActive?: boolean) => {
  if (typeof isActive !== "boolean") {
    return <span className={`${badgeBase} bg-muted text-foreground`}>Unknown</span>;
  }
  const label = isActive ? "Active" : "Inactive";
  const className = `${badgeBase} ${
    isActive ? statusStyles.active : statusStyles.inactive
  }`;
  return <span className={className}>{label}</span>;
};

const renderScopeBadge = (scope?: string) => {
  if (!scope) return "-";
  const className = `${badgeBase} ${
    scopeStyles[scope] || "bg-muted text-foreground"
  }`;
  return <span className={className}>{formatLabel(scope)}</span>;
};

// CouponManagementDetailsViewDialog Component
const CouponManagementDetailsViewDialog = ({
  open,
  onClose,
  coupon,
}: CouponManagementDetailsViewDialogProps) => {
  if (!coupon) {
    return null;
  }

  const usageLimitLabel =
    coupon.usageLimit !== undefined ? String(coupon.usageLimit) : "Unlimited";
  const usedCountLabel =
    coupon.usedCount !== undefined ? String(coupon.usedCount) : "0";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto border-0 bg-background p-0 shadow-2xl">
        <DialogHeader className="sm:px-8 px-4 pt-8">
          <DialogTitle className="text-2xl font-semibold">
            Coupon Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-4 pb-6 sm:px-6 sm:pb-6">
          <div className="rounded-xl border bg-card/50 p-4 shadow-sm space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase">
              {renderStatusBadge(coupon.isActive)}
              {renderScopeBadge(coupon.scope)}
            </div>
            <p className="text-xl font-semibold tracking-wide">
              {coupon.code}
            </p>
            {coupon.title && (
              <p className="text-sm text-muted-foreground">{coupon.title}</p>
            )}
          </div>

          <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Tag className="size-4 text-muted-foreground" />
              Discount
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Discount Type" value={formatLabel(coupon.discountType)} />
              <InfoRow label="Discount Value" value={formatDiscountValue(coupon)} />
              <InfoRow
                label="Max Discount"
                value={
                  coupon.maxDiscount !== undefined
                    ? currencyFormatter.format(coupon.maxDiscount)
                    : "N/A"
                }
              />
              <InfoRow
                label="Minimum Order"
                value={
                  coupon.minOrderAmount !== undefined
                    ? currencyFormatter.format(coupon.minOrderAmount)
                    : "N/A"
                }
              />
              <InfoRow
                label="Minimum Quantity"
                value={
                  coupon.minQuantity !== undefined
                    ? String(coupon.minQuantity)
                    : "N/A"
                }
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Receipt className="size-4 text-muted-foreground" />
              Usage
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Usage Limit" value={usageLimitLabel} />
              <InfoRow label="Used Count" value={usedCountLabel} />
            </div>
          </div>

          <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Calendar className="size-4 text-muted-foreground" />
              Validity
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Start Date" value={formatDate(coupon.startDate)} />
              <InfoRow label="End Date" value={formatDate(coupon.endDate)} />
              <InfoRow label="Created On" value={formatDate(coupon.createdAt)} />
              <InfoRow label="Updated On" value={formatDate(coupon.updatedAt)} />
            </div>
          </div>

          <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4 text-muted-foreground" />
              Ownership
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Coupon ID" value={coupon._id} />
              <InfoRow label="Vendor ID" value={coupon.vendorId} />
              <InfoRow label="Created By" value={coupon.createdBy} />
            </div>
          </div>

          {coupon.description && (
            <div className="rounded-xl border bg-card/50 p-4 shadow-sm space-y-2">
              <div className="text-sm font-semibold">Description</div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {coupon.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponManagementDetailsViewDialog;
