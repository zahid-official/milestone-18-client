import collection from "@/assets/collection-1.jpg";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";

// ShopProduct Component
const ShopProduct = () => {
  return (
    <section className="">
      <PageBanner
        heading="Our Products"
        subHeading={
          "Discover our exclusive range of products designed to elevate your lifestyle."
        }
        reverse={true}
      />

      {/* Products */}
      <div className="max-w-7xl w-full mx-auto py-36 sm:space-y-10 space-y-5 px-4">
        <div className="text-center">
          <h2 className="sm:text-3xl text-2xl font-semibold font-heading">
            Browse Collections
          </h2>
          <p className="text-foreground/60">
            Best Seller and Trending Product
          </p>
        </div>

        <div className="lg:grid grid-cols-3 flex flex-wrap justify-center items-center gap-10">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-3">
              <div className="group relative overflow-hidden">
                {/* Image */}
                <Image
                  src={collection}
                  alt="collection image"
                  className="w-full h-full object-cover"
                />

                {/* Optional overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

                {/* Sliding Button */}
                <Button className="absolute left-1/2 -translate-x-1/2 group-hover:-translate-y-16 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ShoppingBasket />
                  Add to Cart
                </Button>
              </div>

              {/* Text */}
              <div className="pl-2">
                <h3 className="text-xl font-medium">Accent Leisure Chairs</h3>
                <p className="text-foreground/70">BDT 599</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopProduct;
