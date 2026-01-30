"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface SkeletonProps extends HTMLMotionProps<"div"> {
    variant?: "rect" | "circle";
}

export const Skeleton = ({
    variant = "rect",
    className = "",
    ...props
}: SkeletonProps) => {
    return (
        <motion.div
            /**
             * 1. SOFT PULSE ANIMATION
             * Tetap tenang dengan rentang opasitas 0.85 - 1.
             */
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1] // Menggunakan ease-guway
            }}
            className={`
                relative overflow-hidden shrink-0 transition-all duration-smooth
                /* Menggunakan variabel warna skeleton yang adaptif */
                bg-skeleton/80
                /* PERBAIKAN: Menggunakan utilitas shadow-neumorph-inset agar bayangan berubah 
                   otomatis di Dark Mode */
                shadow-neumorph-inset
                ${variant === "circle" ? "rounded-full" : "rounded-xl"}
                ${className}
            `.trim()}
            {...props}
        >
            {/* 2. SMOOTH SHIMMER LAYER */}
            <motion.div
                initial={{ x: "-150%", skewX: -20 }}
                animate={{ x: "150%" }}
                transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeInOut"
                }}
                /* PERBAIKAN: Menggunakan transparansi putih rendah agar kilauan tetap halus 
                   di atas warna skeleton gelap maupun terang */
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            {/* 3. ADAPTIVE RIM LIGHTING */}
            {/* Menggunakan border transparan agar garis tepi menyesuaikan dengan kegelapan latar */}
            <div className={`
                absolute inset-0 pointer-events-none 
                border-b border-r border-white/10 border-t border-l border-black/5
                ${variant === "circle" ? "rounded-full" : "rounded-xl"}
            `} />
        </motion.div>
    );
};