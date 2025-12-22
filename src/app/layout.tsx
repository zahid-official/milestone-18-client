import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jost = localFont({
  src: "./fonts/Jost-VariableFont_wght.woff2",
  variable: "--font-jost",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-Bold.woff2",
  variable: "--font-playfair-display",
  weight: "700",
  display: "swap",
  style: "normal",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-VariableFont_wght.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Lorvic Furniture",
  description:
    "A modern furniture store showcasing contemporary designs and styles.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${playfairDisplay.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
};

export default RootLayout;
