import Footer from "@/components/shared/Footer";
import StickyHeader from "@/components/shared/navbar/StickyHeader";
import CartProvider from "@/providers/CartProvider";

// Interface for IProps
interface IProps {
  children: React.ReactNode;
}

// CommonLayout Component
const CommonLayout = ({ children }: IProps) => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <StickyHeader />

        <main className="grow">{children}</main>

        <footer className="bg-lorvic">
          <Footer />
        </footer>
      </div>
    </CartProvider>
  );
};

export default CommonLayout;
