"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "standard" | "glass" | "accent" | "inset";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  // 1. Tambahkan definisi onClick ke dalam interface
  onClick?: () => void;
}

export const Card = ({
  children,
  variant = "standard",
  padding = "md",
  className = "",
  // 2. Destructure properti onClick
  onClick
}: CardProps) => {

  const paddingMap = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-10"
  };

  const variantMap = {
    standard: "bg-surface shadow-neumorph border border-border-main/20",
    glass: "glass-effect",
    accent: "bg-surface shadow-neumorph border-l-4 border-[var(--theme-base)]",
    inset: "bg-surface-secondary shadow-neumorph-inset"
  };

  return (
    <div
      // 3. Hubungkan onClick ke elemen div
      onClick={onClick}
      className={`
        ${variantMap[variant]} 
        ${paddingMap[padding]} 
        rounded-main 
        transition-all 
        duration-smooth 
        ease-guway 
        ${className}
        /* 4. Tambahkan cursor pointer secara otomatis jika Card bisa diklik */
        ${onClick ? "cursor-pointer active:scale-[0.98]" : ""}
      `}
    >
      {children}
    </div>
  );
};