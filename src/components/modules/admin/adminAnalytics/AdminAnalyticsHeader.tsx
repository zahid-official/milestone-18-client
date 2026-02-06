import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const AdminAnalyticsHeader = () => {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Admin Command Center
        </p>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Marketplace overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor orders, vendors, customers, and product activity at a
            glance.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/order-overview">
            View all orders
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/admin/user-management">
            Manage users
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default AdminAnalyticsHeader;
