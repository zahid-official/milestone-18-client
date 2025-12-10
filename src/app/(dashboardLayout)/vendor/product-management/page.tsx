import ManagementRefreshButton from "@/components/modules/dashboard/managementPage/ManagementRefreshButton";
import ProductManagementHeader from "@/components/modules/vendor/product/ProductManagementHeader";

// page Component
const page = () => {
  return (
    <div>
      <ProductManagementHeader />
      <ManagementRefreshButton />
    </div>
  );
};

export default page;
