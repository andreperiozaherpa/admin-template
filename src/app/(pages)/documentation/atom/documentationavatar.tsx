"use client";

import React from "react";
import { Avatar, Card, Badge } from "@/components/ui/Index";
import { UserCircle2, Code2, Info, Users } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationAvatar = () => {
    // Contoh URL gambar (bisa diganti dengan gambar lokal/placeholder lain)
    const demoImage = "https://i.pravatar.cc/150?img=47";

    return (
        <section id="avatar" className="space-y-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[var(--theme-base)]"
            >
                <UserCircle2 size={18} />
                <h2 className="text-xl font-black tracking-tight uppercase italic">User Identity (Avatar)</h2>
            </motion.div>

            <Card variant="standard" padding="lg">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Sisi Kiri: Visual Showcase */}
                    <div className="lg:col-span-3 space-y-12">

                        {/* 1. Sizes & Status Showcase */}
                        <div className="flex flex-wrap items-end justify-center gap-8 p-10 bg-surface-secondary/20 rounded-[40px] shadow-neumorph-inset overflow-visible">
                            <div className="flex flex-col items-center gap-3">
                                <Avatar size="xl" src={demoImage} status="online" />
                                <Badge size="sm" variant="soft">XL + Online</Badge>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <Avatar size="lg" initials="TR" status="busy" />
                                <Badge size="sm" variant="soft">LG + Initials</Badge>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <Avatar size="md" src={demoImage} initials="JD" status="offline" />
                                <Badge size="sm" variant="soft">MD + Fallback</Badge>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <Avatar size="sm" />
                                <Badge size="sm" variant="soft">SM + Generic</Badge>
                            </div>
                        </div>

                        {/* Info Teknis Desain */}
                        <div className="pt-6 border-t border-border-main/20">
                            <div className="flex gap-2 items-start text-text-secondary">
                                <Info size={14} className="mt-0.5 text-[var(--theme-base)]" />
                                <div className="text-xs font-light leading-relaxed space-y-2">
                                    <p>
                                        Avatar menggunakan teknik <span className="font-semibold text-text-primary">Inset Bezel Overlay</span>. Gambar diletakkan di lapisan bawah, kemudian ditimpa oleh *ring* transparan yang memiliki bayangan dalam (inset shadow) untuk menciptakan efek bingkai fisik.
                                    </p>
                                    <p>
                                        Indikator status memiliki <span className="italic">vibrant glow</span> yang warnanya diambil secara dinamis dari variabel CSS tema (success, danger, dll).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Usage Guide */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Avatar API Guide</span>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden text-text-secondary font-mono text-[11px] leading-relaxed">
                            <pre className="text-[11px] font-medium leading-relaxed font-mono whitespace-pre overflow-x-auto">
                                {`AVATAR API (Tubaba 2026):
src      : string (URL Gambar)
initials : string (Teks Fallback, cth: "JD")
size     : "sm" | "md" | "lg" | "xl"
status   : "online" | "offline" |
           "busy" | null
alt      : string (Aksesibilitas)
id/class : Standard HTML Attributes

1. WITH IMAGE & ONLINE STATUS
<Avatar 
  size="lg"
  src="/users/profile.jpg"
  status="online"
  alt="Foto Profil Budi"
/>

2. INITIALS FALLBACK & BUSY
<Avatar 
  size="md"
  initials="TR"
  status="busy"
/>

3. GENERIC PLACEHOLDER
<Avatar size="sm" />`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>
                    </div>

                </div>
            </Card>
        </section>
    );
};