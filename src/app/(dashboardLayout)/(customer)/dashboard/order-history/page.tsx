import ManagementHeader from "@/components/modules/dashboard/managementPage/ManagementHeader";
import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import OrderTable from "@/components/modules/customer/order/OrderTable";
import { getUserOrders } from "@/services/order/orderManagement";
import queryFormatter from "@/utils/queryFormatter";
import { Suspense } from "react";

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

const paymentStatusOptions = ["PAID", "UNPAID", "FAILED"].map((status) => ({
  value: status,
  label: status.charAt(0) + status.slice(1).toLowerCase(),
}));

interface IProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// OrderHistoryPage Component
const OrderHistoryPage = async ({ searchParams }: IProps) => {
  const params = (await searchParams) || {};
  const queryString = queryFormatter(params);

  const result = await getUserOrders(queryString);
  const orders = result?.data ?? [];
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
        <ManagementHeader
          title="Order History"
          description="Review your orders, payment status, and delivery updates."
        ></ManagementHeader>

        <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-4">
          <SearchFilter placeholder="Search by product or status" />
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
        fallback={<ManagementTableSkeleton columns={7} rows={8} showActions />}
      >
        <OrderTable orders={orders} />

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

export default OrderHistoryPage;
