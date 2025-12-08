"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/types/sidebar.interface";
import Link from "next/link";

// Interface for IProps
interface IProps {
  navGroups: NavGroup[];
}

// SidebarNavigations Component
const SidebarNavigations = ({ navGroups }: IProps) => {
  return (
    <>
      {navGroups?.map((group: NavGroup, idx: number) => (
        <SidebarGroup key={idx}>
          <SidebarGroupLabel>{group?.groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {group?.navItems?.map((item, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton tooltip={item?.title}>
                  {item?.icon && <item.icon />}
                  <Link href={item?.url}>
                    <span>{item?.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarNavigations;
