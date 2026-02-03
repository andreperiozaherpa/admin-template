"use client";

import React from "react";

// Menyesuaikan dengan palet warna Quantum Protocol
type TypographyColor = "primary" | "success" | "warning" | "danger" | "info" | "muted" | "default";

interface TypographyProps {
    variant?: "display" | "heading" | "overline" | "body" | "caption";
    color?: TypographyColor;
    children: React.ReactNode;
    className?: string;
    truncate?: boolean;
    italic?: boolean;
    as?: React.ElementType; // Memungkinkan penggantian Tag secara dinamis
}

export const Typography = ({
    variant = "display",
    color = "default",
    children,
    className = "",
    truncate = false,
    italic = false,
    as
}: TypographyProps) => {

    // Konfigurasi Style berdasarkan Visi Desain Tubaba 2026
    const styles = {
        // Untuk Judul Besar Halaman (Quantum Style)
        display: "text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none",
        // Untuk Judul Section atau Card
        heading: "text-lg md:text-xl font-black tracking-tight italic uppercase",
        // Untuk Label kecil di atas input/table
        overline: "text-[10px] font-black uppercase tracking-[0.2em] italic",
        // Untuk teks standar
        body: "text-sm font-medium leading-normal",
        // Untuk teks keterangan tambahan
        caption: "text-[11px] font-bold leading-tight uppercase tracking-wide",
    };

    // Mapping Warna ke Variabel CSS Project
    const colorStyles: Record<TypographyColor, string> = {
        primary: "text-[var(--theme-base)]",
        success: "text-success-base",
        warning: "text-warning-base",
        danger: "text-danger-base",
        info: "text-info-base",
        muted: "text-text-muted",
        default: "text-text-primary",
    };

    // Penanganan Truncate (Elipsis) yang presisi
    const truncateClasses = truncate ? "truncate block min-w-0" : "";
    const italicClass = italic ? "italic" : "";

    // Penentuan Tag HTML
    const Tag = as || (variant === "display" ? "h1" : variant === "heading" ? "h2" : "p");

    return (
        <Tag
            className={`
                ${styles[variant]} 
                ${colorStyles[color]} 
                ${truncateClasses} 
                ${italicClass} 
                transition-colors duration-300
                ${className}
            `.trim()}
        >
            {children}
        </Tag>
    );
};