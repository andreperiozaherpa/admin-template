"use client";

import React, { useId, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Perbaikan: Gunakan Omit untuk menghindari konflik tipe onChange
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  name?: string;
}

export const Radio = ({
  label,
  value,
  checked,
  onChange,
  name,
  id,
  className = "",
  ...props
}: RadioProps) => {
  const reactId = useId();

  // 1. PERBAIKAN: Gunakan state mounted untuk sinkronisasi hidrasi
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. PERBAIKAN: Pastikan ID hanya aktif setelah komponen terpasang di klien
  const radioId = id || (mounted ? `radio-${reactId}` : undefined);

  return (
    <label
      htmlFor={radioId}
      className={`flex items-center gap-3 group cursor-pointer select-none outline-none ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Hidden Native Radio - Tetap aksesibel bagi Screen Reader */}
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange?.(value)}
          className="sr-only"
          {...props}
        />

        {/* Outer Circle (Track) dengan gaya Neumorphic */}
        <div className={`
          w-5 h-5 rounded-full transition-all duration-smooth ease-guway
          group-focus-within:ring-2 group-focus-within:ring-[var(--theme-base)]/40
          ${checked
            ? "bg-surface shadow-neumorph border-transparent"
            : "bg-surface-secondary shadow-neumorph-inset border border-border-main/10"}
        `}>
          <AnimatePresence>
            {checked && (
              <div className="flex items-center justify-center h-full w-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-2.5 h-2.5 rounded-full bg-[var(--theme-base)] shadow-sm"
                />
              </div>
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