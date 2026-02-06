// Define user roles
export type UserRole = "ADMIN" | "VENDOR" | "CUSTOMER";

// Define account status
export type AccountStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

// User shape returned from backend
export interface IUser {
  _id?: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  isDeleted: boolean;
  needChangePassword: boolean;
  name?: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define jwt token extract userInfo
export type UserInfo = {
  _id?: string;
  name?: string;
  email: string;
  role: UserRole;
  status?: AccountStatus;
  isDeleted?: boolean;
  needChangePassword?: boolean;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  avatar?: string;
  createdAt?: string;
};

// Define the structure for route configurations
export type RouteConfig = {
  exactRoutes: string[];
  patternRoutes: RegExp[];
};

// Standard shape for server action responses
export type ActionState<TData = Record<string, unknown>> = {
  success: boolean;
  message?: string;
  redirectPath?: string;
  data?: TData;
  errors?: {
    field: string;
    message: string;
  }[];
};

// Re-export order types
export * from "./order.interface";
export * from "./coupon.interface";
