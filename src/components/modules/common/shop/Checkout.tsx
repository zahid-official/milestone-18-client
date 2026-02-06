"use client";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/providers/CartProvider";
import { getAvailableCoupons } from "@/services/coupon/couponManagement";
import { createOrder } from "@/services/order/orderManagement";
import { ICoupon, IUser } from "@/types";
import { TicketPercent, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface CheckoutProps {
  user: IUser | null;
}

const normalizeVendorId = (value: unknown) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in value) {
    const id = (value as { _id?: string })._id;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
};

const toCents = (value: number) => Math.round(value * 100);

const toNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

// Checkout Component
const Checkout = ({ user }: CheckoutProps) => {
  // Core hooks + cart totals.
  const router = useRouter();
  const { items, subtotal, totalQuantity, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const shipping = subtotal < 100 ? 20 : 0;
  // Coupon dialog + selection state.
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<ICoupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [hasLoadedCoupons, setHasLoadedCoupons] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);
  // Prevent coupon actions when there is no subtotal to apply against.
  const isCartEmpty = !items.length || subtotal <= 0;

  // Billing details shown from the profile.
  const billingDetails = useMemo(
    () => [
      { label: "Full Name", value: user?.name ?? "Not provided" },
      { label: "Email", value: user?.email ?? "Not provided" },
      { label: "Phone", value: user?.phone ?? "Not provided" },
      { label: "Address", value: user?.address ?? "Not provided" },
    ],
    [user]
  );

  // Require phone + address before checkout.
  const profileIncomplete = !user?.phone || !user?.address;

  // Shared currency formatter.
  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  // Totals before/after discount.
  const totalBeforeDiscount = subtotal + shipping;

  // Identify single-vendor carts for vendor-scoped coupons.
  const vendorId = useMemo(() => {
    const vendorIds = Array.from(
      new Set(
        items
          .map((item) => normalizeVendorId(item.vendorId))
          .filter((value): value is string => Boolean(value))
      )
    );
    return vendorIds.length === 1 ? vendorIds[0] : undefined;
  }, [items]);

  // Normalize codes for matching.
  const normalizeCouponCode = (value: string) => value.trim().toUpperCase();

  // Format coupon expiry dates for display.
  const formatCouponDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Compute per-item total in cents to mirror backend calculations.
  const getItemTotalCents = useCallback((item: (typeof items)[number]) => {
    const price = Number(item.price);
    if (!Number.isFinite(price)) return 0;
    return toCents(price) * item.quantity;
  }, []);

  // Coupon eligibility per item (order-level rule).
  const isCouponEligibleForItem = useCallback(
    (coupon: ICoupon, item: (typeof items)[number]) => {
      if (coupon.scope === "VENDOR") {
        const couponVendorId = normalizeVendorId(coupon.vendorId);
        const itemVendorId = normalizeVendorId(item.vendorId);
        if (!couponVendorId || !itemVendorId || couponVendorId !== itemVendorId) {
          return false;
        }
      }

      const usageLimit = toNumber(coupon.usageLimit);
      const usedCount = toNumber(coupon.usedCount);
      if (
        usageLimit !== undefined &&
        usedCount !== undefined &&
        usedCount >= usageLimit
      ) {
        return false;
      }

      const itemTotalCents = getItemTotalCents(item);
      const minOrderAmount = toNumber(coupon.minOrderAmount);
      if (minOrderAmount !== undefined && itemTotalCents < toCents(minOrderAmount)) {
        return false;
      }
      const minQuantity = toNumber(coupon.minQuantity);
      if (minQuantity !== undefined && item.quantity < minQuantity) {
        return false;
      }
      return true;
    },
    [getItemTotalCents]
  );

  // Validate if a coupon is eligible for the current cart.
  const getEligibilityMessage = useCallback(
    (coupon: ICoupon) => {
      const usageLimit = toNumber(coupon.usageLimit);
      const usedCount = toNumber(coupon.usedCount);
      if (
        usageLimit !== undefined &&
        usedCount !== undefined &&
        usedCount >= usageLimit
      ) {
        return "Coupon usage limit reached.";
      }
      if (coupon.scope === "VENDOR") {
        if (!vendorId) {
          return "This coupon applies to a single vendor order.";
        }
        const couponVendorId = normalizeVendorId(coupon.vendorId);
        if (couponVendorId && couponVendorId !== vendorId) {
          return "This coupon is not valid for this vendor.";
        }
      }
      if (!items.length) {
        return "Add items to use this coupon.";
      }

      const eligibleCount = items.filter((item) =>
        isCouponEligibleForItem(coupon, item)
      ).length;

      if (eligibleCount === 0) {
        const minOrderAmount = toNumber(coupon.minOrderAmount);
        if (minOrderAmount !== undefined) {
          return `Coupon applies to items over ${currency.format(
            minOrderAmount
          )}.`;
        }
        const minQuantity = toNumber(coupon.minQuantity);
        if (minQuantity !== undefined) {
          return `Minimum quantity is ${minQuantity} per item.`;
        }
        return "This coupon is not eligible for your cart.";
      }

      return null;
    },
    [currency, items, isCouponEligibleForItem, vendorId]
  );

  // Calculate applied coupon discount (subtotal only).
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const eligibilityMessage = getEligibilityMessage(appliedCoupon);
    if (eligibilityMessage) return 0;

    const discountCents = items.reduce((sum, item) => {
      if (!isCouponEligibleForItem(appliedCoupon, item)) {
        return sum;
      }

      const itemTotalCents = getItemTotalCents(item);
      if (itemTotalCents <= 0) {
        return sum;
      }

      let discountCents = 0;
      const discountValue = toNumber(appliedCoupon.discountValue) ?? 0;
      if (appliedCoupon.discountType === "PERCENTAGE") {
        discountCents = Math.round(
          (itemTotalCents * discountValue) / 100
        );
      } else if (appliedCoupon.discountType === "FIXED") {
        discountCents = toCents(discountValue);
      }

      const maxDiscount = toNumber(appliedCoupon.maxDiscount);
      if (maxDiscount !== undefined) {
        discountCents = Math.min(
          discountCents,
          toCents(maxDiscount)
        );
      }

      const boundedDiscount = Math.max(
        0,
        Math.min(discountCents, itemTotalCents)
      );
      return sum + boundedDiscount;
    }, 0);
    return discountCents / 100;
  }, [
    appliedCoupon,
    getEligibilityMessage,
    getItemTotalCents,
    isCouponEligibleForItem,
    items,
  ]);

  // Final payable total after discount.
  const totalAfterDiscount = Math.max(
    0,
    totalBeforeDiscount - couponDiscount
  );

  // Fetch available coupons once per dialog open.
  const loadCoupons = async () => {
    if (isLoadingCoupons) return;
    setIsLoadingCoupons(true);
    const queryString = vendorId
      ? `vendorId=${encodeURIComponent(vendorId)}`
      : undefined;
    const result = await getAvailableCoupons(queryString);
    setIsLoadingCoupons(false);
    setHasLoadedCoupons(true);

    if (!result?.success) {
      return;
    }
    setAvailableCoupons(result.data || []);
  };

  // Open dialog and trigger coupon load.
  const handleOpenCouponDialog = () => {
    if (isCartEmpty) return;
    setCouponError(null);
    setIsCouponDialogOpen(true);
    if (!hasLoadedCoupons) {
      void loadCoupons();
    }
  };

  // Apply a coupon from input or quick-apply button.
  const handleApplyCoupon = (code?: string) => {
    const normalized = normalizeCouponCode(code ?? couponCode ?? "");
    if (!normalized) {
      setCouponError("Enter a coupon code to apply.");
      return;
    }

    const coupon = availableCoupons.find(
      (item) => normalizeCouponCode(item.code) === normalized
    );
    if (!coupon) {
      setCouponError("This coupon is invalid or inactive.");
      return;
    }

    const eligibilityMessage = getEligibilityMessage(coupon);
    if (eligibilityMessage) {
      setCouponError(eligibilityMessage);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponError(null);
    setIsCouponDialogOpen(false);
  };

  // Clear applied coupon.
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  // Place orders for all cart items (with coupon code if applied).
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
          formData.append("shippingFee", shipping.toString());
          if (
            appliedCoupon?.code &&
            isCouponEligibleForItem(appliedCoupon, item)
          ) {
            formData.append("couponCode", appliedCoupon.code);
          }

          const result = await createOrder(null, formData);

          if (!result?.success) {
            const message =
              result?.message || "Failed to place order. Please try again.";

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
              result?.message || "Order created. Redirecting to payment..."
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
            <div className="rounded-md border border-dashed px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TicketPercent className="size-4 text-muted-foreground" />
                  Apply a voucher
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 text-primary"
                  onClick={handleOpenCouponDialog}
                  disabled={isCartEmpty}
                >
                  {appliedCoupon ? "Change" : "Apply"}
                </Button>
              </div>

              {appliedCoupon ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appliedCoupon.title || "Coupon applied"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="hover:bg-muted"
                    onClick={handleRemoveCoupon}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Add a coupon code to unlock extra savings.
                </p>
              )}
            </div>
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
            {appliedCoupon && couponDiscount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Voucher Discount</span>
                <span className="font-semibold text-emerald-600">
                  -{currency.format(couponDiscount)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total Amount</span>
              <span>{currency.format(totalAfterDiscount)}</span>
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

      {/* Coupon dialog */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[calc(100%-1.5rem)] pb-7 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pb-2">Apply a voucher</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Enter voucher code</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={couponCode}
                  className="rounded-none"
                  placeholder="Enter voucher code"
                  onChange={(event) => {
                    setCouponCode(event.target.value);
                    setCouponError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                />
                <Button
                  type="button"
                  className="sm:min-w-24"
                  onClick={() => handleApplyCoupon()}
                  disabled={isCartEmpty}
                >
                  Apply
                </Button>
              </div>
              {couponError && (
                <p className="text-sm text-destructive">{couponError}</p>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Available vouchers</p>
                {isLoadingCoupons && (
                  <p className="text-xs text-muted-foreground">Loading...</p>
                )}
              </div>

              {availableCoupons.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {isLoadingCoupons
                    ? "Fetching available coupons..."
                    : "No coupons available right now."}
                </p>
              ) : (
                <div className="space-y-3">
                  {availableCoupons.map((coupon) => {
                    const discountLabel =
                      coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : currency.format(coupon.discountValue);
                    const isApplied = appliedCoupon?.code === coupon.code;
                    const eligibilityMessage = getEligibilityMessage(coupon);
                    const isEligible = !eligibilityMessage;

                    return (
                      <div
                        key={coupon._id || coupon.code}
                        className="rounded-lg border bg-muted/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {coupon.code}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {coupon.title || coupon.code}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isEligible || isApplied || isCartEmpty}
                            onClick={() => handleApplyCoupon(coupon.code)}
                          >
                            {isApplied ? "Applied" : "Apply"}
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <Badge variant="secondary">{discountLabel} off</Badge>
                          {coupon.maxDiscount !== undefined && (
                            <Badge variant="outline">
                              Max {currency.format(coupon.maxDiscount)}
                            </Badge>
                          )}
                          {coupon.minOrderAmount !== undefined && (
                            <Badge variant="outline">
                              Min order {currency.format(coupon.minOrderAmount)}
                            </Badge>
                          )}
                          {coupon.minQuantity !== undefined && (
                            <Badge variant="outline">
                              Min qty {coupon.minQuantity}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            Use by {formatCouponDate(coupon.endDate)}
                          </Badge>
                        </div>
                        {eligibilityMessage && (
                          <p className="mt-3 text-xs text-amber-600">
                            {eligibilityMessage}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
