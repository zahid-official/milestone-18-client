"use client";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/CartProvider";
import { createOrder } from "@/services/order/orderManagement";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

interface CheckoutProps {
  user: IUser | null;
}

// Checkout Component
const Checkout = ({ user }: CheckoutProps) => {
  const router = useRouter();
  const { items, subtotal, totalQuantity, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const shipping = subtotal < 100 ? 20 : 0;
  const total = subtotal + shipping;

  const billingDetails = useMemo(
    () => [
      { label: "Full Name", value: user?.name ?? "Not provided" },
      { label: "Email", value: user?.email ?? "Not provided" },
      { label: "Phone", value: user?.phone ?? "Not provided" },
      { label: "Address", value: user?.address ?? "Not provided" },
    ],
    [user]
  );

  const profileIncomplete = !user?.phone || !user?.address;

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  const handlePlaceOrder = () => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    startTransition(async () => {
      try {
        for (const item of items) {
          if (!item._id) continue;

          const formData = new FormData();
          formData.append("productId", item._id);
          formData.append("quantity", item.quantity.toString());

          const result = await createOrder(null, formData);

          if (!result?.success) {
            const message =
              result?.message ||
              "Failed to place order. Please try again.";

            if (
              message.includes(
                "Please update your profile with phone number and address before placing an order"
              )
            ) {
              toast.error(message);
              router.push("/profile");
              return;
            }

            toast.error(message);
            return;
          }

          // Redirect to payment URL if provided
          const paymentURL = result?.data?.paymentURL;
          if (paymentURL) {
            toast.success(
              result?.message ||
                "Order created. Redirecting to payment..."
            );
            clearCart();
            window.location.href = paymentURL;
            return;
          }
        }

        toast.success("Order placed successfully.");
        clearCart();
        router.push("/"); // Redirect to home or order list
      } catch (error) {
        console.error("handlePlaceOrder error", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="bg-muted/30">
      <PageBanner
        heading="Checkout"
        subHeading="Review your billing details before placing the order."
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-16 space-y-10">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Billing details (from profile) */}
          <section className="lg:col-span-3 bg-background border shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Billing Details</h2>
              <p className="text-muted-foreground text-sm mt-1">
                We&apos;ll use this information to process your order.
              </p>
              {profileIncomplete && (
                <p className="mt-3 text-sm text-amber-600 font-semibold">
                  Please add your phone number and address in your profile
                  before placing an order.
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {billingDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-md border bg-muted/30 p-3"
                >
                  <p className="text-xs uppercase font-semibold text-muted-foreground">
                    {detail.label}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Summary */}
          <section className="lg:col-span-2 bg-background border shadow-sm p-6 space-y-4">
            <h3 className="text-xl font-semibold">Order Summary</h3>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-semibold">{totalQuantity || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{currency.format(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Shipping{shipping === 0 ? " (free over $100)" : ""}
              </span>
              <span className="font-semibold">{currency.format(shipping)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{currency.format(total)}</span>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handlePlaceOrder}
              disabled={isPending || !items.length}
            >
              {isPending ? "Placing order..." : "Place Order"}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
