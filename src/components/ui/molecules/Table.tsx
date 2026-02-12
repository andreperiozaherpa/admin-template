"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button, Select } from "@/components/ui/Index";

// --- INTERFACES ---
interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    isEmpty?: boolean;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

interface EntriesProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    index?: number;
    statusColor?: "primary" | "success" | "warning" | "danger" | "info";
    onClick?: () => void;
}

// --- 1. TABLE ENTRIES (Fix Height 48px) ---
export const TableEntries = ({ value, onChange, options = [5, 10, 25, 50] }: EntriesProps) => {
    const selectOptions = options.map(opt => ({ label: `${opt} Entries`, value: opt }));

    return (
        <div className="w-full md:w-40">
            <Select
                options={selectOptions}
                value={value}
                onChange={(val) => onChange(Number(val))}
                placeholder="Rows"
                className="h-[48px]" // Sinkron dengan SearchInput
            />
        </div>
    );
};

// --- 2. MAIN TABLE ---
export const Table = ({ headers, children, className = "", footer, isEmpty }: TableProps) => {
    return (
        <div className={`w-full flex flex-col gap-6 ${className}`}>
            <div className="w-full overflow-x-auto custom-scrollbar rounded-[24px]">
                <table className="w-full border-collapse select-none">
                    <thead>
                        <tr className="border-b border-border-main/10">
                            {headers.map((header, i) => (
                                <th key={i} className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-muted italic">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main/5">
                        {isEmpty ? (
                            <tr>
                                <td colSpan={headers.length} className="py-20 text-center opacity-30 italic uppercase text-[10px] font-black tracking-widest text-text-muted">
                                    No protocol data detected
                                </td>
                            </tr>
                        ) : children}
                    </tbody>
                </table>
            </div>
            {footer && <div className="pt-2">{footer}</div>}
        </div>
    );
};

// --- 3. NUMERIC PAGINATION (Tunjukkan Halaman Aktif) ---
export const TablePagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-surface-secondary/10 rounded-2xl border border-white/5 ${className}`}>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">
                    Viewing <span className="text-[var(--theme-base)]">Page {currentPage}</span>
                </span>
                <span className="text-[8px] font-bold text-text-muted/40 uppercase tracking-tighter italic">Total {totalPages} Blocks Available</span>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="inset"
                    className="!p-0 h-10 w-10 rounded-xl"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft size={16} />
                </Button>

                <div className="flex items-center gap-2 mx-2">
                    {getPageNumbers().map((p, i) => (
                        p === "..." ? (
                            <MoreHorizontal key={i} size={14} className="text-text-muted opacity-30" />
                        ) : (
                            <button
                                key={i}
                                onClick={() => onPageChange(p as number)}
                                className={`h-9 w-9 rounded-xl text-[11px] font-black transition-all duration-smooth ${currentPage === p
                                    ? "bg-[var(--theme-base)] text-white shadow-[0_0_12px_var(--theme-glow)] scale-110 z-10"
                                    : "bg-surface shadow-neumorph text-text-muted hover:text-[var(--theme-base)] active:shadow-neumorph-inset"
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>

                <Button
                    variant="inset"
                    className="!p-0 h-10 w-10 rounded-xl"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
};

// --- 4. TABLE ROW (Fixed Alignment & More Interesting) ---
export const TableRow = ({ children, className = "", index = 0, statusColor, onClick }: TableRowProps) => {
    const accentClass = statusColor ? `var(--${statusColor}-base)` : "var(--theme-base)";

    return (
        <motion.tr
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            // whileHover={{ scale: 1.002, backgroundColor: "rgba(var(--surface-secondary-rgb), 0.4)" }}
            transition={{ delay: index * 0.005, duration: 0.05 }}
            onClick={onClick}
            className={`group relative transition-all duration-smooth border-b border-border-main/5 cursor-pointer ${className}`}
        >
            {/* Garis Aksen sekarang menggunakan padding-left pada sel pertama, bukan <td> baru */}
            {children}
        </motion.tr>
    );
};

export const TableCell = ({ children, className = "", isFirst = false, statusColor }: { children: React.ReactNode, className?: string, isFirst?: boolean, statusColor?: string }) => {
    const accentColor = statusColor ? `var(--${statusColor}-base)` : "var(--theme-base)";

    return (
        <td className={`px-6 py-5 text-xs font-medium text-text-secondary transition-colors group-hover:text-text-primary relative ${className}`}>
            {/* Garis Aksen Quantum didalam Cell Pertama */}
            {isFirst && (
                <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
                />
            )}
            {children}
        </td>
    );
};