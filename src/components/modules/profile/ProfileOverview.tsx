"use client";
import ManagementHeader from "@/components/modules/dashboard/managementPage/ManagementHeader";
import UpdateProfileDialog from "@/components/modules/profile/UpdateProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/types";
import { PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";

interface IProfileOverviewProps {
  user: IUser | null;
}

const formatDate = (value?: string) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | ReactNode;
}) => (
  <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className="text-sm font-medium text-foreground/90">
      {value ?? "Not provided"}
    </p>
  </div>
);

// ProfileOverview Component
const ProfileOverview = ({ user }: IProfileOverviewProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const displayName = user?.name ?? "Logged User";
  const displayEmail = user?.email ?? "N/A";
  const displayAvatar = user?.profilePhoto;
  const initials = useMemo(
    () => displayName.substring(0, 2).toUpperCase(),
    [displayName]
  );

  const statusTone =
    user?.status === "ACTIVE"
      ? "text-green-600 border-green-500/60 bg-green-50"
      : user?.status === "BLOCKED"
      ? "text-destructive border-destructive/50 bg-destructive/10"
      : "text-amber-700 border-amber-500/50 bg-amber-50";

  return (
    <>
      {isDialogOpen && (
        <UpdateProfileDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSuccess}
          user={user}
        />
      )}

      <div className="space-y-6 max-w-xl mx-auto">
        <ManagementHeader
          title="My Profile"
          description="View and update your personal information."
          action={{
            label: "Edit Profile",
            icon: PenLine,
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <div className="grid gap-4 md:grid-cols-[280px,1fr]">
          {/* Summary card */}
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-background p-5 text-center shadow-sm">
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage
                src={displayAvatar}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-full font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">
                {displayName}
              </p>
              <p className="text-sm text-muted-foreground">{displayEmail}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase">
              {user?.role && (
                <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-foreground/80">
                  {user.role}
                </span>
              )}
              {user?.status && (
                <span
                  className={`rounded-full border px-2.5 py-1 ${statusTone}`}
                >
                  {user.status}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 rounded-lg border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Profile Details
                </h3>
                <p className="text-sm text-muted-foreground -mt-0.5">
                  Keep your information accurate for a smoother experience.
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Full Name" value={displayName} />
              <InfoItem label="Email" value={displayEmail} />
              <InfoItem label="Phone" value={user?.phone} />
              <InfoItem label="Address" value={user?.address} />
              <InfoItem label="Account Status" value={user?.status} />
              <InfoItem label="Role" value={user?.role} />
              <InfoItem label="Member Since" value={formatDate(user?.createdAt)} />
              <InfoItem
                label="Last Updated"
                value={formatDate(user?.updatedAt)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileOverview;
