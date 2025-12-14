import newsletterImage from "@/assets/newsletter.png";
import Image from "next/image";

// Newsletter Component
const Newsletter = () => {
  return (
    <section className="relative">
      <div className="bg-[#223E3F]">
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            <div className="text-white lg:max-w-sm shrink-0">
              <h1 className="text-3xl sm:text-4xl font-semibold font-heading leading-tight">
                Subscribe our Newsletter
              </h1>
            </div>

            <div className="flex-1 w-full mt-6 lg:mt-0 lg:max-w-2xl">
              <form className="flex w-full border border-white/60">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="flex-1 bg-transparent text-white placeholder-white/70 px-4 sm:px-6 py-3 sm:py-4 outline-none"
                />
                <button
                  type="submit"
                  className="bg-white text-gray-900 px-5 sm:px-7 flex items-center justify-center text-lg font-medium"
                >
                  →
                </button>
              </form>
            </div>

            <div className="mt-10 lg:mt-0 lg:ml-auto shrink-0">
              <Image
                src={newsletterImage}
                alt="Comfortable chair beside a small table"
                className="w-[220px] sm:w-[260px] lg:w-[280px] h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#eef1f6] h-6 w-full" />
    </section>
  );
};

export default Newsletter;
