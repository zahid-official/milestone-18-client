import { getDefaultDashboardRoute } from "@/routes";
import { getNavItemsByRole } from "@/routes/getSidebarNavItems";
import { UserInfo } from "@/types";
import { NavGroup } from "@/types/sidebar.interface";
import getUserInfo from "@/utils/getUserInfo";
import SidebarContainer from "./sidebar/SidebarContainer";

// DashboardSidebar Component
const DashboardSidebar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;
  const navGroups: NavGroup[] = getNavItemsByRole(userInfo?.role);
  const defaultDashboard = getDefaultDashboardRoute(userInfo.role);

  return (
    <SidebarContainer
      userInfo={userInfo}
      navGroups={navGroups}
      defaultDashboard={defaultDashboard}
    />
  );
};

export default DashboardSidebar;
