import { ZodObject } from "zod";

// zodValidator Function
const zodValidator = <T>(schema: ZodObject, payload: T) => {
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
