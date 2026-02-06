import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AdminCategoryInsight,
  AdminVendorInsight,
} from "@/components/modules/admin/adminAnalytics/adminAnalyticsUtils";

interface AdminAnalyticsMarketplaceMixProps {
  topCategories: AdminCategoryInsight[];
  topVendors: AdminVendorInsight[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const numberFormatter = new Intl.NumberFormat("en-US");

const AdminAnalyticsMarketplaceMix = ({
  topCategories,
  topVendors,
}: AdminAnalyticsMarketplaceMixProps) => {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Marketplace mix</CardTitle>
        <CardDescription>
          Top categories and vendors by order volume.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Categories
          </p>
          {topCategories.length ? (
            topCategories.map((category) => (
              <div
                key={category.label}
                className="flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold">{category.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {numberFormatter.format(category.count)} orders
                  </p>
                </div>
                <span className="rounded-full border px-2.5 py-1 text-xs font-semibold">
                  {category.share}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No category data yet.
            </p>
          )}
        </div>

        <div className="space-y-3 border-t pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Vendors
          </p>
          {topVendors.length ? (
            topVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold">{vendor.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {numberFormatter.format(vendor.orders)} orders
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {currencyFormatter.format(vendor.revenue)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No vendor activity yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAnalyticsMarketplaceMix;
