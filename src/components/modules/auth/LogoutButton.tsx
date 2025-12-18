"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CART_KEY, useOptionalCart } from "@/providers/CartProvider";
import logoutUser from "@/services/auth/logoutUser";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

// Interface for IProps
interface IProps {
  variant?:
    | "default"
    | "link"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  className?: string;
  loading?: boolean;
}
// LogoutButton Component
const LogoutButton = ({
  variant = "default",
  size = "default",
  className,
  loading = false,
}: IProps) => {
  const router = useRouter();
  const cart = useOptionalCart();
  const [isPending, startTransition] = useTransition();

  const clearCart = () => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error("Failed to clear cart from storage", error);
    }

    cart?.clearCart();
  };

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutUser();

      if (res.success) {
        clearCart();
        const target = "/login";
        router.prefetch(target);
        router.replace(target);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isPending}
    >
      {loading && isPending ? (
        <>
          <Spinner />
          Logging out...
        </>
      ) : (
        "Logout"
      )}
    </Button>
  );
};

export default LogoutButton;
