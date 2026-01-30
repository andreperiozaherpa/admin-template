"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Perbaikan: Menambahkan id dan extends HTMLAttributes untuk fleksibilitas
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    total?: number;
    unit?: string;
    variant?: "linear" | "circular" | "vertical";
    color?: "primary" | "success" | "danger" | "info" | "warning";
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    icon?: LucideIcon;
}

export const Progress = ({
    value = 0,
    total = 100,
    unit = "%",
    variant = "linear",
    color = "primary",
    size = "md",
    showValue = false,
    icon: Icon,
    id, // Destruktur ID
    className = "",
    ...props // Mendukung atribut HTML standar lainnya
}: ProgressProps) => {
    const colorClass = `var(--${color}-base)`;
    const clampedValue = Math.min(Math.max(value, 0), total);
    const percentage = (clampedValue / total) * 100;

    // --- VARIANT: CIRCULAR ---
    if (variant === "circular") {
        const radius = 80;
        const strokeWidth = size === "sm" ? 14 : size === "lg" ? 22 : 18;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div
                id={id} // Masukan ID di sini
                className={`relative flex items-center justify-center select-none ${size === "sm" ? "w-32 h-32" : size === "lg" ? "w-56 h-56" : "w-44 h-44"
                    } ${className}`}
                {...props}
            >
                <div className="absolute inset-0 rounded-full bg-surface shadow-neumorph border border-border-main/5" />
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90 overflow-visible">
                    <circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-text-muted/10"
                        strokeWidth={strokeWidth}
                        strokeDasharray="4 6"
                    />
                    <motion.circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke={colorClass}
                        strokeWidth={strokeWidth}
                        strokeLinecap="butt"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        style={{
                            strokeDasharray: circumference,
                            filter: `drop-shadow(0 0 6px ${colorClass}66)`, // Efek Vibrant Glow
                        }}
                    />
                </svg>
                <div className="absolute w-[62%] h-[62%] rounded-full bg-surface shadow-neumorph border border-white/40 flex flex-col items-center justify-center z-10 p-4">
                    <div className="flex flex-col items-center text-center">
                        {Icon && (
                            <Icon
                                size={size === "sm" ? 18 : size === "lg" ? 32 : 24}
                                className="mb-1.5 opacity-90 transition-all duration-smooth"
                                style={{ color: colorClass }}
                            />
                        )}
                        <p className={`font-black tracking-tighter text-text-primary leading-none ${size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl"
                            }`}>
                            {value}
                        </p>
                        {showValue && (
                            <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mt-1.5">
                                / {total} {unit}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- VARIANT: VERTICAL ---
    if (variant === "vertical") {
        return (
            <div id={id} className={`flex flex-col items-center h-full gap-3 ${className}`} {...props}>
                {showValue && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {Math.round(percentage)}%
                    </span>
                )}
                <div className={`
                    relative rounded-full bg-surface shadow-neumorph-inset border border-border-main/5 overflow-hidden flex flex-col justify-end
                    ${size === "sm" ? "w-2 h-32" : size === "lg" ? "w-6 h-64" : "w-4 h-48"}
                `}>
                    <motion.div
                        className="w-full rounded-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                            backgroundColor: colorClass,
                            boxShadow: `0 -2px 10px ${colorClass}66`, // Glow di sisi atas bar
                        }}
                    />
                </div>
                {Icon && (
                    <Icon
                        size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                        style={{ color: colorClass }}
                        className="opacity-80"
                    />
                )}
            </div>
        );
    }

    // --- VARIANT: LINEAR (Horizontal) ---
    return (
        <div id={id} className={`w-full space-y-2 ${className}`} {...props}>
            <div className="flex justify-between items-end px-1">
                {showValue && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        {Math.round(percentage)}%
                    </span>
                )}
            </div>
            <div className={`w-full rounded-full bg-surface shadow-neumorph-inset border border-border-main/5 overflow-hidden ${size === "sm" ? "h-2" : size === "lg" ? "h-6" : "h-4"
                }`}>
                <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{
                        backgroundColor: colorClass,
                        boxShadow: `0 0 10px ${colorClass}44`, // Glow pendaran
                    }}
                />
            </div>
        </div>
    );
};