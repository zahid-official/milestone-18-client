"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import UserManagementDetailsViewDialog from "@/components/modules/admin/userManagement/UserManagementDetailsViewDialog";
import userManagementColumns from "@/components/modules/admin/userManagement/UserManagementColumns";
import ConfirmDeleteDialog from "@/components/modules/features/ConfirmDeleteDialog";
import { deleteUser, restoreUser } from "@/services/user/userManagement";
import { IUser } from "@/types";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface UserManagementTableProps {
  users: IUser[];
  emptyMessage?: string;
  enableDelete?: boolean;
  enableRestore?: boolean;
}

const getRowKey = (user: IUser) => user._id || user.email;

// UserManagementTable Component
const UserManagementTable = ({
  users,
  emptyMessage,
  enableDelete = true,
  enableRestore = false,
}: UserManagementTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [restoringUser, setRestoringUser] = useState<IUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const canDelete = enableDelete;
  const canRestore = enableRestore;
  const deleteLabel =
    deletingUser?.name || deletingUser?.email || "this user";
  const restoreLabel =
    restoringUser?.name || restoringUser?.email || "this user";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (user: IUser) => {
    setDeletingUser(user);
  };

  const handleRestore = (user: IUser) => {
    setRestoringUser(user);
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

  const confirmRestore = async () => {
    if (!restoringUser) return;

    const userId = restoringUser._id;
    if (!userId) {
      toast.error("User id is missing.");
      return;
    }

    setIsRestoring(true);
    const result = await restoreUser(userId);
    setIsRestoring(false);

    if (result.success) {
      toast.success(result.message || "User restored successfully.");
      setRestoringUser(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to restore user.");
    }
  };

  return (
    <>
      <ManagementTable
        data={users}
        columns={userManagementColumns}
        onView={(user) => setViewingUser(user)}
        onEdit={canRestore ? handleRestore : undefined}
        onDelete={canDelete ? handleDelete : undefined}
        isEditDisabled={
          canRestore ? (user) => !user.isDeleted : undefined
        }
        isDeleteDisabled={
          canDelete ? (user) => Boolean(user.isDeleted) : undefined
        }
        getRowKey={getRowKey}
        emptyMessage={emptyMessage ?? "No users found"}
        viewLabel="View Profile"
        editLabel="Restore User"
        editIcon={<RotateCcw className="size-4" />}
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

      {canRestore && (
        <ConfirmDeleteDialog
          open={!!restoringUser}
          onOpenChange={(open) => !open && setRestoringUser(null)}
          onConfirm={confirmRestore}
          title="Restore User"
          description={
            <>
              This will restore{" "}
              <span className="font-semibold text-foreground">
                {restoreLabel}
              </span>{" "}
              and return them to the active list.
            </>
          }
          itemName={restoreLabel}
          isDeleting={isRestoring}
          confirmLabel="Restore User"
          processingLabel="Restoring user..."
        />
      )}
    </>
  );
};

export default UserManagementTable;
