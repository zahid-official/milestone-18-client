 "use client";
import { ActionState } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

// Interface for IHandleActionStateOptions
interface IHandleActionStateOptions {
  successMessage?: string;
  redirectFallback?: string;
}

// useHandleActionState Hook to handle ActionState side effects (toast + redirect)
const useHandleActionState = (
  state: ActionState | null,
  options: IHandleActionStateOptions = {}
) => {
  const router = useRouter();
  const { successMessage, redirectFallback } = options;

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      const target = state.redirectPath || redirectFallback;
      const successToast = state.message ?? successMessage;
      if (target) {
        router.prefetch(target);
        router.replace(target);
      }
      if (successToast) {
        toast.success(successToast);
      }
    } else if (!state.errors?.length && state.message) {
      // Skip inline validation errors; only toast API/general errors
      if (state.message === "No changes to update.") {
        toast.warning(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router, successMessage, redirectFallback]);
};

export default useHandleActionState;
