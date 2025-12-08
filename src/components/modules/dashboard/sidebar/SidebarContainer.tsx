"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserInfo } from "@/types";
import { NavGroup } from "@/types/sidebar.interface";
import SidebarNavigations from "./SidebarNavigations";
import SidebarUserProfile from "./SidebarUserProfile";
import TeamSwitcher from "./TeamSwitcher";

// Interface for IProps
interface IProps {
  userInfo: UserInfo;
  navGroups?: NavGroup[];
  defaultDashboard?: string;
}

// SidebarContainer Component
const SidebarContainer = ({
  userInfo,
  navGroups,
  defaultDashboard,
}: IProps) => {
  return (
    <Sidebar collapsible="icon">
      {/* Brand logo */}
      <SidebarHeader>
        <TeamSwitcher defaultDashboard={defaultDashboard} />
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent>
        <SidebarNavigations navGroups={navGroups} />
      </SidebarContent>

      {/* User info */}
      <SidebarFooter>
        <SidebarUserProfile userInfo={userInfo} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarContainer;
