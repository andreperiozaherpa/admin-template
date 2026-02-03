"use client";

import React from "react";
// Import dari Index utama untuk konsistensi
import { Card, Badge, NavMenu, type NavItem } from "@/components/ui/Index";
import {
    Layout,
    Code2,
    Zap,
    MousePointer2,
    MoveUpRight,
    Radiation,
    Mail,
    Shield,
    Settings,
    Activity
} from "lucide-react";

export const DocumentationNav = () => {
    // Definisi menu untuk demo
    const menuItems: NavItem[] = [
        { href: "/documentation/atoms", label: "atom", icon: Radiation },
        { href: "/messages", label: "Messages", icon: Mail, badge: 12, },
        { href: "/analytics", label: "Analytics", icon: Activity },
        {
            href: "/system",
            label: "System Configuration",
            icon: Settings,
            // Contoh Sub Menu
            children: [
                { href: "/cloud/nodes", label: "Cloud Nodes" },
                { href: "/system/security", label: "Security Protocols" },
                { href: "/system/logs", label: "Event Logs" }
            ]
        },
        { href: "/security", label: "Security", icon: Shield },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <section id="nav-menu" className="space-y-6">
            <div className="flex items-center gap-2 text-[var(--theme-base)]">
                <Layout size={20} className="animate-pulse" />
                <h2 className="text-xl font-black tracking-tight uppercase italic text-text-primary">
                    Navigation Systems (NavMenu)
                </h2>
            </div>

            <Card padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Sisi Kiri: Playground & Visual Preview */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="space-y-4">
                            <Badge variant="soft">Tactile Preview</Badge>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Navigasi ini dirancang untuk memberikan umpan balik **Neumorphic** yang dalam. Klik menu untuk melihat transisi indikator aktif yang meluncur mulus.
                            </p>

                            {/* Container Sidebar Mockup */}
                            <div className="p-6 bg-surface-secondary/30 rounded-[40px] shadow-neumorph-inset max-w-[300px]">
                                <NavMenu items={menuItems} />
                            </div>
                        </div>

                        {/* Detail Animasi Teknis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border-main/20">
                            <div className="flex gap-3">
                                <MousePointer2 size={16} className="text-primary-base shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-text-primary uppercase">Shared Layout</p>
                                    <p className="text-[10px] text-text-secondary leading-normal">
                                        Indikator vertikal menggunakan `layoutId` untuk berpindah posisi tanpa interupsi visual.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Zap size={16} className="text-warning-base shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-text-primary uppercase">Staggered Load</p>
                                    <p className="text-[10px] text-text-secondary leading-normal">
                                        Item menu muncul satu per satu dengan delay dinamis saat inisialisasi awal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Technical Guide */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Code2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Molecule API</span>
                            </div>
                            <Card variant="inset" padding="md" className="bg-surface-secondary/50 border-none">
                                <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto text-text-secondary">
                                    {`NAV MENU API (Tubaba 2026):
items : NavItem[] {
  href       : string
  label      : string
  icon       : LucideIcon
  badge?     : string | number
  badgeColor?: "primary" | "danger" | ...
}

1. BASIC IMPLEMENTATION
<NavMenu items={myItems} />

2. WITH BADGE NOTIFICATION
const myItems = [{
  href: "/mail",
  label: "Inbox",
  icon: Mail,
  badge: 5,
  badgeColor: "danger"
}];`}
                                </pre>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MoveUpRight size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Logic Flow</span>
                            </div>
                            <ul className="text-[10px] space-y-2 text-text-secondary leading-relaxed px-1">
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Active Tracking**: Menggunakan `usePathname()` untuk identifikasi rute tanpa manual prop.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Tactile Interaction**: Item yang aktif mendapatkan `shadow-neumorph-inset` untuk kesan ditekan.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Hydration Guard**: Menunggu *mount* klien sebelum merender status aktif guna mencegah mismatch SSR.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};