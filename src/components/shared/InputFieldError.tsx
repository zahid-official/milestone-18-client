import { FieldError } from "@/components/ui/field";
import { ActionState } from "@/types";
import getFieldError from "@/utils/getFieldError";

// Displays a single field-specific error inside FieldError
const InputFieldError = ({
  field,
  state,
}: {
  field: string;
  state: ActionState | null;
}) => {
  const message = getFieldError(state, field);

  if (!message) return null;

  return <FieldError>{message}</FieldError>;
};

export default InputFieldError;
