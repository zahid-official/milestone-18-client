"use client";

import categoryIcon1 from "@/assets/icons/category-1.png";
import categoryIcon2 from "@/assets/icons/category-2.png";
import categoryIcon3 from "@/assets/icons/category-3.png";
import categoryIcon4 from "@/assets/icons/category-4.png";
import categoryIcon5 from "@/assets/icons/category-5.png";
import categoryIcon6 from "@/assets/icons/category-6.png";
import { productCategory } from "@/constants/productCategory";
import type { ProductCategory } from "@/types/product.interface";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Category Component
const Category = () => {
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
  const categoryIconMap: Record<ProductCategory, StaticImageData> = {
    CHAIR: categoryIcon1,
    BED: categoryIcon2,
    SOFA: categoryIcon3,
    TABLE: categoryIcon4,
    "SIDE DRAWER": categoryIcon5,
    "DINING CHAIR": categoryIcon6,
  };
  const formatCategoryLabel = (value: string) =>
    value
      .split(/[_\s]+/)
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(" ");
  const categories = Object.values(productCategory).map((category) => ({
    category,
    label: formatCategoryLabel(category),
    url: categoryIconMap[category as ProductCategory],
  }));

  const revealClass = isVisible
    ? "reveal-on-scroll is-visible"
    : "reveal-on-scroll";
  const getDelayClass = (index: number) =>
    `reveal-delay-${Math.min(index, 5)}`;

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto w-full px-4 lg:pb-36 pb-24 sm:space-y-10 space-y-5"
    >
      <div className={`${revealClass} reveal-delay-1 text-center space-y-2`}>
        <h2 className="sm:text-4xl text-3xl font-semibold font-heading">
          Choose Your Category
        </h2>
        <p className="text-foreground/60">
          Select your product from our category options
        </p>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-10">
        {categories?.map((category, index) => (
          <Link
            key={category.category}
            href={`/shop?category=${encodeURIComponent(category.category)}`}
            className={`${revealClass} ${getDelayClass(
              index + 2
            )} w-40 h-40 bg-lorvic/50 dark:bg-[#E5E5E5] flex items-center flex-col gap-2 justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
          >
            <Image src={category.url} alt={`${category.label} category`} />
            <h3 className="text-md font-medium text-foreground/95 dark:text-black font-heading">
              {category.label}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Category;
