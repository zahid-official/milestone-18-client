import { userRole } from "@/constants/userRole";
import { RouteConfig, UserRole } from "@/types";

// Auth routes (accessible without login)
const authRoutes = ["/login", "/register"];

// Protected routes
const commonProtectedRoutes: RouteConfig = {
  exactRoutes: ["/profile", "/change-password"],
  patternRoutes: [/^\/shop\/[^/]+$/],
};

const adminProtectedRoutes: RouteConfig = {
  exactRoutes: [],
  patternRoutes: [/^\/admin/], // routes start with /admin/* (like: /admin/dashboard/manage-users)
};

const vendorProtectedRoutes: RouteConfig = {
  exactRoutes: [],
  patternRoutes: [/^\/vendor/],
};

const customerProtectedRoutes: RouteConfig = {
  exactRoutes: [],
  patternRoutes: [/^\/dashboard/],
};

// Check routes
const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some((route: string) => route === pathname);
};

const isProtectedRoute = (pathname: string, routes: RouteConfig) => {
  if (routes?.exactRoutes?.includes(pathname)) {
    return true;
  }
  return routes?.patternRoutes?.some((pattern: RegExp) =>
    pattern.test(pathname)
  );
};

// Get route owner
const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
  if (isProtectedRoute(pathname, adminProtectedRoutes)) {
    return userRole.ADMIN;
  }
  if (isProtectedRoute(pathname, vendorProtectedRoutes)) {
    return userRole.VENDOR;
  }
  if (isProtectedRoute(pathname, customerProtectedRoutes)) {
    return userRole.CUSTOMER;
  }
  if (isProtectedRoute(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

// Get default dashboard route
const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === userRole.ADMIN) {
    return "/admin/dashboard";
  }
  if (role === userRole.VENDOR) {
    return "/vendor/dashboard";
  }
  if (role === userRole.CUSTOMER) {
    return "/dashboard";
  }
  return "/";
};

// Validate if redirect path is valid for the user role
const isValidRedirectRole = (redirectPath: string, role: UserRole): boolean => {
  const routeOwner = getRouteOwner(redirectPath);
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  if (routeOwner === role) {
    return true;
  }
  return false;
};

// Export route groups
export {
  isAuthRoute,
  getRouteOwner,
  getDefaultDashboardRoute,
  isValidRedirectRole,
};
