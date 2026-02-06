import { Button } from "@/components/ui/button";
import banner from "@/assets/banner.png";
import bannerLG from "@/assets/banner-lg.png";
import Image from "next/image";
import Link from "next/link";

// Banner Component
const Banner = () => {
  return (
    <section className="relative">
      {/* overlay */}
      <div className="w-[57%] bg-lorvic absolute top-0 h-screen -z-50 max-lg:hidden"></div>

      <section className="grid lg:grid-cols-2 min-h-screen items-center justify-center gap-6 lg:py-36 pt-44 pb-4 px-4 max-w-7xl mx-auto w-full">
        {/* Left column */}
        <div className="space-y-4 lg:order-0 order-1 max-sm:flex flex-col max-lg:text-center justify-center">
          <h2 className="banner-reveal text-sm font-medium ml-1">
            100% QUALITY - 100% SATISFACTION
          </h2>
          <h1 className="banner-reveal banner-reveal-delay-1 sm:text-5xl text-4xl font-semibold font-heading">
            Classic & Elegent Furniture
          </h1>
          <p className="banner-reveal banner-reveal-delay-2 py-3.5">
            Discover beautifully crafted furniture designed to bring comfort,
            style, and timeless charm to your home. Our pieces are made with
            premium materials and meticulous attention to detail-ensuring
            durability, elegance, and everyday comfort.
          </p>
          <Link href="/shop">
            <Button className="banner-reveal banner-reveal-delay-3">
              Shop Now
            </Button>
          </Link>
        </div>

        {/* Right column */}
        <div className="banner-media flex justify-center items-center">
          <Image
            src={banner}
            alt="banner image"
            className="max-lg:hidden"
          ></Image>
          <Image
            src={bannerLG}
            alt="banner image"
            className="max-lg:block hidden"
          ></Image>
        </div>
      </section>
    </section>
  );
};

export default Banner;
