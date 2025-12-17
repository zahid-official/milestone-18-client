import Image from "next/image";

import collection from "@/assets/collection-1.jpg";
import PageBanner from "@/components/shared/PageBanner";
import { IProduct, IProductSpecifications } from "@/types/product.interface";
import AddToCartSection from "./AddToCartSection";

interface ProductDetailsProps {
  product: IProduct | null;
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

const ProductDetails = ({ product }: ProductDetailsProps) => {
  if (!product) {
    return (
      <div className="bg-muted/30">
        <PageBanner
          heading="Product Details"
          subHeading="View product details and make buying decisions."
        />

        <div className="max-w-7xl w-full mx-auto py-20 sm:py-28 px-4 text-center">
          <p className="text-lg text-foreground/70">
            Product not found. Please return to the shop to explore available
            items.
          </p>
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

  return (
    <div className="bg-muted/30">
      <PageBanner
        heading="Product Details"
        subHeading="View product details and make buying decisions."
      />

      <div className="max-w-7xl w-full mx-auto py-20 sm:py-28 space-y-12 px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center items-center max-w-sm mx-auto drop-shadow-lg">
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
      </div>
    </div>
  );
};

export default ProductDetails;
