"use client";
import { Button } from "@/components/ui/button";
import logoutUser from "@/services/auth/logoutUser";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

// LogoutButton Component
const LogoutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutUser();

      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div>
      <Button onClick={handleLogout} disabled={isPending}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
