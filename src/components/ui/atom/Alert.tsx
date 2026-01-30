"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    Info,
    AlertTriangle,
    X,
    LucideIcon
} from "lucide-react";

export type AlertVariant = "success" | "danger" | "warning" | "info" | "default";

interface AlertProps {
    title?: string;
    description?: string;
    variant?: AlertVariant;
    icon?: LucideIcon;
    onClose?: () => void;
    isVisible?: boolean;
    className?: string;
}

export const Alert = ({
    title,
    description,
    variant = "default",
    icon: CustomIcon,
    onClose,
    isVisible = true,
    className = "",
}: AlertProps) => {
    // 1. HYDRATION GUARD: Memastikan render konsisten di klien
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const iconMap: Record<AlertVariant, LucideIcon | null> = {
        success: CheckCircle2,
        danger: AlertCircle,
        warning: AlertTriangle,
        info: Info,
        default: null,
    };

    const Icon = CustomIcon || iconMap[variant];

    const colorStyles: Record<AlertVariant, string> = {
        success: "text-success-base border-success-base/20",
        danger: "text-danger-base border-danger-base/20",
        warning: "text-warning-base border-warning-base/20",
        info: "text-info-base border-info-base/20",
        default: "text-text-primary border-border-main/20",
    };

    const glowStyles: Record<AlertVariant, string> = {
        success: "shadow-[0_0_15px_rgba(var(--success-rgb),0.1)]",
        danger: "shadow-[0_0_15px_rgba(var(--danger-rgb),0.1)]",
        warning: "shadow-[0_0_15px_rgba(var(--warning-rgb),0.1)]",
        info: "shadow-[0_0_15px_rgba(var(--info-rgb),0.1)]",
        default: "shadow-neumorph",
    };

    // Jangan render apa pun sampai mounted untuk keamanan ekstra di Next.js 16
    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className={`
                        relative w-full p-4 rounded-[28px] border flex gap-4 
                        bg-surface shadow-neumorph transition-all duration-smooth
                        ${colorStyles[variant]} ${glowStyles[variant]} ${className}
                    `.trim().replace(/\s+/g, ' ')} // Normalisasi spasi ekstra
                >
                    {Icon && (
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-surface-secondary shadow-neumorph-inset flex items-center justify-center">
                                <Icon size={20} className="opacity-90" />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 pt-1">
                        {title && (
                            <h4 className="text-xs font-black uppercase tracking-widest mb-1 italic">
                                {title}
                            </h4>
                        )}
                        {description && (
                            <p className="text-xs font-medium text-text-secondary leading-relaxed opacity-80">
                                {description}
                            </p>
                        )}
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            // PERBAIKAN: Menggunakan satu baris string tanpa indentasi spasi berlebih
                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-secondary transition-all active:shadow-neumorph-inset text-text-muted hover:text-text-primary"
                        >
                            <X size={16} />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};