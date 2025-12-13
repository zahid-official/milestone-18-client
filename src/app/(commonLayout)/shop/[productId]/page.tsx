import ProductDetails from "@/components/modules/common/shop/ProductDetails";
import { getProductById } from "@/services/vendor/productManagement";

interface PageProps {
  params: Promise<{ productId: string }>;
}

const ProductDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const productId = resolvedParams?.productId;
  const result = await getProductById(productId);
  const product = result?.success ? result.data ?? null : null;

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetailsPage;
