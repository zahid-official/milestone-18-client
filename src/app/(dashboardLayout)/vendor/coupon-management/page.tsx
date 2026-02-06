import CouponManagementTable from "@/components/modules/admin/couponManagement/CouponManagementTable";
import CouponManagementHeader from "@/components/modules/vendor/couponManagement/CouponManagementHeader";
import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import { getCoupons } from "@/services/coupon/couponManagement";
import getUserInfo from "@/utils/getUserInfo";
import queryFormatter from "@/utils/queryFormatter";
import { Suspense } from "react";

const discountTypeOptions = ["PERCENTAGE", "FIXED"].map((type) => ({
  value: type,
  label: type
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

interface IProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// VendorCouponManagePage Component
const VendorCouponManagePage = async ({ searchParams }: IProps) => {
  const params = (await searchParams) || {};
  const queryString = queryFormatter(params);

  const userInfo = await getUserInfo();
  const currentUserId = userInfo?._id ?? null;
  const currentUserRole = userInfo?.role ?? "VENDOR";

  const result = await getCoupons(queryString);
  const coupons = result?.data ?? [];
  const meta = result?.meta;

  const pageParam = params?.page;
  const parsedPage =
    typeof pageParam === "string"
      ? Number(pageParam)
      : Array.isArray(pageParam) && pageParam.length
      ? Number(pageParam[0])
      : NaN;

  const currentPage = Number.isFinite(parsedPage)
    ? parsedPage
    : meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <div className="space-y-6 pb-14 sm:px-10">
      <header className="space-y-4">
        <CouponManagementHeader />

        <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-4">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search by code or title"
          />
          <SelectFilter
            paramName="discountType"
            placeholder="Filter by discount type"
            defaultLabel="All types"
            options={discountTypeOptions}
          />
          <SelectFilter
            paramName="isActive"
            placeholder="Filter by status"
            defaultLabel="All status"
            options={statusOptions}
          />
          <ManagementRefreshButton showLabel={false} />
        </div>
      </header>

      <Suspense
        fallback={<ManagementTableSkeleton columns={8} rows={8} showActions />}
      >
        <CouponManagementTable
          coupons={coupons}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
        <div className="mt-6 flex justify-center">
          <PaginationFeature
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default VendorCouponManagePage;
