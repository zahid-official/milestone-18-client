"use client";

import ManagementTable from "@/components/modules/dashboard/managementPage/ManagementTable";
import UserManagementDetailsViewDialog from "@/components/modules/admin/userManagement/UserManagementDetailsViewDialog";
import userManagementColumns from "@/components/modules/admin/userManagement/UserManagementColumns";
import { IUser } from "@/types";
import { useState } from "react";

interface UserManagementTableProps {
  users: IUser[];
}

const getRowKey = (user: IUser) => user._id || user.email;

// UserManagementTable Component
const UserManagementTable = ({ users }: UserManagementTableProps) => {
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);

  return (
    <>
      <ManagementTable
        data={users}
        columns={userManagementColumns}
        onView={(user) => setViewingUser(user)}
        getRowKey={getRowKey}
        emptyMessage="No users found"
        viewLabel="View Profile"
      />

      {viewingUser && (
        <UserManagementDetailsViewDialog
          open={!!viewingUser}
          onClose={() => setViewingUser(null)}
          user={viewingUser}
        />
      )}
    </>
  );
};

export default UserManagementTable;
