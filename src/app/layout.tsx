"use client";

import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Sidebar, NavItem, Header, Footer } from "@/components/ui/Index";
import { Layers, LayoutDashboard, Palette } from "lucide-react";

// Konfigurasi font dan menu tetap sama
const tubabaFont = localFont({
  src: [
    { path: "../components/fonts/Tubaba-Light.ttf", weight: "300" },
    { path: "../components/fonts/Tubaba-Regular.ttf", weight: "400" },
    { path: "../components/fonts/Tubaba-Medium.ttf", weight: "500" },
    { path: "../components/fonts/Tubaba-Bold.ttf", weight: "700" },
    { path: "../components/fonts/Tubaba-Heavy.ttf", weight: "900" },
  ],
  variable: "--font-tubaba",
});

const menuItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "#",
    label: "Components",
    icon: Layers,
    children: [
      { href: "/documentation/atom", label: "Atoms" },
      { href: "/documentation/molecules", label: "Molecules" }
    ]
  },
  { href: "/documentation/foundations/colors", label: "Colors & Tokens", icon: Palette },
];

export default function RootLayout({
  children,
  activeColor = "peach",
  isDark = false
}: {
  children: React.ReactNode;
  activeColor?: "primary" | "success" | "danger" | "warning" | "info" | "teal" | "peach" | "lime";
  isDark?: boolean;
}) {


  const themeStyles = {
    "--theme-base": `var(--${activeColor}-base)`,
    "--theme-active": `var(--${activeColor}-active)`,
    "--theme-hover": `var(--${activeColor}-hover)`,
    "--theme-glow": `var(--${activeColor}-glow)`,
  } as React.CSSProperties;

  return (
    <html lang="en" className={isDark ? "dark" : ""} style={themeStyles}>
      <body className={`${tubabaFont.variable} font-sans bg-main-bg text-text-primary antialiased transition-colors duration-500`}>
        <ToastProvider>
          <div className="flex min-h-screen overflow-hidden">
            {/* 1. SIDEBAR (Dibuat responsif di dalamnya) */}
            <Sidebar menuItems={menuItems} />

            {/* 2. MAIN WRAPPER: Mengatur margin adaptif untuk HD, 2K, 4K */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500 ml-0 lg:ml-72 2xl:ml-80 [media(min-width:2560px)]:ml-96 ">

              {/* 3. HEADER: Sticky di atas content area */}
              <Header />

              {/* 4. SCROLLABLE CONTENT AREA */}
              <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="relative p-6 md:p-10 max-w-7xl mx-auto">
                  {children}
                </div>
                <Footer />
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}