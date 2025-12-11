import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
import SearchFilter from "@/components/modules/features/SearchFeature";
import ProductHeader from "@/components/modules/vendor/product/ProductHeader";
import ProductTable from "@/components/modules/vendor/product/ProductTable";
import { getProducts } from "@/services/vendor/productManagement";
import { Suspense } from "react";

// ProductManagementPage Component
const ProductManagementPage = async () => {
  const result = await getProducts();
  const products = result?.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <ProductHeader />
        <div className="flex items-center gap-4">
          <SearchFilter placeholder="Search by product title" />

          <ManagementRefreshButton showLabel={false} />
        </div>
      </header>

      <Suspense
        fallback={<ManagementTableSkeleton columns={9} rows={10} showActions />}
      >
        <ProductTable products={products} />
      </Suspense>
    </div>
  );
};

export default ProductManagementPage;
