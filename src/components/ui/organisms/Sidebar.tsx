"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { motion, AnimatePresence } from "framer-motion";
import { Radiation, LogOut, Settings2, Menu, X } from "lucide-react";
import { NavMenu, Avatar, Button, ThemeToggle } from "@/components/ui/Index";
import { authService } from "@/services/auth.service"; // 2. Import authService
import { toast } from "sonner"; // Opsional: Untuk notifikasi
import Image from "next/image";

export const Sidebar = ({ menuItems }: { menuItems: any[] }) => {
    const router = useRouter(); // 3. Inisialisasi router
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const closeSidebar = () => setIsMobileOpen(false);

    // 4. Buat fungsi handleLogout
    const handleLogout = () => {
        // Hapus token & cookie
        authService.logout();

        // Tampilkan notifikasi (opsional)
        toast.success("Berhasil Keluar", {
            description: "Sampai jumpa lagi!",
            duration: 2000,
        });

        // Redirect ke login & replace history agar tidak bisa di-back
        router.replace("/login");
    };

    return (
        <>
            {/* MOBILE & TABLET TRIGGER */}
            <div
                className={`lg:hidden fixed z-[110] transition-all duration-300 top-[12px] md:top-[16px] left-4 md:left-8 
        ${isMobileOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}
    `}
            >
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-surface shadow-neumorph border border-white/5 rounded-xl md:rounded-2xl hover:text-[var(--theme-base)] active:scale-95 transition-all"
                >
                    <Menu className="text-text-primary size-5 md:size-6" />
                </button>
            </div>

            {/* BACKDROP */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[90] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR ASIDE */}
            <aside
                className={` fixed left-0 top-0 h-screen z-[100] select-none bg-surface border-r border-border-main/5 flex flex-col transition-all duration-[var(--duration-smooth)] ease-[var(--ease-guway)] w-72 lg:w-72 2xl:w-80 4xl:w-96 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* BRANDING SECTION */}
                <div className="p-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 select-none">
                        <div className=" relative w-12 h-12  bg-black rounded-[18px]  overflow-hidden  flex-shrink-0 shadow-neumorph flex items-center justify-center ">
                            <Image
                                src="/logotubaba.png"
                                alt="Tubaba Logo"
                                fill
                                sizes="48px"
                                priority
                                className="object-contain p-2.5"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-bold tracking-[0.35em] leading-none mb-1.5 text-[var(--theme-base)]">
                                GUWAY
                            </span>
                            <h1 className="text-2xl font-black tracking-tighter text-text-primary leading-none uppercase">
                                Tubaba
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-2 text-text-muted hover:text-[var(--theme-base)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                    <div className="px-3 flex justify-center w-full">
                        <ThemeToggle />
                    </div>
                    <div className="pb-6">
                        <NavMenu
                            onItemClick={closeSidebar}
                            items={menuItems} />
                    </div>
                </div>

                {/* USER PROFILE SECTION */}
                <div className="p-6 mt-auto border-t border-border-main/10 bg-surface-secondary/20 shrink-0">
                    <div className="p-4 rounded-[var(--border-radius)] bg-surface shadow-neumorph border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar src="/logotubaba.png" size="md" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-text-primary truncate uppercase italic">Admin System</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div style={{ backgroundColor: 'var(--theme-base)', boxShadow: 'var(--theme-glow)' }} className="w-1.5 h-1.5 rounded-full" />
                                    <span className="text-[9px] font-bold text-text-muted uppercase">Lvl 4</span>
                                </div>
                            </div>
                            <Button variant="expel" className="w-8 h-8 !p-0 rounded-xl shrink-0"><Settings2 size={14} /></Button>
                        </div>

                        {/* 5. Pasang handler onClick di sini */}
                        <Button
                            variant="danger"
                            className="w-full justify-start gap-3 rounded-2xl group text-[10px]"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            <span className="font-bold uppercase tracking-widest">Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};