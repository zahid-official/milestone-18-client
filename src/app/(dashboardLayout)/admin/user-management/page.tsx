import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import UserManagementHeader from "@/components/modules/admin/userManagement/UserManagementHeader";
import UserManagementTable from "@/components/modules/admin/userManagement/UserManagementTable";
import UserManagementViewToggle from "@/components/modules/admin/userManagement/UserManagementViewToggle";
import { userRole } from "@/constants/userRole";
import { getDeletedUsers, getUsers } from "@/services/user/userManagement";
import queryFormatter from "@/utils/queryFormatter";
import { Suspense } from "react";

const roleOptions = Object.values(userRole).map((role) => ({
  value: role,
  label: role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

const accountStatusOptions = ["ACTIVE", "INACTIVE", "BLOCKED"].map((status) => ({
  value: status,
  label: status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

interface IProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// UserManagementPage Component
const UserManagementPage = async ({ searchParams }: IProps) => {
  const params = (await searchParams) || {};
  const viewParam = params?.view;
  const viewValue =
    typeof viewParam === "string"
      ? viewParam
      : Array.isArray(viewParam) && viewParam.length
      ? viewParam[0]
      : undefined;
  const isDeletedView = viewValue === "deleted";

  const apiParams = { ...params };
  delete apiParams.view;
  const queryString = queryFormatter(apiParams);

  const result = isDeletedView
    ? await getDeletedUsers(queryString)
    : await getUsers(queryString);
  const users = result?.data ?? [];
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
        <UserManagementHeader isDeletedView={isDeletedView} />

        <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-4">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search by name, email, phone, address"
          />
          <SelectFilter
            paramName="role"
            placeholder="Filter by role"
            defaultLabel="All roles"
            options={roleOptions}
          />
          <SelectFilter
            paramName="status"
            placeholder="Filter by status"
            defaultLabel="All status"
            options={accountStatusOptions}
          />

          <UserManagementViewToggle isDeletedView={isDeletedView} />
          <ManagementRefreshButton showLabel={false} />
        </div>
      </header>

      <Suspense
        fallback={<ManagementTableSkeleton columns={6} rows={8} showActions />}
      >
        <UserManagementTable
          users={users}
          emptyMessage={
            isDeletedView ? "No deleted users found" : "No users found"
          }
          enableDelete={!isDeletedView}
          enableRestore={isDeletedView}
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

export default UserManagementPage;
