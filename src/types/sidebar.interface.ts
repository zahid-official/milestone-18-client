import { UserRole } from ".";

export interface NavItem {
  title: string;
  url: string;
  icon: string;
  roles: UserRole[];
}

export interface NavGroup {
  groupLabel?: string;
  navItems: NavItem[];
}
