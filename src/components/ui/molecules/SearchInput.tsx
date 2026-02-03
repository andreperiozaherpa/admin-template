"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Command, FileText, ArrowRight, X, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Definisi interface untuk hasil pencarian agar lebih fleksibel
export interface SearchResult {
    id: string | number;
    title: string;
    category?: string;
    icon?: LucideIcon;
    href?: string;
    metadata?: any;
}

interface SearchInputProps {
    data?: SearchResult[]; // Data list opsional untuk dideteksi
    showMenu?: boolean;    // Flag untuk menampilkan menu dropdown atau tidak
    placeholder?: string;
    onSelect?: (result: SearchResult) => void;
    onChange?: (query: string) => void;
    value?: string;
    className?: string;
    maxResults?: number;
}

export const SearchInput = ({
    data = [],
    showMenu = true,
    placeholder = "Search Protocols...",
    onSelect,
    onChange,
    value,
    className = "",
    maxResults = 5
}: SearchInputProps) => {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);
    const [internalQuery, setInternalQuery] = useState("");

    // Gunakan value dari props jika ada (controlled), jika tidak gunakan state internal
    const query = value !== undefined ? value : internalQuery;

    // Filter data secara real-time berdasarkan input
    const filteredResults = useMemo(() => {
        if (!query || !data.length) return [];
        return data
            .filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.category?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, maxResults);
    }, [query, data, maxResults]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (value === undefined) setInternalQuery(val);
        onChange?.(val);
    };

    const handleClear = () => {
        if (value === undefined) setInternalQuery("");
        onChange?.("");
    };

    const handleResultClick = (result: SearchResult) => {
        if (onSelect) {
            onSelect(result);
        } else if (result.href) {
            router.push(result.href);
        }
        setIsFocused(false);
    };

    return (
        <div className={`relative w-full group z-10 ${className}`}>
            {/* INPUT FIELD CONTAINER */}
            <div className="relative">
                <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-[var(--theme-base)] transition-colors">
                    <Search size={14} className="md:size-4" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={placeholder}
                    className="w-full h-[48px] bg-surface shadow-neumorph-inset rounded-xl md:rounded-2xl py-2 md:py-2.5 pl-9 md:pl-12 pr-10 md:pr-12 text-[10px] md:text-xs font-medium border border-transparent focus:border-[var(--theme-base)]/20 outline-none transition-all placeholder:text-text-muted/40 text-text-primary"
                />

                {/* Clear Button / Shortcut Icon */}
                <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                    {query && (
                        <button
                            onClick={handleClear}
                            className="p-1 hover:text-danger-base transition-colors rounded-lg bg-surface-secondary/50"
                        >
                            <X size={12} />
                        </button>
                    )}
                    <kbd className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-secondary border border-border-main/10 text-[9px] font-black text-text-muted opacity-40">
                        <Command size={10} /> K
                    </kbd>
                </div>
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            <AnimatePresence>
                {showMenu && isFocused && filteredResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-surface shadow-neumorph rounded-2xl md:rounded-[24px] border border-white/5 overflow-hidden p-2"
                    >
                        <div className="px-3 py-2 border-b border-border-main/5 mb-1">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">
                                Detected Protocols ({filteredResults.length})
                            </span>
                        </div>

                        <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {filteredResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleResultClick(result)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-secondary/50 transition-all group/item text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-muted group-hover/item:text-[var(--theme-base)] group-hover/item:shadow-neumorph transition-all">
                                        {result.icon ? <result.icon size={14} /> : <FileText size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-text-primary uppercase italic truncate leading-none">
                                            {result.title}
                                        </p>
                                        {result.category && (
                                            <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">
                                                {result.category}
                                            </span>
                                        )}
                                    </div>
                                    <ArrowRight size={12} className="text-text-muted opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-2 p-3 bg-surface-secondary/20 rounded-xl border border-white/5 flex items-center justify-between">
                            <p className="text-[8px] font-bold text-text-muted uppercase italic">Detected in current stream...</p>
                            <span className="text-[8px] font-black text-[var(--theme-base)] uppercase">v2.0</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};