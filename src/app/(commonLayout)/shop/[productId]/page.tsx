import ProductDetails from "@/components/modules/common/shop/ProductDetails";
import {
  getProductById,
  getProducts,
} from "@/services/vendor/productManagement";
import { IProduct } from "@/types/product.interface";

interface PageProps {
  params: Promise<{ productId: string }>;
}

const ProductDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const productId = resolvedParams?.productId;
  const result = await getProductById(productId);
  const product = result?.success ? result.data ?? null : null;
  let suggestions: IProduct[] = [];

  if (product?.category) {
    const searchParams = new URLSearchParams({
      category: product.category,
      limit: "6",
    });
    const suggestionResult = await getProducts(searchParams.toString());
    suggestions = Array.isArray(suggestionResult?.data)
      ? suggestionResult.data
      : [];
  }

  const filteredSuggestions = suggestions.filter(
    (item) => item._id !== product?._id
  );

  return (
    <div>
      <ProductDetails product={product} suggestions={filteredSuggestions} />
    </div>
  );
};

export default ProductDetailsPage;
