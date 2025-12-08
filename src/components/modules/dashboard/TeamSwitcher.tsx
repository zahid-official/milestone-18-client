"use client";
import logoImage from "@/assets/logo.svg";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// TeamSwitcher Component
const TeamSwitcher = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* Logo */}
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src={logoImage}
              alt="Lorvic logo"
              className="max-h-7.5 w-auto"
            />
          </div>

          {/* Brand name */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-3xl font-bold">Lorvic</span>
            <span className="truncate text-[10px] font-medium tracking-[0.38em] ml-0.5 -mt-1 text-foreground/70">
              FURNITURE
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default TeamSwitcher;
