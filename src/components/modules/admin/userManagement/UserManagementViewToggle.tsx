"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface UserManagementViewToggleProps {
  isDeletedView?: boolean;
}

const UserManagementViewToggle = ({
  isDeletedView,
}: UserManagementViewToggleProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const viewParam = searchParams.get("view");
  const resolvedIsDeleted =
    typeof isDeletedView === "boolean"
      ? isDeletedView
      : viewParam === "deleted";

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (resolvedIsDeleted) {
      params.delete("view");
    } else {
      params.set("view", "deleted");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Button
      type="button"
      variant={resolvedIsDeleted ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={resolvedIsDeleted}
    >
      {resolvedIsDeleted ? "Show Active Users" : "Show Deleted Users"}
    </Button>
  );
};

export default UserManagementViewToggle;
