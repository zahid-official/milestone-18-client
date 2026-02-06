import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jost.variable} ${playfairDisplay.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
