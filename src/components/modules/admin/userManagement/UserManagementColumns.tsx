import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { IColumn } from "@/components/modules/dashboard/managementPage/ManagementTable";
import { AccountStatus, IUser, UserRole } from "@/types";

// Badge styling for role and status chips
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

const truncateText = (text: string, max = 36) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderUserCell = (user: IUser) => {
  const displayName = user.name || user.email || "Unknown user";
  const displayEmail = user.email || "N/A";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={user.profilePhoto}
          alt={displayName}
          className="object-cover"
        />
        <AvatarFallback className="text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-0.5">
        <p className="text-sm font-semibold leading-tight">{displayName}</p>
        <p className="text-xs text-muted-foreground">{displayEmail}</p>
      </div>
    </div>
  );
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

const renderAddress = (user: IUser) => {
  if (!user.address) return "-";
  const trimmed = user.address.trim();
  if (!trimmed) return "-";
  const displayText = truncateText(trimmed);

  return (
    <p className="line-clamp-2 text-sm text-muted-foreground" title={trimmed}>
      {displayText}
    </p>
  );
};

// Column definitions for the admin user management table
const userManagementColumns: IColumn<IUser>[] = [
  {
    header: "User",
    accessor: (user) => renderUserCell(user),
    className: "min-w-[200px]",
  },
  {
    header: "Role",
    accessor: (user) => renderRoleBadge(user.role),
    className: "min-w-[120px]",
  },
  {
    header: "Status",
    accessor: (user) => renderStatusBadge(user.status),
    className: "min-w-[120px]",
  },
  {
    header: "Phone",
    accessor: (user) => user.phone || "-",
    className: "min-w-[140px]",
  },
  {
    header: "Address",
    accessor: (user) => renderAddress(user),
    className: "min-w-[200px]",
  },
  {
    header: "Joined",
    accessor: (user) => formatDate(user.createdAt),
    className: "min-w-[120px]",
  },
];

export default userManagementColumns;
