import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Separator } from "../../ui/separator";
import Logo from "../Logo";
import { getCookies } from "@/services/auth/cookies";
import LogoutButton from "@/components/modules/auth/LogoutButton";
import CartDialog from "./CartDialog";

const Navbar = async () => {
  // Navigation links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ];

  // Get AccessToken
  const accessToken = await getCookies("accessToken");

  return (
    <nav>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-6">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Desktop Nav */}
          <nav className="text-muted-foreground flex items-center gap-5.5 font-medium max-md:hidden">
            {navLinks?.map((item, idx) => (
              <Link key={idx} href={item?.href} className="hover:text-primary">
                {item?.label}
              </Link>
            ))}
          </nav>

          <Separator
            orientation="vertical"
            className="h-6! mx-2 max-md:hidden"
          />

          {/* Cart & Buttons */}
          <div className="flex md:gap-3.5">
            <CartDialog />

            {accessToken ? (
              <LogoutButton />
            ) : (
              <Link href={"/login"}>
                <Button className="max-md:hidden px-6 text-base">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <nav className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-52 -right-4.5 top-1 absolute border p-3 md:hidden">
                {navLinks?.map((item, idx) => (
                  <DropdownMenuItem key={idx} className="cursor-pointer">
                    <Link href={item?.href} className="hover:text-primary">
                      {item?.label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="mt-2.5" />
                {/* Buttons */}
                <DropdownMenuItem asChild className="bg-transparent! p-0">
                  {accessToken ? (
                    <LogoutButton />
                  ) : (
                    <Link href={"/login"}>
                      <Button className="w-full mt-1.5">Login</Button>
                    </Link>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
