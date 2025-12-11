// Define user roles
export type UserRole = "ADMIN" | "VENDOR" | "CUSTOMER";
export type ProductCategory =
  | "CHAIR"
  | "BED"
  | "SOFA"
  | "TABLE"
  | "SIDE_DRAWER"
  | "DINING_CHAIR";

// Define jwt token extract userInfo
export type UserInfo = {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
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
