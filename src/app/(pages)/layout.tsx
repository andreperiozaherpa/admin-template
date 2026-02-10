"use client";

import React from "react";
import { Sidebar, NavItem, Header, Footer } from "@/components/ui/Index"; // Pastikan path import benar
import { Layers, LayoutDashboard, Palette, Mail, FilePlus, Share2 } from "lucide-react";

// Menu Items dipindahkan ke sini karena hanya Dashboard yang butuh
const menuItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  // {
  //   href: "/surat",
  //   label: "Surat",
  //   icon: Mail, 
  //   children: [ ... ]
  // },
  {
    href: "/documentation",
    label: "Components",
    icon: Layers,
    children: [
      { href: "/documentation/atom", label: "Atoms" },
      { href: "/documentation/molecules", label: "Molecules" },
      { href: "/documentation/foundations/colors", label: "Colors & Tokens", icon: Palette }
    ]
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* 1. SIDEBAR */}
      <Sidebar menuItems={menuItems} />

      {/* 2. MAIN WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500 ml-0 lg:ml-72 2xl:ml-80 [media(min-width:2560px)]:ml-96 ">

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