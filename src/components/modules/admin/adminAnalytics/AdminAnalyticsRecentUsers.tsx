import UserManagementTable from "@/components/modules/admin/userManagement/UserManagementTable";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { IUser } from "@/types";
import Link from "next/link";

interface AdminAnalyticsRecentUsersProps {
  users: IUser[];
}

const AdminAnalyticsRecentUsers = ({ users }: AdminAnalyticsRecentUsersProps) => {
  return (
    <div className="rounded-3xl border bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Latest users</h2>
          <p className="text-sm text-muted-foreground">
            Recent customers, vendors, and admins onboarded.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/user-management">
            Manage users
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <UserManagementTable
          users={users}
          emptyMessage="No recent users"
          enableDelete={false}
          enableRestore={false}
        />
      </div>
    </div>
  );
};

export default AdminAnalyticsRecentUsers;
