import collection from "@/assets/collection-1.jpg";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import { productCategory } from "@/constants/productCategory";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/services/vendor/productManagement";
import { IProduct } from "@/types/product.interface";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const categoryOptions = Object.values(productCategory).map((category) => ({
  value: category,
  label: category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

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
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : meta?.page || 1;
  const totalPages = meta?.totalPage || 1;

  return (
    <section className="">
      <PageBanner
        heading="Our Products"
        subHeading={
          "Discover our exclusive range of products designed to elevate your lifestyle."
        }
      />

      {/* Products */}
      <div className="max-w-7xl w-full mx-auto py-36 sm:space-y-10 space-y-5 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="sm:text-4xl text-3xl font-semibold font-heading">
              Browse Collections
            </h2>
            <p className="text-foreground/60">
              Best Seller and Trending Product
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchFilter
              placeholder="Search by title or category"
              className="max-w-none sm:w-58"
            />
            <SelectFilter
              paramName="category"
              placeholder="Filter by category"
              defaultLabel="All Category"
              options={categoryOptions}
            />
          </div>
        </div>

        <div className="lg:grid grid-cols-3 flex flex-wrap justify-center items-center gap-10">
          {products.length ? (
            products.map((product) => {
              const formattedPrice =
                typeof product.price === "number"
                  ? currencyFormatter.format(product.price)
                  : "Price unavailable";

              return (
                <div
                  key={product._id ?? product.title}
                  className="space-y-3 w-full max-w-sm"
                >
                  <div className="group relative overflow-hidden aspect-square bg-muted">
                    {/* Image */}
                    <Image
                      src={product.thumbnail || collection}
                      alt={product.title || "collection image"}
                      fill
                      sizes="(min-width: 1024px) 320px, 100vw"
                      className="object-cover w-full h-full"
                    />

                    {/* Optional overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

                    {/* Sliding Button */}
                    {product._id ? (
                      <Button
                        asChild
                        className="absolute left-1/2 bottom-8 -translate-x-1/2 translate-y-8 group-hover:translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      >
                        <Link href={`/shop/${product._id}`}>
                          <Eye />
                          View Details
                        </Link>
                      </Button>
                    ) : null}
                  </div>

                  {/* Text */}
                  <div className="pl-2">
                    <h3 className="text-xl font-medium">
                      {product.title || "Untitled Product"}
                    </h3>
                    <p className="text-foreground/70">{formattedPrice}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-center text-foreground/60">
              Products are on the way. Please check back soon.
            </p>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <PaginationFeature currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </section>
  );
};

export default ShopProduct;
