import { ActionState } from "@/types";
import * as z from "zod";

// zodValidator Function (object schemas only)
const zodValidator = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  payload: unknown
): ActionState<z.infer<T>> => {
  const parsed = schema.safeParse(payload);

  // Map zod issues to a simple array for UI consumption
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path[issue.path.length - 1]?.toString(),
        message: issue.message,
      })),
      message: "Please fix the highlighted errors.",
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
};

export default zodValidator;
