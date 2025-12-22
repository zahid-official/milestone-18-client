"use server";

import { createAdminSchema } from "@/schemas/admin.validation";
import { ActionState } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";

// Create Admin
const createAdmin = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    const adminPayload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedPayload = zodValidator(createAdminSchema, adminPayload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const adminData = validatedPayload.data!;

    const res = await serverFetchApi.post("/admin/create", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to create admin. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: result?.message || "Admin created successfully.",
    };
  } catch (error) {
    console.error("createAdmin error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export { createAdmin };
