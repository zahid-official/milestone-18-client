import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import ProductHeader from "@/components/modules/vendor/product/ProductHeader";
import ProductTable from "@/components/modules/vendor/product/ProductTable";
import { productCategory, productMaterials } from "@/constants/productCategory";
import { getProducts } from "@/services/vendor/productManagement";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import queryFormatter from "@/utils/queryFormatter";
import { Suspense } from "react";

const categoryOptions = Object.values(productCategory).map((category) => ({
  value: category,
  label: category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

const materialOptions = Object.values(productMaterials).map((material) => ({
  value: material,
  label: material.charAt(0) + material.slice(1).toLowerCase(),
}));

// Interface for IProps
interface IProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ProductManagementPage Component
const ProductManagementPage = async ({ searchParams }: IProps) => {
  const params = (await searchParams) || {};
  const queryString = queryFormatter(params);

  const result = await getProducts(queryString);
  const products = result?.data ?? [];
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
      <header>
        <ProductHeader />
        <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-4">
          <SearchFilter
            placeholder="Search by title or category"
            paramName="searchTerm"
          />
          <SelectFilter
            paramName="category"
            placeholder="Filter by category"
            defaultLabel="All Category"
            options={categoryOptions}
          />
          <SelectFilter
            paramName="specifications.meterials"
            placeholder="Filter by materials"
            defaultLabel="All Materials"
            options={materialOptions}
          />

          <ManagementRefreshButton showLabel={false} />
        </div>
      </header>

      <Suspense
        fallback={<ManagementTableSkeleton columns={9} rows={10} showActions />}
      >
        <ProductTable products={products} />
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

export default ProductManagementPage;
