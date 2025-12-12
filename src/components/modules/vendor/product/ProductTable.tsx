"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import ConfirmDeleteDialog from "@/components/modules/features/ConfirmDeleteDialog";
import productColumns from "@/components/modules/vendor/product/ProductColumns";
import { deleteProduct } from "@/services/vendor/productManagement";
import { IProduct } from "@/types/product.interface";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProductTableProps {
  products: IProduct[];
}

// ProductTable Component
const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  // Refresh the current route after actions complete
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Open delete confirmation dialog for the selected product
  const handleDelete = (product: IProduct) => {
    setDeletingProduct(product);
  };

  // Confirm deletion and trigger backend call
  const confirmDelete = async () => {
    if (!deletingProduct) return;

    const productId = deletingProduct._id;
    if (!productId) {
      toast.error("Product id is missing.");
      return;
    }

    setIsDeletingDialog(true);
    const result = await deleteProduct(productId);
    setIsDeletingDialog(false);

    if (result.success) {
      toast.success(result.message || "Product deleted successfully");
      setDeletingProduct(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete product");
    }
  };

  return (
    <>
      <ManagementTable
        data={products}
        columns={productColumns}
        onDelete={handleDelete}
        getRowKey={(product) => product._id || product.title}
        emptyMessage="No products found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        itemName={deletingProduct?.title}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default ProductTable;
