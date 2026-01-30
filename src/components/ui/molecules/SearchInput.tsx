"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import router untuk navigasi
import { Search, Command, FileText, Activity, Users, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 1. Tambahkan properti href pada data dummy
const quickResults = [
    { id: 1, category: "Pages", title: "Dashboard", icon: FileText, href: "/dashboard" },
    { id: 2, category: "Pages", title: "Molecules", icon: Activity, href: "/documentation/molecules" },
    { id: 3, category: "Pages", title: "Atom", icon: Users, href: "/documentation/atom" },
];

export const SearchInput = () => {
    const router = useRouter(); // Inisialisasi router
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");

    // 2. Update fungsi pemilihan untuk menangani navigasi
    const handleSelectResult = (title: string, href: string) => {
        setQuery(title);
        setIsFocused(false);
        router.push(href); // Arahkan pengguna ke halaman tujuan
    };

    return (
        <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-md group transition-all duration-300 z-50">
            {/* INPUT FIELD CONTAINER */}
            <div className="relative">
                <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-[var(--theme-base)] transition-colors">
                    <Search size={14} className="md:size-4" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search Protocols..."
                    className="w-full bg-surface shadow-inner rounded-xl md:rounded-2xl py-2 md:py-2.5 pl-9 md:pl-12 pr-4 md:pr-12 text-[10px] md:text-xs font-medium border border-transparent focus:border-[var(--theme-base)]/20 outline-none transition-all placeholder:text-text-muted/40 text-text-primary"
                />

                <div className="absolute inset-y-0 right-4 hidden md:flex items-center pointer-events-none">
                    <kbd className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-secondary border border-border-main/10 text-[9px] font-black text-text-muted opacity-60">
                        <Command size={10} /> K
                    </kbd>
                </div>
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-surface shadow-neumorph rounded-2xl md:rounded-[24px] border border-white/5 overflow-hidden p-2"
                    >
                        <div className="px-3 py-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">Quick Access</span>
                        </div>

                        <div className="space-y-1">
                            {quickResults.map((result) => (
                                <button
                                    key={result.id}
                                    // 3. Kirimkan result.href ke fungsi handler
                                    onClick={() => handleSelectResult(result.title, result.href)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-secondary/50 transition-all group/item text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-muted group-hover/item:text-[var(--theme-base)] group-hover/item:shadow-neumorph transition-all">
                                        <result.icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-text-primary uppercase italic truncate leading-none">{result.title}</p>
                                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{result.category}</span>
                                    </div>
                                    <ArrowRight size={12} className="text-text-muted opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-2 p-3 bg-surface-secondary/20 rounded-xl border border-white/5 flex items-center justify-between">
                            <p className="text-[8px] font-bold text-text-muted uppercase italic">Type to filter protocols...</p>
                            <span className="text-[8px] font-black text-[var(--theme-base)] uppercase">v2.0 Beta</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};