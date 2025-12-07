"use server";
import envVars from "@/config/envVars";
import z from "zod";
import loginUser from "./loginUser";

// Zod schema (keep legacy error option style for zod v4)
const registerZodSchema = z
  .object({
    // Name
    name: z
      .string({ error: "Name must be a string" })
      .min(2, { error: "Name must be at least 2 characters long." })
      .max(50, { error: "Name cannot exceed 50 characters." })
      .trim(),

    // Email
    email: z
      .email({ error: "Invalid email format" })
      .min(5, { error: "Email must be at least 5 characters long." })
      .max(100, { error: "Email cannot exceed 100 characters." })
      .trim(),

    // Password
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be string",
      })
      .min(8, { error: "Password must be includes 8 characters long." })

      // Password complexity requirements
      .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
      })
      .trim(),

    // Confirm Password
    confirmPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be string",
      })
      .min(8, { error: "Password must be includes 8 characters long." })

      // Password complexity requirements
      .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
      })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

// registerUser Function
const registerUser = async (_currentState: any, formData: FormData) => {
  try {
    // Validate incoming form data
    const parsed = registerZodSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

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

    // Remove confirmPassword before sending to backend
    const { confirmPassword: _confirmPassword, ...registerData } = parsed.data;
    void _confirmPassword;

    // Call backend API
    const res = await fetch(`${envVars.BACKEND_URL}/customer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });
    const result = await res.json();

    // Handle unsuccessful registration
    if (!result.success) {
      let message = "Registration failed. Please try again.";
      message = result?.message ?? result?.error;
      return {
        success: false,
        message,
      };
    }

    // If registration is successful, login the user automatically
    const loginResult = await loginUser(_currentState, formData);

    // If auto-login fails, surface that
    if (!loginResult.success) {
      return loginResult;
    }

    // Auto-login succeeded, pass through redirect path and message
    return {
      ...loginResult,
      message: "Account created successfully and logged in.",
    };
  } catch (error) {
    console.error("registerUser error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export default registerUser;
