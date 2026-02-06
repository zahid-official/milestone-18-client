"use client";

import collection from "@/assets/collection-1.jpg";
import PaginationFeature from "@/components/modules/features/PaginationFeature";
import SearchFilter from "@/components/modules/features/SearchFeature";
import SelectFilter from "@/components/modules/features/SelectFeature";
import SortFilter from "@/components/modules/features/SortFeature";
import ProductAddToCartButton from "@/components/shared/ProductAddToCartButton";
import { Button } from "@/components/ui/button";
import { productCategory } from "@/constants/productCategory";
import { IProduct } from "@/types/product.interface";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const categoryOptions = Object.values(productCategory).map((category) => ({
  value: category,
  label: category
    .split(/[_\s]+/)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" "),
}));

const sortOptions = [
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Title: A to Z", value: "title" },
  { label: "Title: Z to A", value: "-title" },
];

interface ShopProductClientProps {
  products: IProduct[];
  currentPage: number;
  totalPages: number;
}

const ShopProductClient = ({
  products,
  currentPage,
  totalPages,
}: ShopProductClientProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isVisible) return;
        if (revealTimeoutRef.current) {
          clearTimeout(revealTimeoutRef.current);
        }
        revealTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          observer.disconnect();
        }, 200);
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [isVisible]);

  const revealClass = isVisible
    ? "reveal-on-scroll is-visible"
    : "reveal-on-scroll";
  const getDelayClass = (index: number) => `reveal-delay-${Math.min(index, 5)}`;

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl w-full mx-auto py-24 sm:py-27 sm:space-y-10 space-y-5 px-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* <div className={`${revealClass} reveal-delay-1 space-y-2`}>
          <h2 className="sm:text-4xl text-3xl font-semibold font-heading">
            Browse Collections
          </h2>
          <p className="text-foreground/60">Best Seller and Trending Product</p>
        </div> */}
        <div
          className={`${revealClass} reveal-delay-2 w-full flex gap-3 sm:flex-row flex-col sm:justify-end justify-center items-end`}
        >
          <SearchFilter
            placeholder="Search by title or category"
            className="max-w-none w-60"
          />
          <div className="flex gap-3 max-sm:flex-wrap justify-end">
            <SelectFilter
              paramName="category"
              placeholder="Filter by category"
              defaultLabel="All Category"
              options={categoryOptions}
            />
            <SortFilter
              paramName="sort"
              placeholder="Sort products"
              defaultLabel="Default Sort"
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className="lg:grid grid-cols-3 flex flex-wrap justify-center items-center gap-10">
        {products.length ? (
          products.map((product, index) => {
            const formattedPrice =
              typeof product.price === "number"
                ? currencyFormatter.format(product.price)
                : "Price unavailable";
            const isInStock =
              typeof product.stock === "number" && product.stock > 0;
            const description =
              product.description ||
              product.productOverview ||
              "Crafted to bring warmth and comfort to your space.";
            const categoryLabel = (product.category || "Collection")
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase());

            return (
              <div
                key={product._id ?? product.title}
                className={`${revealClass} ${getDelayClass(
                  index + 3
                )} w-full max-w-sm`}
              >
                <div className="group flex h-full flex-col overflow-hidden border border-muted/60 bg-background pb-1.5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.6)]">
                  <div className="relative aspect-4/3 sm:aspect-square bg-muted">
                    <Image
                      src={product.thumbnail || collection}
                      alt={product.title || "collection image"}
                      fill
                      sizes="(min-width: 1024px) 320px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      priority
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-foreground/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background shadow-sm">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {product.title || "Untitled Product"}
                      </h3>
                      <span
                        className={`rounded-full text-center px-3 py-1 text-xs font-semibold ${
                          isInStock
                            ? "bg-emerald-100 text-emerald-700 min-w-17"
                            : "bg-rose-100 text-rose-700 min-w-20"
                        }`}
                      >
                        {isInStock ? "In Stock" : "Stock Out"}
                      </span>
                    </div>

                    <p className="text-sm text-foreground/60 line-clamp-3">
                      {description}
                    </p>

                    <p className="text-3xl font-semibold text-foreground">
                      {formattedPrice}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <ProductAddToCartButton
                        product={product}
                        isInStock={isInStock}
                      />

                      {product._id ? (
                        <Button asChild variant="outline" className="h-11">
                          <Link href={`/shop/${product._id}`}>Details</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="h-11" disabled>
                          Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p
            className={`${revealClass} reveal-delay-2 col-span-3 text-center text-foreground/60`}
          >
            Products are on the way. Please check back soon.
          </p>
        )}
      </div>
      <div
        className={`${revealClass} reveal-delay-4 mt-10 flex justify-center`}
      >
        <PaginationFeature currentPage={currentPage} totalPages={totalPages} />
      </div>
    </section>
  );
};

export default ShopProductClient;
