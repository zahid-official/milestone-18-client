"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { IProduct } from "@/types/product.interface";

interface ProductAddToCartButtonProps {
  product: IProduct;
  isInStock: boolean;
  className?: string;
}

const ProductAddToCartButton = ({
  product,
  isInStock,
  className,
}: ProductAddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, 1);
  };

  return (
    <Button
      type="button"
      onClick={handleAdd}
      className={cn("h-11", className)}
      disabled={!isInStock || !product?._id}
    >
      Add to Cart
    </Button>
  );
};

export default ProductAddToCartButton;
