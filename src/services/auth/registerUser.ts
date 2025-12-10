"use server";
import { registerZodSchema } from "@/schemas/auth.validation";
import serverFetchApi from "@/utils/serverFetchApi";
import loginUser from "./loginUser";
import { ActionState } from "@/types";
import zodValidator from "@/utils/zodValidator";

// registerUser Function
const registerUser = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    // Validate incoming form data
    const registerPayload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };
    const validatedPayload = zodValidator(registerZodSchema, registerPayload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    // Remove confirmPassword before sending to backend
    const validatedData = validatedPayload.data!;
    const { confirmPassword: _confirmPassword, ...registerData } =
      validatedData;
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
