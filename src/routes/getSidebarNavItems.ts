import { userRole } from "@/constants/userRole";
import { UserRole } from "@/types";
import { NavGroup } from "@/types/sidebar.interface";
import { getDefaultDashboardRoute } from ".";

// Role based navitems
const adminNavItems: NavGroup[] = [
  {
    groupLabel: "Admin Section",
    navItems: [
      {
        title: "User Management",
        url: "/admin/user-management",
        icon: "Users",
        roles: [userRole.ADMIN],
      },
      {
        title: "Order Overview",
        url: "/admin/order-overview",
        icon: "ClipboardList",
        roles: [userRole.ADMIN],
      },
      {
        title: "Coupon Management",
        url: "/admin/coupon-management",
        icon: "TicketPercent",
        roles: [userRole.ADMIN],
      },
    ],
  },
];

const vendorNavItems: NavGroup[] = [
  {
    groupLabel: "Vendor Section",
    navItems: [
      {
        title: "Product Management",
        url: "/vendor/product-management",
        icon: "Sofa",
        roles: [userRole.VENDOR],
      },
      {
        title: "Order Management",
        url: "/vendor/order-management",
        icon: "ClipboardList",
        roles: [userRole.VENDOR],
      },
      {
        title: "Coupon Management",
        url: "/vendor/coupon-management",
        icon: "TicketPercent",
        roles: [userRole.VENDOR],
      },
    ],
  },
];

const customerNavItems: NavGroup[] = [
  {
    groupLabel: "Customer Service",
    navItems: [
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: "ShoppingBag",
        roles: [userRole.CUSTOMER],
      },
    ],
  },
];

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
          icon: "Settings",
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
      return [...adminNavItems, ...commonNavItems];

    case userRole.VENDOR:
      return [...vendorNavItems, ...commonNavItems];

    case userRole.CUSTOMER:
      return [...customerNavItems, ...commonNavItems];

    default:
      return [];
  }
};

export { getNavItemsByRole };
