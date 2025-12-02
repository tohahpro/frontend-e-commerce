import { getUserInfo } from "@/services/auth/getUserInfo";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { UserInfo } from "@/types/user.interface";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { NavSection } from "@/types/dashboard.interface";
import { getNavItemsByRole } from "@/lib/navItems.config";

const DashboardSidebar = async () => {

    const userInfo = (await getUserInfo()) as UserInfo;

    const navItems : NavSection[] = getNavItemsByRole(userInfo.role)
    const dashboardHome = getDefaultDashboardRoute(userInfo.role);

    return <DashboardSidebarContent
        userInfo={userInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
    />
};

export default DashboardSidebar;