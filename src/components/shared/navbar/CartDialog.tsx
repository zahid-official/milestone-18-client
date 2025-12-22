"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/CartProvider";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CartDialog = () => {
  const { items, subtotal, totalQuantity, removeItem, updateQuantity } =
    useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    if (!items.length) return;
    setOpen(false);
    if (pathname !== "/checkout") {
      router.push("/checkout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <button
          aria-label="Open cart"
          className="relative border cursor-pointer p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ShoppingCart size={21} />
          {totalQuantity ? (
            <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {totalQuantity}
            </span>
          ) : null}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-0 sm:p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">Your Cart</DialogTitle>
          <DialogDescription className="sr-only">
            Review the products in your cart
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Cart items */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {items.length ? (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 items-center rounded-md border bg-muted/30 p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                    <Image
                      src={
                        item.thumbnail ||
                        "https://res.cloudinary.com/ddbsm0sjt/image/upload/v1734059118/sample.jpg"
                      }
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-tight">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currency.format(Number(item.price) || 0)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        className="h-8 w-8 rounded border text-sm cursor-pointer"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(item._id as string, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="h-8 w-8 rounded border text-sm cursor-pointer"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(item._id as string, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    aria-label="Remove from cart"
                    className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    onClick={() => removeItem(item._id as string)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Your cart is empty.
              </p>
            )}
          </div>

          <Separator className="my-5" />

          {/* Footer */}
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Subtotal</span>
            <span>{currency.format(subtotal)}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              className="flex-1 h-12 text-base"
              disabled={!items.length}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="h-12 px-4">
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
