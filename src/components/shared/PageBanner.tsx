import banner from "@/assets/pageBanner.png";
import Image from "next/image";

interface IProps {
  heading: string;
  subHeading: string;
}

// PageBanner Component
const PageBanner = ({ heading, subHeading }: IProps) => {
  return (
    <div className="pt-32 md:pb-20 pb-14 bg-lorvic">
      <div className="flex md:flex-row flex-col justify-between items-center gap-10 max-w-7xl w-full mx-auto px-4">
        <Image src={banner} alt="page banner image" className="flex-1" />
        <div className="flex-1">
          <div className="md:max-w-sm max-w-lg md:text-left text-center space-y-1">
            <h2 className="sm:text-[44px] text-4xl font-medium font-heading">
              {heading}
            </h2>
            <p>{subHeading}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
