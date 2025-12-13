"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/providers/CartProvider";
import { IProduct } from "@/types/product.interface";
import { useState } from "react";

interface AddToCartSectionProps {
  product: IProduct;
}

const AddToCartSection = ({ product }: AddToCartSectionProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    const safeQty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
    addItem(product, safeQty);
    setQuantity(1);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="text-base font-medium" htmlFor="quantity">
        Quantity
      </label>
      <Input
        id="quantity"
        className="w-20 h-11 rounded-none"
        value={quantity}
        min={1}
        type="number"
        aria-label="Select quantity"
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          setQuantity(Number.isNaN(val) ? 1 : val);
        }}
      />
      <Button size="lg" onClick={handleAdd} disabled={!product?._id}>
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCartSection;
