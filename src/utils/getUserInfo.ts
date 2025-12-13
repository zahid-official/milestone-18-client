"use server";
import envVars from "@/config/envVars";
import { jwt } from "@/import";
import { getProfileInfo } from "@/services/user/userManagement";
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

    if (!verifiedToken || typeof verifiedToken === "string") {
      return null;
    }

    const baseUser: UserInfo = {
      _id: verifiedToken._id as string | undefined,
      name:
        typeof verifiedToken.name === "string" && verifiedToken.name.trim()
          ? verifiedToken.name
          : undefined,
      email: verifiedToken.email,
      role: verifiedToken.role,
      status: verifiedToken.status as UserInfo["status"],
      isDeleted: verifiedToken.isDeleted as boolean | undefined,
      needChangePassword: verifiedToken.needChangePassword as boolean | undefined,
    };

    const profileResult = await getProfileInfo();
    if (profileResult?.success && profileResult.data) {
      const profile = profileResult.data;
      return {
        ...baseUser,
        ...profile,
        avatar: profile.profilePhoto ?? baseUser.avatar,
        name: profile.name ?? baseUser.name ?? "Logged User",
        email: profile.email ?? baseUser.email,
        role: profile.role ?? baseUser.role,
        status: profile.status ?? baseUser.status,
      };
    }

    return {
      ...baseUser,
      name: baseUser.name ?? "Logged User",
    };
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export default getUserInfo;
