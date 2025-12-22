import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import OrderManagementHeader from "@/components/modules/vendor/orderManagement/OrderManagementHeader";
import OrderManagementTable from "@/components/modules/vendor/orderManagement/OrderManagementTable";
import { getOrders } from "@/services/order/orderManagement";
import queryFormatter from "@/utils/queryFormatter";
import { Suspense } from "react";

// Filter options for order status
const orderStatusOptions = [
  "PENDING",
  "CONFIRMED",
  "IN_PROCESSING",
  "DELIVERED",
  "CANCELLED",
].map((status) => ({
  value: status,
  label: status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

// Filter options for payment status
const paymentStatusOptions = ["PAID", "UNPAID", "FAILED"].map((status) => ({
  value: status,
  label: status.charAt(0) + status.slice(1).toLowerCase(),
}));

interface IProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// OrderManagementPage Component
const OrderManagementPage = async ({ searchParams }: IProps) => {
  // Build query string from URL search params
  const params = (await searchParams) || {};
  const queryString = queryFormatter(params);

  // Load vendor orders from the backend
  const result = await getOrders(queryString);
  const orders = result?.data ?? [];
  const meta = result?.meta;

  const pageParam = params?.page;
  const parsedPage =
    typeof pageParam === "string"
      ? Number(pageParam)
      : Array.isArray(pageParam) && pageParam.length
      ? Number(pageParam[0])
      : NaN;

  // Resolve current pagination state
  const currentPage = Number.isFinite(parsedPage)
    ? parsedPage
    : meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <div className="space-y-6 pb-14 sm:px-10">
      <header className="space-y-4">
        <OrderManagementHeader />

        <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-4">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search by order/payment status"
          />
          <SelectFilter
            paramName="orderStatus"
            placeholder="Filter by order status"
            defaultLabel="All status"
            options={orderStatusOptions}
          />
          <SelectFilter
            paramName="paymentStatus"
            placeholder="Filter by payment status"
            defaultLabel="All payments"
            options={paymentStatusOptions}
          />

          <ManagementRefreshButton showLabel={false} />
        </div>
      </header>

      <Suspense
        fallback={<ManagementTableSkeleton columns={8} rows={8} showActions />}
      >
        <OrderManagementTable orders={orders} />

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

export default OrderManagementPage;
