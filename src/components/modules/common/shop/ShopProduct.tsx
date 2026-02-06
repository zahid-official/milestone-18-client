import { getProducts } from "@/services/vendor/productManagement";
import { IProduct } from "@/types/product.interface";
import ShopProductClient from "./ShopProductClient";

interface ShopProductProps {
  queryString?: string;
}

// ShopProduct Component
const ShopProduct = async ({ queryString }: ShopProductProps) => {
  const result = await getProducts(queryString || "limit=9");
  const products: IProduct[] = Array.isArray(result?.data) ? result.data : [];
  const meta = result?.meta;
  const params = new URLSearchParams(queryString || "");
  const pageParam = params.get("page");
  const parsedPage = pageParam ? Number(pageParam) : NaN;
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <section className="">
      {/* <PageBanner
        heading="Our Products"
        subHeading={
          "Discover our exclusive range of products designed to elevate your lifestyle."
        }
      /> */}
      <ShopProductClient
        products={products}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
};

export default ShopProduct;
