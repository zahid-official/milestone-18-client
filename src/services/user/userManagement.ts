"use server";
import { updateProfileInfoSchema } from "@/schemas/user.validation";
import { ActionState, IUser } from "@/types";
import serverFetchApi from "@/utils/serverFetchApi";
import zodValidator from "@/utils/zodValidator";

type UsersResponse = {
  success: boolean;
  data: IUser[];
  meta?: {
    page: number;
    limit: number;
    totalPage: number;
    totalDocs: number;
  };
  message?: string;
};

const parseMeta = (meta: unknown) => {
  if (meta && typeof meta === "object") {
    const parsedMeta = meta as Record<string, unknown>;
    return {
      page: Number(parsedMeta.page) || 1,
      limit: Number(parsedMeta.limit) || 10,
      totalPage: Number(parsedMeta.totalPage) || 1,
      totalDocs: Number(parsedMeta.totalDocs) || 0,
    };
  }
  return undefined;
};

// Get all users
const getUsers = async (queryString?: string): Promise<UsersResponse> => {
  try {
    const endpoint = queryString ? `/user?${queryString}` : "/user";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load users. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? result.data : [],
      meta: parseMeta(result?.meta),
      message: result?.message,
    };
  } catch (error) {
    console.error("getUsers error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get deleted users
const getDeletedUsers = async (queryString?: string): Promise<UsersResponse> => {
  try {
    const endpoint = queryString
      ? `/user/deletedUsers?${queryString}`
      : "/user/deletedUsers";
    const res = await serverFetchApi.get(endpoint);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load deleted users. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: [], meta: undefined, message };
    }

    return {
      success: true,
      data: Array.isArray(result?.data) ? result.data : [],
      meta: parseMeta(result?.meta),
      message: result?.message,
    };
  } catch (error) {
    console.error("getDeletedUsers error", error);
    return {
      success: false,
      data: [],
      meta: undefined,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get single user by id
const getUserById = async (
  userId: string
): Promise<{ success: boolean; data: IUser | null; message?: string }> => {
  try {
    if (!userId) {
      return {
        success: false,
        data: null,
        message: "User id is missing.",
      };
    }

    const res = await serverFetchApi.get(`/user/singleUser/${userId}`);
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load user. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: null, message };
    }

    const userData =
      result?.data && typeof result.data === "object" ? result.data : null;

    return {
      success: true,
      data: userData,
      message: result?.message,
    };
  } catch (error) {
    console.error("getUserById error", error);
    return {
      success: false,
      data: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Get profile information of logged-in user
const getProfileInfo = async (): Promise<{
  success: boolean;
  data: IUser | null;
  message?: string;
}> => {
  try {
    const res = await serverFetchApi.get("/user/profile");
    const result = await res.json();

    if (!result?.success) {
      let message = "Failed to load profile. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return { success: false, data: null, message };
    }

    const rawData =
      result?.data && typeof result.data === "object" ? result.data : null;
    const nestedUser =
      rawData &&
      typeof (rawData as Record<string, unknown>).user === "object"
        ? (rawData as Record<string, any>).user
        : null;
    const userIdObj =
      rawData &&
      typeof (rawData as Record<string, unknown>).userId === "object"
        ? (rawData as Record<string, any>).userId
        : null;

    // Merge top-level profile fields with nested user fields (role/status/etc)
    const userData = rawData
      ? ({
          ...(nestedUser ?? {}),
          ...(userIdObj ?? {}),
          ...rawData,
          role:
            (rawData as Record<string, any>).role ??
            (nestedUser as Record<string, any> | null)?.role ??
            (userIdObj as Record<string, any> | null)?.role,
          status:
            (rawData as Record<string, any>).status ??
            (nestedUser as Record<string, any> | null)?.status ??
            (userIdObj as Record<string, any> | null)?.status,
          email:
            (rawData as Record<string, any>).email ??
            (nestedUser as Record<string, any> | null)?.email ??
            (userIdObj as Record<string, any> | null)?.email,
        } as IUser)
      : null;

    return {
      success: true,
      data: userData,
      message: result?.message,
    };
  } catch (error) {
    console.error("getProfileInfo error", error);
    return {
      success: false,
      data: null,
      message: "Something went wrong. Please try again.",
    };
  }
};

// Update profile information of logged-in user
const updateProfileInfo = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionState> => {
  try {
    const getTextValue = (value: FormDataEntryValue | null) =>
      typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : undefined;

    const payload = {
      name: getTextValue(formData.get("name")),
      phone: getTextValue(formData.get("phone")),
      address: getTextValue(formData.get("address")),
      profilePhoto: getTextValue(formData.get("profilePhoto")),
    };

    const file = formData.get("file");
    const validFile = file instanceof File && file.size > 0 ? file : null;

    const MAX_FILE_BYTES = 4.5 * 1024 * 1024;
    if (validFile && validFile.size > MAX_FILE_BYTES) {
      return {
        success: false,
        errors: [
          {
            field: "file",
            message: "Image must be 4.5MB or smaller.",
          },
        ],
        message: "Image exceeds the 4.5MB upload limit.",
      };
    }

    const validatedPayload = zodValidator(
      updateProfileInfoSchema,
      payload
    );

    if (!validatedPayload.success) {
      return validatedPayload;
    }

    const validatedData = validatedPayload.data ?? {};
    const hasBodyUpdates = Object.values(validatedData).some(
      (value) => value !== undefined
    );
    const hasFileUpdate = Boolean(validFile);

    if (!hasBodyUpdates && !hasFileUpdate) {
      return {
        success: false,
        message: "No changes to update.",
      };
    }

    let response: Response;

    if (hasFileUpdate) {
      const backendFormData = new FormData();
      backendFormData.append("data", JSON.stringify(validatedData));
      backendFormData.append("file", validFile!);

      response = await serverFetchApi.patch("/user/profile", {
        body: backendFormData,
      });
    } else {
      response = await serverFetchApi.patch("/user/profile", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });
    }

    const result = await response.json();

    if (!result?.success) {
      let message = "Failed to update profile. Please try again.";
      message = result?.message ?? result?.error ?? message;
      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: result?.message || "Profile updated successfully.",
    };
  } catch (error) {
    console.error("updateProfileInfo error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export {
  getUsers,
  getDeletedUsers,
  getUserById,
  getProfileInfo,
  updateProfileInfo,
};
