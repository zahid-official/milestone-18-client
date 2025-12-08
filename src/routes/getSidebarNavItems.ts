import { userRole } from "@/constants/userRole";
import { UserRole } from "@/types";
import { NavGroup } from "@/types/sidebar.interface";
import { getDefaultDashboardRoute } from ".";

// Role based navitems
const adminNavItems: NavGroup[] = [];
const vendorNavItems: NavGroup[] = [];
const customerNavItems: NavGroup[] = [];

// Get common navitems
const getCommonNavItems = (role: UserRole): NavGroup[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      groupLabel: "Profile Management",
      navItems: [
        {
          title: "Profile",
          url: "/profile",
          icon: "User",
          roles: [...Object.values(userRole)],
        },
        {
          title: "Security",
          url: "/change-password",
          icon: "Security",
          roles: [...Object.values(userRole)],
        },
      ],
    },
    {
      groupLabel: "Return to",
      navItems: [
        {
          title: "Dashboard",
          url: defaultDashboard,
          icon: "LayoutDashboard",
          roles: [...Object.values(userRole)],
        },
        {
          title: "Home",
          url: "/",
          icon: "Home",
          roles: [...Object.values(userRole)],
        },
      ],
    },
  ];
};

// Get navitems based on role
const getNavItemsByRole = (role: UserRole): NavGroup[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case userRole.ADMIN:
      return [...commonNavItems, ...adminNavItems];

    case userRole.VENDOR:
      return [...commonNavItems, ...vendorNavItems];

    case userRole.CUSTOMER:
      return [...commonNavItems, ...customerNavItems];

    default:
      return [];
  }
};

export { getNavItemsByRole };
