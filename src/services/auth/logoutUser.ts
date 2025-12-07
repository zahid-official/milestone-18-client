"use server";
import envVars from "@/config/envVars";
import { deleteCookies } from "./cookies";

// logoutUser Function
const logoutUser = async () => {
  try {
    const res = await fetch(`${envVars.BACKEND_URL}/auth/logout`, {
      method: "POST",
      cache: "no-store",
    });
    const result = await res.json();

    // Handle unsuccessful logout
    if (!result.success) {
      return {
        success: false,
        message: result?.message || "Logout failed. Please try again.",
      };
    }

    // Handle successful logout
    await deleteCookies("accessToken");
    await deleteCookies("refreshToken");

    return {
      success: true,
      message: result?.message || "Logged out successfully.",
    };
  } catch (error) {
    console.error("logoutUser error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export default logoutUser;
