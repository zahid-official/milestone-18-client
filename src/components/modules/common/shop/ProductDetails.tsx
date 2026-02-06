import collection from "@/assets/collection-1.jpg";
import { Button } from "@/components/ui/button";
import { IProduct, IProductSpecifications } from "@/types/product.interface";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartSection from "./AddToCartSection";

interface ProductDetailsProps {
  product: IProduct | null;
  suggestions?: IProduct[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCategory = (category?: string) => {
  if (!category) return "Uncategorized";
  return category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const formatMaterials = (specs?: IProductSpecifications) => {
  const materials = specs?.materials ?? specs?.meterials;
  if (!materials) return "Not mentioned";
  return Array.isArray(materials) ? materials.join(", ") : materials.toString();
};

const ProductDetails = ({ product, suggestions = [] }: ProductDetailsProps) => {
  if (!product) {
    return (
      <div className="py-20 sm:py-36">
        <div className="max-w-7xl w-full mx-auto py-20 sm:py-28 px-4">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-2xl border border-dashed border-muted/70 bg-background/70 px-6 py-10 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Package className="h-10 w-10 text-foreground/70" aria-hidden />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Product not found</h2>
              <p className="text-base text-foreground/70">
                Please return to the shop to explore available items.
              </p>
            </div>
            <Button asChild className="h-11 px-6">
              <Link href="/shop">Back to shop</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isInStock = typeof product.stock === "number" && product.stock > 0;
  const formattedPrice =
    typeof product.price === "number"
      ? currencyFormatter.format(product.price)
      : "Price unavailable";
  const specs = product.specifications;
  const relatedProducts = suggestions
    .filter((item) => item._id !== product._id)
    .slice(0, 4);

  return (
    <div className="bg-muted/30">
      <div className="max-w-7xl w-full mx-auto py-20 sm:py-32 space-y-12 px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="w-full max-w-sm mx-auto drop-shadow-lg">
            <Image
              src={product?.thumbnail || collection}
              alt={product?.title || "product image"}
              width={480}
              height={480}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <div className="space-y-6 lg:pl-6">
            <div className="space-y-3 max-lg:text-center">
              <div className="inline-flex uppercase items-center gap-2 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {formatCategory(product?.category)}
              </div>
              <h2 className="sm:text-4xl text-3xl font-semibold leading-tight">
                {product?.title}
              </h2>
              <p className="text-2xl font-semibold text-primary">
                {formattedPrice}
              </p>
            </div>

            <p className="text-base max-lg:text-center leading-relaxed text-foreground/70">
              {product?.description || "No description provided."}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background p-4 space-y-2 shadow-sm">
                <p className="text-sm text-foreground/60">Availability</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isInStock ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {isInStock ? `${product?.stock} in stock` : "Stock Out"}
                </p>
              </div>
              <div className="bg-background uppercase p-4 space-y-2 shadow-sm">
                <p className="text-sm text-foreground/60">Category</p>
                <p className="text-lg font-semibold">
                  {formatCategory(product?.category)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <AddToCartSection product={product} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-background p-6 shadow-sm space-y-3">
            <h2 className="text-2xl font-semibold">Product Overview</h2>
            <p className="text-foreground/70 leading-relaxed">
              {product?.productOverview || "No overview provided."}
            </p>
          </div>

          <div className="bg-background p-6 shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold">Specifications</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Height</dt>
                <dd className="text-base font-semibold">
                  {specs?.height ? `${specs.height} cm` : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Weight</dt>
                <dd className="text-base font-semibold">
                  {specs?.weight ? `${specs.weight} kg` : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Width</dt>
                <dd className="text-base font-semibold">
                  {specs?.width ? `${specs.width} cm` : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Length</dt>
                <dd className="text-base font-semibold">
                  {specs?.length ? `${specs.length} cm` : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Materials</dt>
                <dd className="text-base font-semibold">
                  {formatMaterials(specs)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6 pt-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h2 className="sm:text-4xl text-3xl font-semibold">
                Similar Products
              </h2>
              <p className="text-foreground/60">
                {product.category
                  ? `More in ${formatCategory(product.category)}`
                  : "Discover more from our collections."}
              </p>
            </div>
            {product.category ? (
              <Button asChild variant="outline" className="h-11">
                <Link
                  href={`/shop?category=${encodeURIComponent(
                    product.category
                  )}`}
                >
                  View All
                </Link>
              </Button>
            ) : null}
          </div>

          {relatedProducts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => {
                const relatedPrice =
                  typeof item.price === "number"
                    ? currencyFormatter.format(item.price)
                    : "Price unavailable";
                const relatedDescription =
                  item.description ||
                  item.productOverview ||
                  "Designed to complement your space.";
                const relatedStock =
                  typeof item.stock === "number" && item.stock > 0;

                return (
                  <div
                    key={item._id ?? item.title}
                    className="group flex h-full flex-col overflow-hidden border border-muted/60 bg-background shadow-sm pb-2"
                  >
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={item.thumbnail || collection}
                        alt={item.title || "product image"}
                        fill
                        sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-foreground/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background shadow-sm">
                        {formatCategory(item.category)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold leading-tight">
                          {item.title || "Untitled Product"}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            relatedStock
                              ? "bg-emerald-100 text-emerald-700 min-w-16"
                              : "bg-rose-100 text-rose-700 min-w-20"
                          }`}
                        >
                          {relatedStock ? "In Stock" : "Stock Out"}
                        </span>
                      </div>

                      <p className="text-sm text-foreground/60 line-clamp-2">
                        {relatedDescription}
                      </p>

                      <p className="text-xl font-semibold">{relatedPrice}</p>

                      <div className="mt-auto">
                        {item._id ? (
                          <Button
                            asChild
                            variant="outline"
                            className="h-10 w-full"
                          >
                            <Link href={`/shop/${item._id}`}>View Details</Link>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="h-10 w-full"
                            disabled
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text text-center text-foreground/60">
              No similar products available yet. Please check back soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
