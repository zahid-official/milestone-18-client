import OrderOverviewTable from "@/components/modules/admin/orderOverview/OrderOverviewTable";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { IOrder } from "@/types";
import Link from "next/link";

interface AdminAnalyticsRecentOrdersProps {
  orders: IOrder[];
}

const AdminAnalyticsRecentOrders = ({
  orders,
}: AdminAnalyticsRecentOrdersProps) => {
  return (
    <div className="rounded-3xl border bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Recent orders</h2>
          <p className="text-sm text-muted-foreground">
            Latest orders across all vendors and customers.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/order-overview">
            View all orders
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <OrderOverviewTable orders={orders} />
      </div>
    </div>
  );
};

export default AdminAnalyticsRecentOrders;
