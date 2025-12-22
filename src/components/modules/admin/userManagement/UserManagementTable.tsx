"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import UserManagementDetailsViewDialog from "@/components/modules/admin/userManagement/UserManagementDetailsViewDialog";
import userManagementColumns from "@/components/modules/admin/userManagement/UserManagementColumns";
import ConfirmDeleteDialog from "@/components/modules/features/ConfirmDeleteDialog";
import { deleteUser } from "@/services/user/userManagement";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface UserManagementTableProps {
  users: IUser[];
  emptyMessage?: string;
  enableDelete?: boolean;
}

const getRowKey = (user: IUser) => user._id || user.email;

// UserManagementTable Component
const UserManagementTable = ({
  users,
  emptyMessage,
  enableDelete = true,
}: UserManagementTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = enableDelete;
  const deleteLabel =
    deletingUser?.name || deletingUser?.email || "this user";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (user: IUser) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    const userId = deletingUser._id;
    if (!userId) {
      toast.error("User id is missing.");
      return;
    }

    setIsDeleting(true);
    const result = await deleteUser(userId);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || "User deleted successfully.");
      setDeletingUser(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete user.");
    }
  };

  return (
    <>
      <ManagementTable
        data={users}
        columns={userManagementColumns}
        onView={(user) => setViewingUser(user)}
        onDelete={canDelete ? handleDelete : undefined}
        isDeleteDisabled={
          canDelete ? (user) => Boolean(user.isDeleted) : undefined
        }
        getRowKey={getRowKey}
        emptyMessage={emptyMessage ?? "No users found"}
        viewLabel="View Profile"
      />

      {viewingUser && (
        <UserManagementDetailsViewDialog
          open={!!viewingUser}
          onClose={() => setViewingUser(null)}
          user={viewingUser}
        />
      )}

      {canDelete && (
        <ConfirmDeleteDialog
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onConfirm={confirmDelete}
          title="Delete User"
          description={
            <>
              This will mark{" "}
              <span className="font-semibold text-foreground">
                {deleteLabel}
              </span>{" "}
              as deleted and remove them from the active list.
            </>
          }
          itemName={deleteLabel}
          isDeleting={isDeleting}
          confirmLabel="Delete User"
          processingLabel="Deleting user..."
        />
      )}
    </>
  );
};

export default UserManagementTable;
