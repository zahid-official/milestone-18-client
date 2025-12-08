"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/types/sidebar.interface";
import getIconComponent from "@/utils/getIconComponent";
import Link from "next/link";

// Interface for IProps
interface IProps {
  navGroups?: NavGroup[];
}

// SidebarNavigations Component
const SidebarNavigations = ({ navGroups }: IProps) => {
  return (
    <>
      {navGroups?.map((group: NavGroup, index: number) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group?.groupLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {group?.navItems?.map((item, idx) => {
              const IconComponent = getIconComponent(item.icon);

              return (
                <SidebarMenuItem key={idx}>
                  <Link href={item?.url}>
                    <SidebarMenuButton
                      tooltip={item?.title}
                      className="cursor-pointer"
                    >
                      <IconComponent />
                      <p>{item?.title}</p>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarNavigations;
