"use client";

import React, { useId, useState, useEffect } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckboxProps {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    id?: string;
}

export const Checkbox = ({ label, checked, onChange, id }: CheckboxProps) => {
    const reactId = useId();
    // PERBAIKAN: Gunakan state mounted untuk menghindari mismatch ID saat hidrasi
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // ID hanya diterapkan jika sudah di-mount atau jika ID manual diberikan
    const checkboxId = id || (mounted ? reactId : undefined);

    return (
        <label
            htmlFor={checkboxId}
            className="flex items-center gap-3 group cursor-pointer select-none outline-none"
        >
            <div className="relative flex items-center justify-center">
                <input
                    type="checkbox"
                    id={checkboxId}
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    className="sr-only"
                />

                <div className={`
                    w-5 h-5 rounded-md transition-all duration-smooth ease-guway
                    group-focus-within:ring-2 group-focus-within:ring-[var(--theme-base)]/40
                    ${checked
                        ? "bg-[var(--theme-base)] shadow-neumorph border-transparent"
                        : "bg-surface-secondary shadow-neumorph-inset border border-border-main/10"}
                `}>
                    <AnimatePresence>
                        {checked && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="flex items-center justify-center h-full w-full"
                            >
                                <Check size={14} className="text-main-bg stroke-[3.5px]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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