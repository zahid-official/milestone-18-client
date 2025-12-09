"use client";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// Interface for IRefreshButtonProps
interface IRefreshButtonProps {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
  className?: string;
}

// TableRefreshButton Component
const TableRefreshButton = ({
  size = "default",
  variant = "default",
  className,
  showLabel = true,
}: IRefreshButtonProps) => {
  // Hooks for router and transition state
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Handler to refresh the table data
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isPending}
      className={className}
      aria-label="Refresh table"
      aria-busy={isPending}
      aria-live="polite"
    >
      {/* Spin the refresh icon while pending to avoid layout shift */}
      <RefreshCcw
        className={`size-4 ${isPending ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      {showLabel && "Refresh"}
    </Button>
  );
};

export default TableRefreshButton;
