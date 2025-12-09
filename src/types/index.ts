// Define user roles
export type UserRole = "ADMIN" | "VENDOR" | "CUSTOMER";

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
