import { IColumn } from "@/components/modules/dashboard/managementPage/ManagementTable";
import { ICoupon } from "@/types";

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
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateRange = (start?: string, end?: string) => {
  const startText = formatDate(start);
  const endText = formatDate(end);
  if (startText === "-" && endText === "-") return "-";
  if (startText === "-") return endText;
  if (endText === "-") return startText;
  return `${startText} - ${endText}`;
};

const formatDiscountValue = (coupon: ICoupon) => {
  if (coupon.discountType === "PERCENTAGE") {
    return `${coupon.discountValue}%`;
  }
  if (coupon.discountType === "FIXED") {
    return currencyFormatter.format(coupon.discountValue);
  }
  return String(coupon.discountValue ?? "-");
};

const renderCodeCell = (coupon: ICoupon) => {
  const title = coupon.title?.trim();
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-semibold tracking-wide">
        {coupon.code || "-"}
      </p>
      {title && (
        <p className="text-xs text-muted-foreground">{title}</p>
      )}
    </div>
  );
};

const renderDiscountCell = (coupon: ICoupon) => {
  const maxDiscount =
    coupon.maxDiscount !== undefined
      ? `Max ${currencyFormatter.format(coupon.maxDiscount)}`
      : null;
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-semibold">{formatDiscountValue(coupon)}</p>
      <p className="text-xs text-muted-foreground">
        {formatLabel(coupon.discountType)}
      </p>
      {maxDiscount && (
        <p className="text-xs text-muted-foreground">{maxDiscount}</p>
      )}
    </div>
  );
};

const renderScopeBadge = (scope?: string) => {
  if (!scope) return "-";
  const className = `${badgeBase} ${
    scopeStyles[scope] || "bg-muted text-foreground"
  }`;
  return <span className={className}>{formatLabel(scope)}</span>;
};

const renderStatusBadge = (isActive?: boolean) => {
  if (typeof isActive !== "boolean") return "-";
  const label = isActive ? "Active" : "Inactive";
  const className = `${badgeBase} ${
    isActive ? statusStyles.active : statusStyles.inactive
  }`;
  return <span className={className}>{label}</span>;
};

const renderUsage = (coupon: ICoupon) => {
  const used = coupon.usedCount ?? 0;
  const limit = coupon.usageLimit;
  const label = limit ? `${used}/${limit}` : `${used}/Unlimited`;
  return <span className="text-sm font-semibold">{label}</span>;
};

// Column definitions for the admin coupon management table
const couponManagementColumns: IColumn<ICoupon>[] = [
  {
    header: "Code",
    accessor: (coupon) => renderCodeCell(coupon),
    className: "min-w-[160px]",
  },
  {
    header: "Discount",
    accessor: (coupon) => renderDiscountCell(coupon),
    className: "min-w-[160px]",
  },
  {
    header: "Scope",
    accessor: (coupon) => renderScopeBadge(coupon.scope),
    className: "min-w-[120px]",
  },
  {
    header: "Status",
    accessor: (coupon) => renderStatusBadge(coupon.isActive),
    className: "min-w-[120px]",
  },
  {
    header: "Usage",
    accessor: (coupon) => renderUsage(coupon),
    className: "min-w-[120px]",
  },
  {
    header: "Valid Dates",
    accessor: (coupon) => formatDateRange(coupon.startDate, coupon.endDate),
    className: "min-w-[160px]",
  },
  {
    header: "Created",
    accessor: (coupon) => formatDate(coupon.createdAt),
    className: "min-w-[120px]",
  },
];

export default couponManagementColumns;
