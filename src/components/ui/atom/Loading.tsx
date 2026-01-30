"use client";

import React from "react";
import { motion } from "framer-motion";

// Interface diperluas untuk mendukung id, className, dan props HTML standar lainnya
interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
    variant?: "classic" | "pulse" | "orbit" | "tactile";
    label?: string;
}

export const Loading = ({
    size = "md",
    variant = "classic",
    label,
    className = "",
    id,
    ...props
}: LoadingProps) => {

    // Mapping ukuran kontainer utama
    const sizeMap = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-16 h-16",
    };

    return (
        <div
            id={id}
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
            {...props}
        >
            <div className={`relative ${sizeMap[size]}`}>

                {/* --- VARIANT: TACTILE --- */}
                {/* Mensimulasikan indikator berputar di dalam parit fisik */}
                {variant === "tactile" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-surface shadow-neumorph border border-border-main/5" />
                        <div className="absolute w-[68%] h-[68%] rounded-full bg-surface shadow-neumorph-inset top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 flex justify-center items-start z-20"
                        >
                            <div className={`
                                rounded-full bg-[var(--theme-base)] shadow-sm transition-all duration-smooth
                                ${size === "sm" ? "w-[12%] h-[12%] mt-[4%]" :
                                    size === "md" ? "w-[11%] h-[11%] mt-[4.5%]" :
                                        "w-[10%] h-[10%] mt-[5%]"}
                            `} />
                        </motion.div>
                    </div>
                )}

                {/* --- VARIANT: CLASSIC --- */}
                {variant === "classic" && (
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 rounded-full shadow-neumorph-inset border border-border-main/5" />
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full drop-shadow-sm"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        >
                            <defs>
                                <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--theme-base)" stopOpacity="1" />
                                    <stop offset="100%" stopColor="var(--theme-base)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="50" cy="50" r="38"
                                stroke="url(#spinner-grad)"
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray="180 100"
                            />
                        </motion.svg>
                    </div>
                )}

                {/* --- VARIANT: PULSE --- */}
                {/* Desain dengan ritme "napas" tenang untuk durasi panjang */}
                {variant === "pulse" && (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {[
                            { size: "w-[40%] h-[40%]", delay: 0 },
                            { size: "w-[70%] h-[70%]", delay: 1.0 },
                            { size: "w-full h-full", delay: 2.0 }
                        ].map((trench, i) => (
                            <div key={i} className={`absolute ${trench.size} flex items-center justify-center`}>
                                <div className="absolute inset-0 rounded-full shadow-neumorph-inset border border-border-main/5" />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0.4, 0] }}
                                    transition={{
                                        duration: 3.5,
                                        repeat: Infinity,
                                        delay: trench.delay,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 rounded-full border-[2px] border-[var(--theme-base)]/80"
                                    style={{
                                        boxShadow: `inset 0 0 6px var(--theme-base), 0 0 4px var(--theme-base)`,
                                    }}
                                />
                            </div>
                        ))}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="absolute w-[18%] h-[18%] rounded-full bg-[var(--theme-base)] shadow-lg z-10 ring-2 ring-surface"
                        />
                    </div>
                )}

                {/* --- VARIANT: ORBIT --- */}
                {variant === "orbit" && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-full relative"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--theme-base)] shadow-neumorph" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-text-muted shadow-neumorph-inset" />
                    </motion.div>
                )}
            </div>

            {label && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted animate-pulse">
                    {label}
                </span>
            )}
        </div>
    );
};