"use server";
import { changePasswordZodSchema } from "@/schemas/auth.validation";
import { ActionState } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";

// changePassword Function
const changePassword = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    const payload = {
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Validate client-side using zod
    const validatedPayload = zodValidator(changePasswordZodSchema, payload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const { confirmPassword: _confirm, ...body } = validatedPayload.data!;
    void _confirm;

    const res = await serverFetchApi.patch("/auth/changePassword", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to change password. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: result?.message || "Password updated successfully.",
    };
  } catch (error) {
    console.error("changePassword error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export default changePassword;
