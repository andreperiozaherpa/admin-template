"use client";

import React, { InputHTMLAttributes, useId, useState, useEffect } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, id, className = "", ...props }: InputProps) => {
  const reactId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // PERBAIKAN: Hubungkan ID secara aman agar label berfungsi
  const inputId = id || (mounted ? reactId : undefined);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId} // Sekarang label bisa diklik untuk fokus ke input
          className="text-[11px] font-bold uppercase tracking-widest text-text-secondary px-1 cursor-pointer"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          className={`
            w-full bg-surface-secondary shadow-neumorph-inset rounded-main
            px-4 py-3 text-sm text-text-primary placeholder:text-text-muted
            outline-none border border-transparent
            focus:border-primary-base/30 transition-all duration-gentle
            ${error ? "border-danger-base/50" : ""}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] text-danger-base font-medium px-1 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};