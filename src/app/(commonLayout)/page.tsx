import Banner from "@/components/modules/common/home/Banner";
import Category from "@/components/modules/common/home/Category";
import Collection from "@/components/modules/common/home/Collection";
import Feature from "@/components/modules/common/home/Feature";

// HomePage Component
const HomePage = () => {
  return (
    <div>
      <Banner />
      <Feature />
      <Category />
      <Collection />
    </div>
  );
};

export default HomePage;
