"use client";

import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Github, href: "#" },
    { icon: Twitter, href: "#" },
  ];

  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="pt-18 pb-8 text-sm mx-auto max-w-7xl w-full"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="w-full mx-auto flex flex-col gap-8 px-5">
        {/* Top Grid */}
        <div className="grid grid-cols-1 items-center gap-10 text-center sm:grid-cols-2 lg:grid-cols-5 lg:items-start lg:gap-6 lg:text-left">
          {/* Branding */}
          <div className="flex w-full flex-col items-center gap-4 pr-0 lg:col-span-2 lg:items-start lg:pr-12">
            <Link aria-label="Go to homepage" href="/">
              <Logo />
            </Link>

            <p className="text-base -mt-1.5">
              Curating timeless furniture to elevate every room, blending modern
              design with everyday comfort for your home.
            </p>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-medium -mt-1 mb-2 flex items-center gap-1">
                Follow us{" "}
                <span className="inline-block h-px w-12 bg-black"></span>
              </h3>
              <div
                className="flex justify-center gap-4"
                aria-label="Social media links"
              >
                {/* Social Icons */}
                {socialLinks.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column Sections */}
          {[
            {
              title: "Company",
              links: [
                { label: "About Lorvic", href: "/about-us" },
                { label: "Showroom", href: "/contact" },
                { label: "Support", href: "/contact" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Features", href: "/shop" },
                { label: "Guides", href: "/contact" },
                { label: "FAQs", href: "/faq" },
                { label: "Accessibility", href: "/contact" },
              ],
            },
            {
              title: "Contact Us",
              links: [
                {
                  label:
                    "House-256, Road-15, Sector-07, Uttara, Dhaka, Bangladesh",
                  href: "/contact",
                },
                { label: "(+880) 19125 48765", href: "/contact" },
                { label: "support@lorvic.com", href: "/contact" },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h2 className="text-foreground text-base font-medium">
                {section.title}
              </h2>
              <nav
                className="flex flex-col gap-3"
                aria-label={`${section.title} links`}
              >
                {section.links.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item?.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          data-orientation="horizontal"
          role="presentation"
          className="bg-border shrink-0 h-px w-full"
        />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p className="text-muted-foreground order-2 text-center lg:order-1 lg:text-left">
            <span>Copyright © {currentYear}</span>{" "}
            <Link className="hover:underline" href="/">
              Lorvic Furniture
            </Link>
            . All rights reserved.
          </p>

          <nav
            className="order-1 flex flex-col items-center gap-4 text-center lg:order-2 lg:flex-row lg:items-start lg:gap-8 lg:text-left"
            aria-label="Legal links"
          >
            {["Privacy Policy", "Terms of Service", "Cookies Settings"].map(
              (item) => (
                <Link
                  key={item}
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
