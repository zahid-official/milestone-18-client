import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface AdminAnalyticsOperationsSnapshotProps {
  openOrders: number;
  paymentIssues: number;
  cancelledOrders: number;
}

const numberFormatter = new Intl.NumberFormat("en-US");

const AdminAnalyticsOperationsSnapshot = ({
  openOrders,
  paymentIssues,
  cancelledOrders,
}: AdminAnalyticsOperationsSnapshotProps) => {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Operations snapshot</CardTitle>
        <CardDescription>
          Priority queues that need admin attention.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Open orders</p>
            <p className="text-xs text-muted-foreground">
              Pending, confirmed, or in processing
            </p>
          </div>
          <span className="text-lg font-semibold tabular-nums">
            {numberFormatter.format(openOrders)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Payment issues</p>
            <p className="text-xs text-muted-foreground">
              Unpaid or failed transactions
            </p>
          </div>
          <span className="text-lg font-semibold tabular-nums">
            {numberFormatter.format(paymentIssues)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Cancelled orders</p>
            <p className="text-xs text-muted-foreground">
              Customer or system cancellations
            </p>
          </div>
          <span className="text-lg font-semibold tabular-nums">
            {numberFormatter.format(cancelledOrders)}
          </span>
        </div>
        <div className="rounded-2xl border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Escalation checklist</p>
              <p className="text-xs text-muted-foreground">
                Review open and unpaid orders daily.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAnalyticsOperationsSnapshot;
