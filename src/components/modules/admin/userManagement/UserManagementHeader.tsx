"use client";

import ManagementHeader from "@/components/modules/dashboard/managementPage/ManagementHeader";

interface UserManagementHeaderProps {
  isDeletedView?: boolean;
}

// UserManagementHeader Component
const UserManagementHeader = ({
  isDeletedView = false,
}: UserManagementHeaderProps) => {
  const title = isDeletedView ? "Deleted Users" : "User Management";
  const description = isDeletedView
    ? "Review deleted accounts and their profile details."
    : "Review accounts, roles, and activity for all users.";

  return <ManagementHeader title={title} description={description} />;
};

export default UserManagementHeader;
