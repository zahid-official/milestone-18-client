"use server";
import envVars from "@/config/envVars";
import { jwt } from "@/import";
import { getDefaultDashboardRoute, isValidRedirectRole } from "@/routes";
import { loginZodSchema } from "@/schemas/auth.validation";
import { ActionState, UserRole } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import { parse } from "cookie";
import { setCookies } from "./cookies";
import zodValidator from "@/utils/zodValidator";

// loginUser Function
const loginUser = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    // Get redirect path from formData
    const redirectTo = formData.get("redirect") || null;

    // Validate incoming form data
    const loginPayload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const validatedPayload = zodValidator(loginZodSchema, loginPayload);
    if (!validatedPayload.success) {
      return validatedPayload;
    }

    // Call backend API
    const validatedData = validatedPayload?.data ?? {};
    const res = await serverFetchApi.post("/auth/login", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    const result = await res.json();

    // Handle unsuccessful login
    if (!result.success) {
      let message = "Login failed. Please try again.";
      message = result?.message ?? result?.error;
      return {
        success: false,
        message,
      };
    }

    // Handle successful login
    let accessTokenData: Record<string, string> | undefined;
    let refreshTokenData: Record<string, string> | undefined;
    const setCookieHeaders = res.headers.getSetCookie();

    // Extract tokens from Set-Cookie headers
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);
        if (parsedCookie?.accessToken) {
          accessTokenData = parsedCookie as Record<string, string>;
        }
        if (parsedCookie?.refreshToken) {
          refreshTokenData = parsedCookie as Record<string, string>;
        }
      });
    } else {
      throw new Error("No Set-Cookie headers found in the response");
    }

    // Handle invalid tokens
    if (!accessTokenData || !refreshTokenData) {
      throw new Error("Invalid token provided, authorization denied");
    }

    // Set cookies in the response
    await setCookies("accessToken", accessTokenData.accessToken);
    await setCookies("refreshToken", refreshTokenData.refreshToken);

    // Verify access token and get user role
    const verifiedToken = jwt.verify(
      accessTokenData.accessToken,
      envVars.JWT.ACCESS_TOKEN_SECRET
    );
    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token provided, authorization denied");
    }

    // Redirect user based on role and redirectTo parameter
    const loggedUserRole: UserRole = verifiedToken?.role;
    const target =
      redirectTo && isValidRedirectRole(redirectTo.toString(), loggedUserRole)
        ? `${redirectTo}`
        : `${getDefaultDashboardRoute(loggedUserRole)}`;

    return {
      success: true,
      message: result?.message || "Logged in successfully.",
      redirectPath: target || `${getDefaultDashboardRoute(loggedUserRole)}`,
    };
  } catch (error) {
    console.error("loginUser error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export default loginUser;
