"use client";

import React, { useState } from "react";
import {
    Bell,
    Info,
    AlertTriangle,
    CheckCircle2,
    LayoutDashboard,
    FileText,
    Radiation,
    Target,
    Palette
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Breadcrumbs, SearchInput } from "@/components/ui/Index";

// --- 1. DATA QUICK ACCESS GLOBAL ---
// Data ini akan dideteksi oleh SearchInput untuk navigasi cepat
const GLOBAL_QUICK_ACCESS = [
    { id: "nav-db", title: "Dashboard", category: "System", icon: LayoutDashboard, href: "/dashboard" },
    { id: "nav-ps", title: "Pembuatan Surat", category: "Surat", icon: FileText, href: "/surat/pembuatan" },
    { id: "nav-da", title: "Dokumentasi Atom", category: "Design System", icon: Radiation, href: "/documentation/atom" },
    { id: "nav-dm", title: "Dokumentasi Molecules", category: "Design System", icon: Target, href: "/documentation/molecules" },
    { id: "nav-ct", title: "Colors & Tokens", category: "Foundations", icon: Palette, href: "/documentation/foundations/colors" },
];

const INITIAL_NOTIFICATIONS = [
    { id: 1, type: "info", title: "Quantum Sync", message: "Protokol sinkronisasi berhasil.", time: "2m ago", isRead: false },
    { id: 2, type: "warning", title: "Security Alert", message: "Upaya akses terdeteksi di Terminal 04.", time: "15m ago", isRead: true },
    { id: 3, type: "success", title: "Update Ready", message: "Versi 2.0.26 tersedia untuk diinstal.", time: "1h ago", isRead: false },
];

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
    const [searchHeader, setSearchHeader] = useState("");

    const markAsRead = (id: number) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = notifs.filter(n => !n.isRead).length;

    return (
        <header
            className={`sticky top-0 w-full select-none bg-surface transition-all duration-[var(--duration-smooth)] ease-[var(--ease-guway)] ${isOpen ? 'z-[150]' : 'z-40'}`}
        >
            <div className="flex h-16 md:h-20 items-center gap-2 md:gap-4 px-4 md:px-8">

                {/* LEFT: Breadcrumbs */}
                <div className="flex-none lg:flex-1 flex items-center">
                    <div className="w-10 lg:hidden shrink-0" />
                    <div className="hidden lg:block">
                        <Breadcrumbs />
                    </div>
                </div>

                {/* CENTER: Fixed Search Input */}
                <div className="flex-1 md:flex-[1.5] flex justify-center min-w-0">
                    <SearchInput
                        data={GLOBAL_QUICK_ACCESS} // Mengirimkan data untuk deteksi otomatis
                        value={searchHeader}
                        onChange={setSearchHeader}
                        showMenu={true} // Menampilkan dropdown hasil pencarian
                        placeholder="Cari fitur atau halaman (⌘+K)..."
                        className="max-w-md"
                    />
                </div>

                {/* RIGHT: Status & Notifications */}
                <div className="flex-none lg:flex-1 flex items-center justify-end gap-2 md:gap-6 relative">
                    <div className="hidden md:flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-black italic text-text-primary uppercase tracking-tighter leading-none">
                            Terminal 01
                        </span>
                        <span className="text-[9px] font-bold text-success-base uppercase tracking-widest flex items-center gap-1.5 mt-1.5">
                            <span
                                style={{ boxShadow: 'var(--success-glow)' }}
                                className="w-1.5 h-1.5 rounded-full bg-success-base animate-pulse"
                            />
                            <span className="hidden lg:inline">Sync Online</span>
                        </span>
                    </div>

                    <div className="relative">
                        <Button
                            variant={isOpen ? "inset" : "expel"}
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative w-10 h-10 md:w-11 md:h-11 !p-0 rounded-xl md:rounded-2xl hover-tactile shrink-0 transition-all duration-[var(--duration-gentle)] ease-[var(--ease-guway)] ${isOpen ? 'z-[130] shadow-inner scale-95' : 'z-auto'}`}
                        >
                            <Bell
                                size={18}
                                className={`transition-colors duration-[var(--duration-smooth)] ${isOpen ? "text-[var(--theme-base)]" : "text-text-muted"}`}
                            />

                            <AnimatePresence>
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        style={{
                                            backgroundColor: 'var(--theme-base)',
                                            boxShadow: 'var(--theme-glow)'
                                        }}
                                        className="absolute -top-1 -right-1 md:top-0 md:right-0 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-surface z-[120]"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>

                        <AnimatePresence>
                            {isOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsOpen(false)}
                                        className="fixed inset-0 z-[120] bg-black/5 backdrop-blur-[2px] cursor-default"
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute right-0 mt-4 w-72 md:w-80 bg-surface shadow-neumorph rounded-[var(--border-radius)] border border-white/5 overflow-hidden z-[125]"
                                    >
                                        <div className="p-4 border-b border-border-main/5 bg-surface-secondary/30 flex justify-between items-center">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary italic">System Alerts</h3>
                                            <span className="px-2 py-0.5 rounded-full bg-[var(--theme-base)]/10 text-[var(--theme-base)] text-[8px] font-black uppercase tracking-tighter">
                                                {notifs.filter(n => !n.isRead).length} New
                                            </span>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                            {notifs.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => markAsRead(notif.id)}
                                                    className={`p-4 flex gap-3 cursor-pointer relative group rounded-2xl transition-all duration-[var(--duration-smooth)] ease-[var(--ease-guway)] ${notif.isRead ? 'shadow-neumorph-inset bg-surface-secondary/40 opacity-70' : 'bg-surface shadow-sm hover:shadow-neumorph'} `}
                                                >
                                                    {!notif.isRead && (
                                                        <motion.div
                                                            layoutId={`unread-${notif.id}`}
                                                            style={{ backgroundColor: 'var(--theme-base)', boxShadow: 'var(--theme-glow)' }}
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                                                        />
                                                    )}

                                                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${notif.type === 'warning' ? 'bg-warning-base/10 text-warning-base' : notif.type === 'success' ? 'bg-success-base/10 text-success-base' : 'bg-info-base/10 text-info-base'} ${notif.isRead ? 'grayscale scale-90 opacity-50' : 'scale-100'} `}>
                                                        {notif.type === 'warning' ? <AlertTriangle size={14} /> :
                                                            notif.type === 'success' ? <CheckCircle2 size={14} /> : <Info size={14} />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center gap-2">
                                                            <p className={`text-[11px] uppercase italic truncate transition-colors ${!notif.isRead ? 'font-black text-text-primary' : 'font-bold text-text-muted'}`}>
                                                                {notif.title}
                                                            </p>
                                                            <span className="text-[8px] font-bold text-text-muted uppercase shrink-0">{notif.time}</span>
                                                        </div>
                                                        <p className={`text-[10px] leading-relaxed mt-0.5 line-clamp-2 ${!notif.isRead ? 'text-text-secondary font-medium' : 'text-text-muted opacity-60'}`}>
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-3 text-center bg-surface-secondary/20">
                                            <button
                                                onClick={markAllRead}
                                                className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-base)] hover:opacity-70 transition-opacity"
                                            >
                                                Clear All Protocols
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};