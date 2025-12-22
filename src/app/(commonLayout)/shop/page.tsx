import ShopProduct from "@/components/modules/common/shop/ShopProduct";
import queryFormatter from "@/utils/queryFormatter";

interface IProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ShopPage Component
const ShopPage = async ({ searchParams }: IProps) => {
  const params = (await searchParams) || {};
  const queryString = queryFormatter({ ...params, limit: "9" });

  return (
    <div>
      <ShopProduct queryString={queryString} />
    </div>
  );
};

export default ShopPage;
