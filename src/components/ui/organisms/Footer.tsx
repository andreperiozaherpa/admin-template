"use client";

import React from "react";
import { Cpu, ShieldCheck, Globe } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-auto bg-surface/50 select-none ">
            {/* Menggunakan Grid pada xl (1280px) dan Flex-col di bawahnya agar tidak berantakan di 1024px */}
            <div className="grid grid-cols-1 xl:grid-cols-3 items-center gap-y-10 gap-x-4 px-6 md:px-12 max-w-[120rem] mx-auto">

                {/* 1. LEFT: Identity - Left Aligned on XL */}
                <div className="flex flex-col items-center xl:items-start text-center xl:text-left order-2 xl:order-1">
                    <span className="text-[11px] md:text-xs font-black italic text-text-primary uppercase tracking-tighter">
                        Tubaba <span className="text-[var(--theme-base)] transition-colors duration-500">2026</span>
                    </span>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1 opacity-70">
                        Terminal Protocol v2.0.4
                    </p>
                </div>

                {/* 2. CENTER: Status Icons - Always Centered */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 order-1 xl:order-2">
                    <div className="flex items-center gap-2 group">
                        <Cpu size={14} className="text-text-muted opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">Core Active</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <ShieldCheck size={14} className="text-success-base opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">Secure</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <Globe size={14} className="text-[var(--theme-base)] opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">Sync</span>
                    </div>
                </div>

                {/* 3. RIGHT: Legal - Right Aligned on XL */}
                <div className="flex flex-col items-center xl:items-end order-3">
                    <span className="text-[10px] md:text-[11px] font-black text-text-primary uppercase tracking-widest opacity-80">
                        © {currentYear} Guway Tubaba
                    </span>
                    <div className="flex gap-6 mt-2.5">
                        <button className="text-[9px] font-bold text-text-muted hover:text-[var(--theme-base)] uppercase tracking-tighter transition-all">
                            Privacy
                        </button>
                        <button className="text-[9px] font-bold text-text-muted hover:text-[var(--theme-base)] uppercase tracking-tighter transition-all">
                            Terms
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Glow Line - Responsive */}
            <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--theme-base)] to-transparent opacity-[0.1]" />
        </footer>
    );
};