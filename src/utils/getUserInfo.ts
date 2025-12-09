"use server";
import envVars from "@/config/envVars";
import { jwt } from "@/import";
import { UserInfo } from "@/types";
import { JwtPayload } from "jsonwebtoken";
import { getCookies } from "../services/auth/cookies";

// getUserInfo Function
const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const accessToken = await getCookies("accessToken");
    if (!accessToken) {
      return null;
    }

    const verifiedToken = jwt.verify(
      accessToken,
      envVars.JWT.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    if (!verifiedToken) {
      return null;
    }

    const userInfo: UserInfo = {
      name: verifiedToken.name || "Logged User",
      email: verifiedToken.email,
      role: verifiedToken.role,
    };

    return userInfo;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export default getUserInfo;
