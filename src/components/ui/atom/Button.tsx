// src/components/ui/Button.tsx
"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// Menambahkan 'ghost' ke dalam tipe variant
type ButtonVariant =
  | "default"
  | "primary"
  | "inset"
  | "expel"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "ghost"; // <--- Varian baru

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonProps) => {

  /**
   * Mapping varian menggunakan utility classes dan design tokens dari globals.css
   */
  const variantStyles: Record<ButtonVariant, string> = {
    // Default & Expel menggunakan shadow-neumorph (timbul)
    default: "bg-surface shadow-neumorph text-text-primary active:shadow-neumorph-inset",
    expel: "bg-surface shadow-neumorph text-text-primary active:shadow-neumorph-inset",

    // Inset menggunakan shadow-neumorph-inset (cekung)
    inset: "bg-surface-secondary shadow-neumorph-inset text-text-secondary active:shadow-neumorph active:bg-surface",

    // Ghost: Tanpa background pekat, hanya muncul saat hover/active
    // Cocok untuk tombol navigasi atau kontrol minimalis (seperti zoom di PdfEditor)
    ghost: "bg-transparent text-text-muted hover:bg-surface-secondary hover:text-text-primary active:shadow-neumorph-inset",

    // Varian Warna Aksentuasi
    primary: "bg-primary-base shadow-neumorph text-main-bg font-semibold active:shadow-neumorph-inset active:bg-primary-active",
    danger: "bg-danger-base shadow-neumorph text-main-bg font-semibold active:shadow-neumorph-inset active:bg-danger-active",
    success: "bg-success-base shadow-neumorph text-main-bg font-semibold active:shadow-neumorph-inset active:bg-success-active",
    warning: "bg-warning-base shadow-neumorph text-main-bg font-semibold active:shadow-neumorph-inset active:bg-warning-active",
    info: "bg-info-base shadow-neumorph text-main-bg font-semibold active:shadow-neumorph-inset active:bg-info-active",
  };

  // Konfigurasi pegas agar responsif dan taktil
  const springTransition = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  } as const;

  /**
   * Logika gerakan vertikal (Displacement):
   * Tombol timbul bergerak ke bawah saat ditekan (y: 1).
   * Tombol cekung atau ghost bergerak sedikit ke atas atau diam.
   */
  const isSunken = variant === "inset" || variant === "ghost";

  return (
    <motion.button
      whileHover={{
        y: isSunken ? 0 : -2,
        scale: 1.01,
        filter: variant === "ghost" ? "none" : "brightness(1.04)",
      }}
      whileTap={{
        y: isSunken ? -1 : 1,
        scale: 0.97,
      }}
      transition={springTransition}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-2.5 rounded-main
        disabled:opacity-40 disabled:cursor-not-allowed
        select-none outline-none
        
        transition-[background-color,color,box-shadow,filter] 
        duration-gentle 
        ease-guway
        
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </motion.button>
  );
};