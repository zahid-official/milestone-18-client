"use server";
import envVars from "@/config/envVars";
import z from "zod";

// Schema for login validation
const loginZodSchema = z.object({
  // Email
  email: z
    .email({ error: "Invalid email format." })
    .min(5, { error: "Email must be at least 5 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." })
    .trim(),

  // Password
  password: z
    .string({ error: "Password is required." })
    .min(8, { error: "Password must be at least 8 characters long." })
    .trim(),
});

type LoginActionState = {
  success: boolean;
  message?: string;
  errors?: Array<{ field?: string; message?: string }>;
};

// loginUser Function
const loginUser = async (
  _currentState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const endpoint = `${envVars.BACKEND_URL}/auth/login`;

    const parsed = loginZodSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

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

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      let message = "Login failed. Please try again.";
      try {
        const errorBody = await response.json();
        message =
          errorBody?.message ||
          errorBody?.error ||
          errorBody?.errors?.join?.(", ") ||
          message;
      } catch {
        // ignore JSON parse issues, fall back to default message
      }

      return {
        success: false,
        message,
      };
    }

    const data = await response.json().catch(() => null);

    return {
      success: true,
      message: data?.message || "Logged in successfully.",
    };
  } catch (error) {
    console.error("loginUser error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export type { LoginActionState };
export default loginUser;
