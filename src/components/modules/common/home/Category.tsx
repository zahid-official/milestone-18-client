import categoryIcon1 from "@/assets/icons/category-1.png";
import categoryIcon2 from "@/assets/icons/category-2.png";
import categoryIcon3 from "@/assets/icons/category-3.png";
import categoryIcon4 from "@/assets/icons/category-4.png";
import categoryIcon5 from "@/assets/icons/category-5.png";
import categoryIcon6 from "@/assets/icons/category-6.png";
import Image from "next/image";

// Category Component
const Category = () => {
  const categories = [
    {
      category: "Chair",
      url: categoryIcon1,
    },
    {
      category: "Bed",
      url: categoryIcon2,
    },
    {
      category: "Sofa",
      url: categoryIcon3,
    },
    {
      category: "Table",
      url: categoryIcon4,
    },
    {
      category: "Side Drawer",
      url: categoryIcon5,
    },
    {
      category: "Dining Table",
      url: categoryIcon6,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:pb-36 pb-24 space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-semibold font-heading">
          Choose Your Category
        </h2>
        <p className="text-foreground/60">Select your product from our category options</p>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-10">
        {categories?.map((category, index) => (
          <div
            key={index}
            className="w-40 h-40 bg-lorvic/50 flex items-center flex-col gap-2 justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          >
            <Image src={category.url} alt="category image" />
            <h3 className="text-md font-medium text-foreground/95 font-heading">
              {category.category}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
