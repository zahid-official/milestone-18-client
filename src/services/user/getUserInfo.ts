import envVars from "@/config/envVars";

// getUserInfo Function
const getUserInfo = async () => {
  try {
    const res = await fetch(`${envVars.BACKEND_URL}/user/profile`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();

    // Handle unsuccessful retrival
    if (!result.success) {
      return {
        success: false,
        message:
          result?.message ||
          "Failed to retrive profile info. Please try again.",
        data: null,
      };
    }

    return {
      success: true,
      message: result?.message || "Profile info retrived successfully.",
      data: result?.data,
    };
  } catch (error) {
    console.error("getUserInfo:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
};

export default getUserInfo;
