import HeaderScrollOverlay from "./HeaderScrollOverlay";
import Navbar from "./Navbar";

const StickyHeader = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative">
        <HeaderScrollOverlay />
        <div className="relative z-10">
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
