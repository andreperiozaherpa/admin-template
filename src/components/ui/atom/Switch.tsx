"use client";

import React, { useId, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mendukung atribut label standar dan membuang konflik onChange
interface SwitchProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

export const Switch = ({
    label,
    checked,
    onChange,
    id,
    className = "",
    ...props
}: SwitchProps) => {
    const reactId = useId();

    // 1. PERBAIKAN: Gunakan state mounted untuk memastikan ID sinkron
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. PERBAIKAN: ID hanya diberikan jika komponen sudah terpasang di klien
    const switchId = id || (mounted ? reactId : undefined);

    return (
        <label
            htmlFor={switchId}
            className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}
            {...props}
        >
            <div className="relative">
                {/* Hidden Input for Accessibility */}
                <input
                    type="checkbox"
                    id={switchId}
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    className="sr-only"
                />

                {/* Track (Cekungan Inset) - Estetika Tubaba 2026 */}
                <div className={`
                    w-12 h-6 rounded-full transition-all duration-smooth ease-guway
                    ${checked
                        ? "bg-[var(--theme-base)]/20 shadow-neumorph-inset"
                        : "bg-surface-secondary shadow-neumorph-inset border border-border-main/5"}
                `} />

                {/* Thumb (Tombol Timbul) */}
                <motion.div
                    initial={false}
                    animate={{ x: checked ? 26 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`
                        absolute top-1 w-4 h-4 rounded-full shadow-neumorph transition-all
                        ${checked ? "bg-[var(--theme-base)]" : "bg-surface"}
                    `}
                    style={{
                        // Efek pendaran saat aktif
                        boxShadow: checked ? `0 0 8px var(--theme-base)` : undefined
                    }}
                />
            </div>

            {label && (
                <span className={`
                    text-sm font-medium transition-colors
                    ${checked ? "text-text-primary" : "text-text-secondary"}
                    group-hover:text-text-primary
                `}>
                    {label}
                </span>
            )}
        </label>
    );
};