import Image from "next/image";

import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductDetails = () => {
  const data = {
    _id: "693aa3c927fe6b205dcbed69",
    vendorId: "692ea69ae8b11a30bebb230d",
    title: "Handcrafted Wooden Table Organizer",
    price: 49.99,
    stock: 120,
    category: "CHAIR",
    thumbnail:
      "https://res.cloudinary.com/ddbsm0sjt/image/upload/v1765450696/uccpwp2oa7-1765450696066-578e6b64-1b69-47d2-b1d3-06248a69bc17.jpg",
    description:
      "A premium handcrafted wooden desk organizer designed to keep your workspace neat.",
    productOverview:
      "Made from eco-friendly materials with multiple compartments for storage.",
    specifications: {
      height: 12,
      weight: 1.5,
      width: 25,
      length: 18,
      meterials: "WOODEN",
    },
    createdAt: {
      $date: "2025-12-11T10:58:17.170Z",
    },
    updatedAt: {
      $date: "2025-12-11T10:58:17.170Z",
    },
  };

  const isInStock = Boolean(data?.stock && data.stock > 0);
  const formattedPrice = data?.price ? data.price.toFixed(2) : "N/A";

  return (
    <div className="bg-muted/30">
      <PageBanner
        heading="Product Details"
        subHeading="View product details and make buying decisions."
      />

      <div className="max-w-7xl w-full mx-auto py-20 sm:py-28 space-y-12 px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center items-center p-6">
            <Image
              src={data?.thumbnail}
              alt="product image"
              width={480}
              height={480}
              className="h-auto w-auto max-h-[520px] max-w-full object-contain drop-shadow-lg"
              priority
            />
          </div>

          <div className="space-y-6 lg:pl-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {data?.category ?? "Uncategorized"}
              </div>
              <h2 className="text-4xl font-semibold leading-tight">
                {data?.title}
              </h2>
              <p className="text-2xl font-semibold text-primary">
                BDT {formattedPrice}
              </p>
            </div>

            <p className="text-base leading-relaxed text-foreground/70">
              {data?.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background p-4 space-y-2 shadow-sm">
                <p className="text-sm text-foreground/60">Availability</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 ${
                      isInStock ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {isInStock ? `${data?.stock} in stock` : "Stock Out"}
                </p>
              </div>
              <div className="bg-background p-4 space-y-2 shadow-sm">
                <p className="text-sm text-foreground/60">Category</p>
                <p className="text-lg font-semibold">{data?.category}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="text-base font-medium" htmlFor="quantity">
                Quantity
              </label>
              <Input
                id="quantity"
                className="w-20 h-11 rounded-none"
                defaultValue={1}
                min={1}
                type="number"
                aria-label="Select quantity"
              />
              <Button size="lg">
                Add to cart
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-background p-6 shadow-sm space-y-3">
            <h2 className="text-2xl font-semibold">Product Overview</h2>
            <p className="text-foreground/70 leading-relaxed">
              {data?.productOverview}
            </p>
          </div>

          <div className="bg-background p-6 shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold">Specifications</h2>
            <dl className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Height</dt>
                <dd className="text-base font-semibold">
                  {data?.specifications?.height
                    ? `${data.specifications.height} cm`
                    : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Weight</dt>
                <dd className="text-base font-semibold">
                  {data?.specifications?.weight
                    ? `${data.specifications.weight} kg`
                    : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Width</dt>
                <dd className="text-base font-semibold">
                  {data?.specifications?.width
                    ? `${data.specifications.width} cm`
                    : "Not mentioned"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-foreground/60">Length</dt>
                <dd className="text-base font-semibold">
                  {data?.specifications?.length
                    ? `${data.specifications.length} cm`
                    : "Not mentioned"}
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
