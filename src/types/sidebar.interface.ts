import { type LucideIcon } from "lucide-react";
import { UserRole } from ".";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface NavGroup {
  groupLabel?: string;
  navItems: NavItem[];
}
