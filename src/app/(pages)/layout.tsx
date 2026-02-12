"use client";

import React from "react";
import { Sidebar, NavItem, Header, Footer } from "@/components/ui/Index";
import { Layers, LayoutDashboard, Palette, Mail, FilePlus, Share2, Settings, MonitorCog } from "lucide-react";

// Menu Configuration
const menuItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/surat",
    label: "Surat",
    icon: Mail,
    children: [
      {
        href: "/surat/pembuatan",
        label: "Pembuatan Surat",
        icon: FilePlus,
        children: [
          { href: "/surat/pembuatan/daftar", label: "Daftar Surat" },
          { href: "/surat/pembuatan/editor", label: "Pembuatan & Editor Surat" },
          { href: "/surat/pembuatan/koordinasi", label: "Koordinasi & TTE" },
        ]
      },
      {
        href: "/surat/distribusi",
        label: "Distribusi Surat",
        icon: Share2,
        children: [
          { href: "/surat/distribusi/daftar", label: "Daftar Distribusi Surat" },
          { href: "/surat/distribusi/masuk", label: "Registrasi Surat" },
          { href: "/surat/distribusi/disposisi", label: "Surat Disposisi" },
        ]
      },
      {
        href: "/surat/config",
        label: "Config",
        icon: MonitorCog,
        children: [
          { href: "/surat/config/kategori", label: "Kategori" },
          { href: "/surat/config/koordinasi", label: "List Paraf Koordinasi" },
        ]
      }
    ]
  },
  {
    href: "/documentation",
    label: "Components",
    icon: Layers,
    children: [
      { href: "/documentation/atom", label: "Atoms" },
      { href: "/documentation/molecules", label: "Molecules" }
    ]
  },
  { href: "/documentation/foundations/colors", label: "Colors & Tokens", icon: Palette },
];

export default function PagesLayout({
  children,
  activeColor = "peach", // Default Theme Color
}: {
  children: React.ReactNode;
  activeColor?: "primary" | "success" | "danger" | "warning" | "info" | "teal" | "peach" | "lime";
}) {

  // Apply CSS Variables for Theme
  const themeStyles = {
    "--theme-base": `var(--${activeColor}-base)`,
    "--theme-active": `var(--${activeColor}-active)`,
    "--theme-hover": `var(--${activeColor}-hover)`,
    "--theme-glow": `var(--${activeColor}-glow)`,
  } as React.CSSProperties;

  return (
    // Wrapper div ini menggantikan fungsi body di layout sebelumnya
    <div className="flex min-h-screen overflow-hidden transition-colors duration-500" style={themeStyles}>

      {/* 1. SIDEBAR */}
      <Sidebar menuItems={menuItems} />

      {/* 2. MAIN WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500 ml-0 lg:ml-72 2xl:ml-80 [media(min-width:2560px)]:ml-96">

        {/* 3. HEADER */}
        <Header />

        {/* 4. CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="relative p-6 md:p-10 max-w-7xl mx-auto">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}