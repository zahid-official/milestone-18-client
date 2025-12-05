import Footer from "@/components/shared/Footer";
import StickyHeader from "@/components/shared/navbar/StickyHeader";

// Interface for IProps
interface IProps {
  children: React.ReactNode;
}

// CommonLayout Component
const CommonLayout = ({ children }: IProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <StickyHeader />

      <main className="grow">{children}</main>

      <footer className="bg-[#eff1f5]">
        <Footer />
      </footer>
    </div>
  );
};

export default CommonLayout;
