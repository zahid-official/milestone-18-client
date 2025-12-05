import Navbar from "@/components/shared/Navbar";

// Interface for IProps
interface IProps {
  children: React.ReactNode;
}

// CommonLayout Component
const CommonLayout = ({ children }: IProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full mx-auto sticky top-0 bg-background/96 z-50">
        <Navbar />
      </header>

      <main className="grow">{children}</main>

      <footer></footer>
    </div>
  );
};

export default CommonLayout;
