"use client";

import { IProduct } from "@/types/product.interface";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
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

export const CART_KEY = "lorvic_cart";

const parseStoredCart = (stored: string | null): CartItem[] => {
  if (!stored) return [];

  try {
    const parsed: CartItem[] = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse cart from storage", error);
    return [];
  }
};

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD_ITEM"; product: IProduct; quantity: number }
  | { type: "REMOVE_ITEM"; _id: string }
  | { type: "UPDATE_QUANTITY"; _id: string; quantity: number }
  | { type: "CLEAR" };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ITEM": {
      const { product, quantity } = action;
      const existing = state.find((item) => item._id === product._id);
      if (existing) {
        return state.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
            : item
        );
      }
      return [...state, { ...product, quantity: Math.max(1, quantity) }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item._id !== action._id);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item._id === action._id
          ? { ...item, quantity: Math.max(1, action.quantity) }
          : item
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Hydrate cart after mount to keep SSR/CSR markup in sync
  useEffect(() => {
    const stored = parseStoredCart(localStorage.getItem(CART_KEY));
    if (stored.length) {
      dispatch({ type: "HYDRATE", payload: stored });
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CART_KEY) {
        dispatch({
          type: "HYDRATE",
          payload: parseStoredCart(event.newValue),
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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

    dispatch({ type: "ADD_ITEM", product, quantity });
    toast.success("Added to cart");
  };

  const removeItem = (_id: string) => {
    dispatch({ type: "REMOVE_ITEM", _id });
  };

  const updateQuantity = (_id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", _id, quantity });
  };

  const clearCart = () => dispatch({ type: "CLEAR" });

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

export const useOptionalCart = () => useContext(CartContext);

export default CartProvider;
