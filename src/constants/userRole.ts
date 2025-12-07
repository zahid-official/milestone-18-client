import { UserRole } from "@/types";

export const userRole = {
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
} as const satisfies Record<UserRole, UserRole>;
