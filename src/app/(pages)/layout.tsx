"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, NavItem, Header, Footer } from "@/components/ui/Index";
import { LayoutDashboard, Upload, FileSpreadsheet, Users } from "lucide-react";
import { authService } from "@/services/auth.service";
import { PageSkeleton } from "@/components/ui/molecules/PageSkeleton";

// Menu configuration with role-based access
const allMenuItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['admin', 'bank', 'viewer'] },
  { href: "/input-data", label: "Input Data", icon: Upload, roles: ['admin', 'bank'] },
  { href: "/list-data", label: "Riwayat Data", icon: FileSpreadsheet, roles: ['admin', 'bank', 'viewer'] },
  { href: "/users", label: "Kelola User", icon: Users, roles: ['admin'] },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = authService.getToken();
        const userRole = authService.getRole();
        const userData = authService.getUserData();
        
        console.log("[Layout] Token:", token ? "exists" : "missing");
        console.log("[Layout] Role:", userRole);
        console.log("[Layout] UserData:", userData);
        
        // Jika tidak ada token, redirect ke login
        if (!token) {
          router.push("/login");
          return;
        }
        
        // Jika tidak ada role, coba cek userData
        let finalRole = userRole;
        if (!finalRole && userData) {
          finalRole = userData.role as 'admin' | 'bank' | 'viewer';
          // Simpan role jika ditemukan dari userData
          authService.setRole(finalRole);
        }
        
        // Jika tetap tidak ada role, redirect ke login
        if (!finalRole) {
          console.log("[Layout] No role found, redirecting to login");
          router.push("/login");
          return;
        }

        // Filter menu items based on role
        const filteredItems = allMenuItems.filter(item => {
          if (!item.roles) return true;
          return item.roles.includes(finalRole as 'admin' | 'bank' | 'viewer');
        });

        setMenuItems(filteredItems);
        console.log("[Layout] Menu items filtered:", filteredItems.map(i => i.label));
      } catch (error) {
        console.error("[Layout] Error initializing auth:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Jika menuItems kosong setelah loading, berarti tidak ada akses
  if (menuItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Tidak ada menu yang tersedia untuk role Anda.</p>
          <button 
            onClick={() => {
              authService.logout();
              router.push("/login");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            logout
          </button>
        </div>
      </div>
    );
  }

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