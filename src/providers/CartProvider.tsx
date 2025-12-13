"use client";

import { IProduct } from "@/types/product.interface";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export interface CartItem extends IProduct {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  addItem: (product: IProduct, quantity?: number) => void;
  removeItem: (_id: string) => void;
  updateQuantity: (_id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "lorvic_cart";

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Failed to parse cart from storage", error);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to persist cart", error);
    }
  }, [items]);

  const addItem = (product: IProduct, quantity = 1) => {
    if (!product?._id) {
      toast.error("Unable to add this product to cart.");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Math.max(1, quantity) }];
    });
    toast.success("Added to cart");
  };

  const removeItem = (_id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== _id));
  };

  const updateQuantity = (_id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === _id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0
      ),
    [items]
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalQuantity,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};

export default CartProvider;
