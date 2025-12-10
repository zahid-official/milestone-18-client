import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ManagementTableSkeleton from "@/components/modules/dashboard/managementPage/ManagementTableSkeleton";
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
      <div>
        <ProductHeader />
        <ManagementRefreshButton />
      </div>

      <Suspense
        fallback={<ManagementTableSkeleton columns={9} rows={10} showActions />}
      >
        <ProductTable products={products} />
      </Suspense>
    </div>
  );
};

export default ProductManagementPage;
