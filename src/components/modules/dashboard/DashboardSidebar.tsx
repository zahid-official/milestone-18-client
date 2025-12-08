"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";
import * as React from "react";
import DashboardNavbar from "./DashboardNavbar";
import TeamSwitcher from "./TeamSwitcher";
import UserProfile from "./UserProfile";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
  ],
};

// DashboardSidebar Component
const DashboardSidebar = ({
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
        <DashboardNavbar items={data.navMain} />
      </SidebarContent>

      {/* User info */}
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
