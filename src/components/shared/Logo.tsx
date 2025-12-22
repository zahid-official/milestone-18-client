import logoImage from "@/assets/logo.svg";
import Image from "next/image";

// Logo Component
const Logo = () => {
  return (
    <div className="flex items-center gap-1.5">
      <Image src={logoImage} alt="Lorvic logo" className="max-h-10 w-auto" />
      <div className="flex flex-col">
        <span className="text-4xl font-bold tracking-[0.05em]">Lorvic</span>
        <span className="text-xs font-medium tracking-[0.34em] ml-0.5 -mt-0.5 text-foreground/70">
          FURNITURE
        </span>
      </div>
    </div>
  );
};

export default Logo;
