"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/types/sidebar.interface";
import { BookOpen, GitGraph, Home } from "lucide-react";
import * as React from "react";
import SidebarNavigations from "./SidebarNavigations";
import SidebarUserProfile from "./SidebarUserProfile";
import TeamSwitcher from "./TeamSwitcher";
import { userRole } from "@/constants/userRole";

// This is sample data.
const navGroups: NavGroup[] = [
  {
    groupLabel: "Documentation",
    navItems: [
      {
        title: "Introduction",
        url: "",
        icon: BookOpen,
        roles: ["ADMIN"],
      },
      {
        title: "Description",
        url: "",
        icon: GitGraph,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    groupLabel: "Public",
    navItems: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        roles: [...Object.values(userRole)],
      },
    ],
  },
];

// SidebarContainer Component
const SidebarContainer = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Brand logo */}
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent>
        <SidebarNavigations navGroups={navGroups} />
      </SidebarContent>

      {/* User info */}
      <SidebarFooter>
        <SidebarUserProfile />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarContainer;
