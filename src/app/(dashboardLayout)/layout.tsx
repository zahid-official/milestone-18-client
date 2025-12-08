import DashboardSidebar from "@/components/modules/dashboard/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Interface for IProps
interface IProps {
  children: React.ReactNode;
}

// DashboardLayout Component
const DashboardLayout = ({ children }: IProps) => {
  return (
    <div>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          {/* SidebarTrigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
          </header>

          {/* Dynamic content */}
          <div className="p-4 pt-0">
            <main>{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
