// Define user roles
export type UserRole = "ADMIN" | "VENDOR" | "CUSTOMER";

// Define the structure for route configurations
export type RouteConfig = {
  exactRoutes: string[];
  patternRoutes: RegExp[];
};
