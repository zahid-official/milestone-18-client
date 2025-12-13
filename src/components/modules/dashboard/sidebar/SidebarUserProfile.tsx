"use client";
import LogoutButton from "@/components/modules/auth/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserInfo } from "@/types";
import { ChevronsUpDown, Settings, User } from "lucide-react";
import Link from "next/link";

// SidebarUserProfile Component
const SidebarUserProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  const { isMobile } = useSidebar();
  const displayName = userInfo?.name || "Logged User";
  const displayEmail = userInfo?.email || "N/A";
  const displayAvatar = userInfo?.profilePhoto || userInfo?.avatar;
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={displayAvatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback className="rounded-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{displayEmail}</span>
                {userInfo?.role ? (
                  <span className="truncate text-[10px] uppercase text-muted-foreground">
                    {userInfo.role}
                  </span>
                ) : null}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* Dropdown label */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={displayAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="rounded-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs pb-0.5">{displayEmail}</span>
                  {userInfo?.role ? (
                    <span className="truncate text-[10px] uppercase text-muted-foreground">
                      {userInfo.role}
                    </span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Dropdown items */}
            <DropdownMenuGroup>
              <Link href={"/profile"}>
                <DropdownMenuItem className="cursor-pointer">
                  <User />
                  Profile
                </DropdownMenuItem>
              </Link>

              <Link href={"/change-password"}>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings />
                  Change Password
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Logout btn */}
            <DropdownMenuItem>
              <LogoutButton className="w-full" size="icon" loading={true} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarUserProfile;
