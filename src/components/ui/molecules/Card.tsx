"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "standard" | "glass" | "accent" | "inset";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export const Card = ({
  children,
  variant = "standard",
  padding = "md",
  className = ""
}: CardProps) => {

  // Pemetaan Padding tetap dipertahankan untuk layouting
  const paddingMap = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-10"
  };

  /**
   * Pemetaan Gaya: 
   * Dipastikan hanya menggunakan shadow statis (neumorph atau inner) 
   * tanpa ada utility 'hover-tactile'.
   */
  const variantMap = {
    standard: "bg-surface shadow-neumorph border border-border-main/20",
    glass: "glass-effect", // Mengacu pada glass-effect di globals.css
    accent: "bg-surface shadow-neumorph border-l-4 border-[var(--theme-base)]",
    inset: "bg-surface-secondary shadow-neumorph-inset"
  };

  return (
    <div className={`
      ${variantMap[variant]} 
      ${paddingMap[padding]} 
      rounded-main 
      /* Transition tetap ada agar perpindahan warna tema halus, 
         tapi tidak akan memicu efek tekan */
      transition-all 
      duration-smooth 
      ease-guway 
      ${className}
    `}>
      {children}
    </div>
  );
};