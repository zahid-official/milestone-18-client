"use client";

import InfoRow from "@/components/modules/dashboard/managementPage/InfoRow";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountStatus, IUser, UserRole } from "@/types";
import { Calendar, Mail, User } from "lucide-react";

interface UserManagementDetailsViewDialogProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
}

const badgeBase =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";

const statusStyles: Record<AccountStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100",
  INACTIVE: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100",
  BLOCKED:
    "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
};

const roleStyles: Record<UserRole, string> = {
  ADMIN: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-100",
  VENDOR: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-100",
  CUSTOMER: "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-100",
};

const formatLabel = (value?: string) => {
  if (!value) return "Unknown";
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderRoleBadge = (role?: UserRole) => {
  if (!role) return "-";
  const className = `${badgeBase} ${
    roleStyles[role] || "bg-muted text-foreground"
  }`;
  return <span className={className}>{formatLabel(role)}</span>;
};

const renderStatusBadge = (status?: AccountStatus) => {
  if (!status) return "-";
  const className = `${badgeBase} ${
    statusStyles[status] || "bg-muted text-foreground"
  }`;
  return <span className={className}>{formatLabel(status)}</span>;
};

// UserManagementDetailsViewDialog Component
const UserManagementDetailsViewDialog = ({
  open,
  onClose,
  user,
}: UserManagementDetailsViewDialogProps) => {
  if (!user) {
    return null;
  }

  const displayName = user.name || user.email || "Unknown user";
  const displayEmail = user.email || "N/A";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto border-0 bg-background p-0 shadow-2xl">
        <DialogHeader className="sm:px-8 px-4 pt-8">
          <DialogTitle className="text-2xl font-semibold">
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-4 pb-6 sm:px-6 sm:pb-6">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card/50 p-4 shadow-sm">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.profilePhoto}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <p className="text-xl font-semibold">{displayName}</p>
              <p className="text-sm text-muted-foreground">{displayEmail}</p>

              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase">
                {user.role && renderRoleBadge(user.role)}
                {user.status && renderStatusBadge(user.status)}
                {user.isDeleted && (
                  <span className={`${badgeBase} bg-muted text-foreground`}>
                    Deleted
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <User className="size-4 text-muted-foreground" />
                Profile
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="User ID" value={user._id} />
                <InfoRow label="Role" value={formatLabel(user.role)} />
                <InfoRow label="Status" value={formatLabel(user.status)} />
                <InfoRow
                  label="Password Reset"
                  value={user.needChangePassword ? "Required" : "Not required"}
                />
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Mail className="size-4 text-muted-foreground" />
                Contact
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="Email" value={displayEmail} />
                <InfoRow label="Phone" value={user.phone} />
                <InfoRow label="Address" value={user.address} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Calendar className="size-4 text-muted-foreground" />
              Activity
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Joined" value={formatDate(user.createdAt)} />
              <InfoRow label="Last Updated" value={formatDate(user.updatedAt)} />
              <InfoRow label="Deleted" value={user.isDeleted ? "Yes" : "No"} />
              <InfoRow label="Need Change Password" value={user.needChangePassword ? "Yes" : "No"} />
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDetailsViewDialog;
