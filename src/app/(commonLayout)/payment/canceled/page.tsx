import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

// PaymentCanceledPage Component
const PaymentCanceledPage = () => {
  return (
    <div className="bg-muted/30">
      <PageBanner
        heading="Payment Canceled"
        subHeading="Your payment was canceled. You can try again or review your order."
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <XCircle className="mt-1 size-6 text-destructive" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Payment not completed</h1>
              <p className="text-muted-foreground">
                No charges were made. You can return to your orders to finish
                payment or continue shopping.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCanceledPage;
