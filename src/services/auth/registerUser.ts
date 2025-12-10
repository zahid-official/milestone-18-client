"use server";
import serverFetchApi from "@/utils/serverFetchApi";
import { registerZodSchema } from "@/zod/auth.validation";
import loginUser from "./loginUser";

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
    const res = await serverFetchApi.post("/customer/create", {
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
