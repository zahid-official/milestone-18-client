import { ActionState } from "@/types";

// getFieldError Function
const getFieldError = (
  state: ActionState | null,
  field: string
): string | undefined => {
  return state?.errors?.find((error) => error.field === field)?.message;
};

export default getFieldError;
