"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}: ModalProps) => {
    // 1. HYDRATION GUARD: Sinkronisasi Server-Client
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Mencegah scroll body saat modal terbuka
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!mounted) return null;

    // Mapping Ukuran
    const sizeMap = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] h-[95vh]",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    {/* Backdrop dengan efek Glass Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Container (Expel Neumorph) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        role="dialog"
                        aria-modal="true"
                        className={`
                            relative w-full bg-surface shadow-neumorph rounded-[32px] overflow-hidden
                            flex flex-col border border-white/20 dark:border-white/5
                            ${sizeMap[size]}
                        `}
                    >
                        {/* Header Section */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border-main/10">
                            {title ? (
                                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary italic">
                                    {title}
                                </h3>
                            ) : <div />}
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-secondary shadow-neumorph-inset hover:shadow-neumorph transition-all duration-smooth active:scale-95 text-text-muted hover:text-danger-base"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content Section (Custom Scrollbar) */}
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar min-h-[100px]">
                            {children}
                        </div>

                        {/* Footer Section */}
                        {footer && (
                            <div className="px-6 py-5 bg-surface-secondary/30 border-t border-border-main/10 flex justify-end gap-3">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};