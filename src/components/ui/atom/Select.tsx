"use client";

import React, { useState, useRef, useEffect, useId, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, Check, Loader2 } from "lucide-react";
import { Badge, Skeleton } from "@/components/ui/Index";

export interface SelectOption {
    label: string;
    value: string | number;
}

type SelectValue = string | number | (string | number)[];

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
    label?: string;
    options: SelectOption[];
    value?: SelectValue;
    onChange: (value: any) => void;
    placeholder?: string;
    multiple?: boolean;
    searchable?: boolean;
    isLoading?: boolean;
    error?: string;
    variant?: "neumorph" | "glass";
}

export const Select = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select option...",
    multiple = false,
    searchable = false,
    isLoading = false,
    error,
    variant = "neumorph",
    className = "",
    id,
    ...props
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const reactId = useId();

    // 1. HYDRATION FIX: Pastikan ID sinkron antara Server & Client
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const selectId = id || (mounted ? reactId : undefined);

    // 2. PERFORMANCE: Filter opsi hanya saat input/opsi berubah
    const filteredOptions = useMemo(() => {
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // 3. UX: Menutup dropdown saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: SelectOption) => {
        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            const next = current.includes(option.value)
                ? current.filter(v => v !== option.value)
                : [...current, option.value];
            onChange(next);
        } else {
            onChange(option.value);
            setIsOpen(false);
        }
    };

    const handleRemoveTag = useCallback((e: React.MouseEvent, optValue: string | number) => {
        e.stopPropagation(); // Stop bubbling agar menu tidak terbuka
        if (multiple && Array.isArray(value)) {
            onChange(value.filter(v => v !== optValue));
        }
    }, [multiple, value, onChange]);

    const selected = useMemo(() => {
        if (multiple && Array.isArray(value)) {
            return options.filter(opt => value.includes(opt.value));
        }
        return options.find(opt => opt.value === value);
    }, [multiple, value, options]);

    return (
        <div ref={containerRef} className={`w-full space-y-2 ${className}`} {...props}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 cursor-pointer hover:text-text-primary transition-colors"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Field Utama (Inset Style) - Adaptif terhadap Dark Mode */}
                <div
                    id={selectId}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    onClick={() => !isLoading && setIsOpen(!isOpen)}
                    className={`
                        min-h-[48px] px-4 py-2 rounded-2xl flex items-center justify-between gap-2
                        bg-surface-secondary shadow-neumorph-inset cursor-pointer
                        transition-all duration-smooth border border-transparent
                        ${isOpen ? "border-[var(--theme-base)]/20" : ""}
                        ${error ? "border-danger-base/30" : ""}
                        ${isLoading ? "opacity-70 cursor-wait" : ""}
                    `.trim()}
                >
                    <div className="flex flex-wrap gap-1.5 flex-1 overflow-hidden">
                        {isLoading ? (
                            <Skeleton className="h-4 w-32" />
                        ) : multiple && Array.isArray(selected) && selected.length > 0 ? (
                            selected.map(opt => (
                                <Badge key={opt.value} variant="soft" size="sm" className="gap-1 pr-1 border-none shadow-sm">
                                    {opt.label}
                                    <X
                                        size={12}
                                        className="hover:text-danger-base transition-colors"
                                        onClick={(e) => handleRemoveTag(e, opt.value)}
                                    />
                                </Badge>
                            ))
                        ) : !multiple && selected && !Array.isArray(selected) ? (
                            <span className="text-sm text-text-primary font-medium">{selected.label}</span>
                        ) : (
                            <span className="text-sm text-text-muted/50 italic">{placeholder}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin text-text-muted" />
                        ) : (
                            <ChevronDown size={18} className={`text-text-muted/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        )}
                    </div>
                </div>

                {/* Dropdown Menu (Expel/Glass Style) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            onClick={(e) => e.stopPropagation()} // Stop bubbling untuk search
                            className={`
                                absolute z-[110] w-full mt-3 p-2 rounded-[24px] overflow-hidden
                                ${variant === "glass" ? "glass-effect" : "bg-surface shadow-neumorph border border-white/10 dark:border-white/5"}
                            `}
                        >
                            {searchable && (
                                <div className="relative mb-2 px-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={12} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => e.key === ' ' && e.stopPropagation()}
                                        className="w-full bg-surface-secondary shadow-neumorph-inset rounded-xl py-2 pl-9 pr-4 text-xs outline-none border border-transparent focus:border-[var(--theme-base)]/20 transition-all text-text-primary"
                                        placeholder="Search..."
                                    />
                                </div>
                            )}

                            <div role="listbox" className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar px-1">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map(option => {
                                        const isSelected = multiple
                                            ? Array.isArray(value) && value.includes(option.value)
                                            : value === option.value;

                                        return (
                                            <div
                                                key={option.value}
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => handleSelect(option)}
                                                className={`
                                                    px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex justify-between items-center group
                                                    ${isSelected ? "bg-[var(--theme-base)]/10 text-[var(--theme-base)] font-bold" : "text-text-secondary hover:bg-surface-secondary hover:translate-x-1"}
                                                `}
                                            >
                                                {option.label}
                                                {isSelected && <Check size={14} className="animate-in zoom-in" />}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-8 text-center text-xs text-text-muted italic font-light">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <p className="text-[10px] text-danger-base font-medium ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};