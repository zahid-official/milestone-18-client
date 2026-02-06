import { getProducts } from "@/services/vendor/productManagement";
import { IProduct } from "@/types/product.interface";
import CollectionClient from "./CollectionClient";

const Collection = async () => {
  const result = await getProducts("limit=6");
  const products: IProduct[] = Array.isArray(result?.data)
    ? result.data.slice(0, 6)
    : [];

  return <CollectionClient products={products} />;
};

export default Collection;
