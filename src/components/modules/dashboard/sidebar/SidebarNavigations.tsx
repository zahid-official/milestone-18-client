"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/types/sidebar.interface";
import { Bell } from "lucide-react";
import Link from "next/link";

// Interface for IProps
interface IProps {
  navGroups?: NavGroup[];
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
                <Link href={item?.url}>
                  <SidebarMenuButton
                    tooltip={item?.title}
                    className="cursor-pointer"
                  >
                    {/* {item?.icon && <item.icon />} */}
                    <Bell />
                    <p>{item?.title}</p>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarNavigations;
