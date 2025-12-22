"use server";

import { createVendorSchema } from "@/schemas/vendor.validation";
import { ActionState } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";

// Create Vendor
const createVendor = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    const vendorPayload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedPayload = zodValidator(createVendorSchema, vendorPayload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const vendorData = validatedPayload.data!;

    const res = await serverFetchApi.post("/vendor/create", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendorData),
    });
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to create vendor. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: result?.message || "Vendor created successfully.",
    };
  } catch (error) {
    console.error("createVendor error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export { createVendor };
