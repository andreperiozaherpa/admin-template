"use client";

import React, { useId, useState, useEffect } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const TextArea = ({
    label,
    error,
    id,
    className = "",
    ...props
}: TextAreaProps) => {
    const reactId = useId();

    // 1. PERBAIKAN: Gunakan state mounted untuk sinkronisasi hidrasi
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. PERBAIKAN: Pastikan ID hanya aktif setelah komponen terpasang di klien
    // Jika belum mounted, gunakan undefined agar server dan klien sama-sama merender tanpa ID
    const textAreaId = id || (mounted ? reactId : undefined);

    return (
        <div className="w-full space-y-2">
            {label && (
                <label
                    htmlFor={textAreaId}
                    className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-1 cursor-pointer hover:text-text-primary transition-colors"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textAreaId}
                className={`
                    w-full min-h-[120px] px-4 py-3 rounded-2xl
                    bg-surface-secondary shadow-neumorph-inset
                    text-sm text-text-primary placeholder:text-text-muted/50
                    outline-none border border-transparent
                    focus:border-[var(--theme-base)]/30 transition-all duration-smooth
                    resize-none
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="text-[10px] text-danger-base font-medium ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};