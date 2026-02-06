"use client";

import UserManagementCreateAdminDialog from "@/components/modules/admin/userManagement/UserManagementCreateAdminDialog";
import UserManagementCreateVendorDialog from "@/components/modules/admin/userManagement/UserManagementCreateVendorDialog";
import ManagementHeader from "@/components/modules/dashboard/managementPage/ManagementHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface UserManagementHeaderProps {
  isDeletedView?: boolean;
}

// UserManagementHeader Component
const UserManagementHeader = ({
  isDeletedView = false,
}: UserManagementHeaderProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateVendorDialogOpen, setIsCreateVendorDialogOpen] =
    useState(false);

  const title = isDeletedView ? "Deleted Users" : "User Management";
  const description = isDeletedView
    ? "Review deleted accounts and their profile details."
    : "Review accounts, roles, and activity for all users.";

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      {isCreateDialogOpen && (
        <UserManagementCreateAdminDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
      {isCreateVendorDialogOpen && (
        <UserManagementCreateVendorDialog
          open={isCreateVendorDialogOpen}
          onClose={() => setIsCreateVendorDialogOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
      <ManagementHeader
        title={title}
        description={description}
        action={{
          label: "Create Admin",
          icon: Plus,
          onClick: () => setIsCreateDialogOpen(true),
        }}
      >
        <Button
          variant="outline"
          onClick={() => setIsCreateVendorDialogOpen(true)}
        >
          <Plus className="-ml-1 -mr-1" />
          Create Vendor
        </Button>
      </ManagementHeader>
    </>
  );
};

export default UserManagementHeader;
