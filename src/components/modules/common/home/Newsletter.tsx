import newsletterImage from "@/assets/newsletter.png";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// Newsletter Component
const Newsletter = () => {
  return (
    <section className="bg-[#223E3F] text-white py-20">
      <div className="flex max-lg:flex-col-reverse justify-center items-center max-w-7xl w-full mx-auto px-4 relative">
        <div className="gap-10 max-sm:flex-col">
          <h1 className="sm:text-4xl text-3xl font-semibold font-heading">
            Subscribe our <br className="max-lg:hidden" /> Newsletter
          </h1>
          {/* <form className="flex max-w-sm w-full border border-white/60">
            <input
              type="email"
              placeholder="Enter your email here"
              className="flex-1 bg-transparent text-white placeholder-white/70 px-4 sm:px-6 py-3 sm:py-4 outline-none"
            />
            <button
              type="submit"
              className="bg-white text-gray-900 px-5 sm:px-7 flex items-center justify-center text-lg font-medium"
            >
              <ArrowRight size={22} />
            </button>
          </form>*/}
        </div>
        <Image
          className="absolute max-lg:hidden right-0 bottom-0"
          src={newsletterImage}
          alt="newsletter image"
        />
      </div>

      <div>
        <h1></h1>
      </div>
    </section>
  );
};

export default Newsletter;
