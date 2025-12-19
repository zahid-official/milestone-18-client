import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PaymentSuccessPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// PaymentSuccessPage Component
const PaymentSuccessPage = async ({
  searchParams,
}: PaymentSuccessPageProps) => {
  const params = (await searchParams) || {};
  const orderParam = params.order_id;
  const orderId = Array.isArray(orderParam)
    ? orderParam[0]
    : orderParam?.trim();

  return (
    <div className="bg-muted/30">
      <PageBanner
        heading="Payment Successful"
        subHeading="Thanks for completing your payment. Your order is now in progress."
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 size-6 text-emerald-600" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Payment confirmed</h1>
              <p className="text-muted-foreground">
                We have received your payment and will start processing your
                order shortly.
              </p>
            </div>
          </div>

          {orderId ? (
            <div className="mt-5 rounded-lg bg-muted/40 p-4 text-sm">
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-semibold break-all">{orderId}</p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              Order id was not provided in the payment redirect.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
