import DropMessage from "@/components/modules/common/contact/DropMessage";
import Showroom from "@/components/modules/common/contact/Showroom";

// ContactPage Component
const ContactPage = () => {
  return (
    <div>
      <div className="sm:space-y-36 space-y-24 sm:py-36 py-24 px-4 mx-auto w-full max-w-7xl">
        <Showroom />
        <DropMessage />
      </div>
    </div>
  );
};

export default ContactPage;
