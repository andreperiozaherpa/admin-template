"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "neumorph" | "glass" | "soft" | "outline";
    color?: "primary" | "success" | "danger" | "warning" | "info";
    size?: "sm" | "md";
    icon?: LucideIcon;
    className?: string;
}

export const Badge = ({
    children,
    variant = "neumorph",
    color = "primary",
    size = "md",
    icon: Icon,
    className = "",
    ...props
}: BadgeProps) => {

    // Mapping Warna Fungsional
    const colorMap = {
        primary: "text-[var(--theme-base)] border-[var(--theme-base)]/20",
        success: "text-success-base border-success-base/20",
        danger: "text-danger-base border-danger-base/20",
        warning: "text-warning-base border-warning-base/20",
        info: "text-info-base border-info-base/20",
    };

    // Mapping Gaya Varian
    const variantMap = {
        neumorph: "bg-surface shadow-neumorph border",
        glass: "glass-effect border",
        soft: "bg-surface-secondary/50 border-transparent",
        outline: "bg-transparent border",
    };

    // Mapping Ukuran
    const sizeMap = {
        sm: "px-2 py-0.5 text-[9px]",
        md: "px-3 py-1 text-[10px]",
    };

    return (
        <span className={`
            inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-widest
            transition-all duration-smooth ease-guway
            ${variantMap[variant]} 
            ${colorMap[color]} 
            ${sizeMap[size]}
            ${className}
        `}
            {...props}
        >
            {Icon && <Icon size={size === "sm" ? 10 : 12} className="opacity-80" />}
            {children}
        </span>
    );
};