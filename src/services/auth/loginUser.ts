"use server";
import envVars from "@/config/envVars";
import { parse } from "cookie";
import z from "zod";
import { setCookies } from "./cookies";

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

// Declare types
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
    // Validate incoming form data
    const parsed = loginZodSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
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

    // Call backend API
    const res = await fetch(`${envVars.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
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

    return {
      success: true,
      message: result?.message || "Logged in successfully.",
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
