import Checkout from "@/components/modules/common/shop/Checkout";
import { getProfileInfo } from "@/services/user/userManagement";

// CheckoutPage Component
const CheckoutPage = async () => {
  const profileResult = await getProfileInfo();
  const user = profileResult?.success ? profileResult.data : null;

  return (
    <div>
      <Checkout user={user} />
    </div>
  );
};

export default CheckoutPage;
