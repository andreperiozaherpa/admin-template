"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

/**
 * PERBAIKAN UTAMA:
 * Menggunakan HTMLMotionProps<"div"> alih-alih HTMLAttributes standar.
 * Ini memastikan semua props yang diteruskan (termasuk event handlers) 
 * kompatibel dengan elemen <motion.div>.
 */
interface TooltipProps extends Omit<HTMLMotionProps<"div">, 'content'> {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    variant?: "neumorph" | "glass";
    delay?: number;
}

export const Tooltip = ({
    content,
    children,
    position = "top",
    variant = "neumorph",
    delay = 0.2,
    className = "",
    id,
    ...props
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    // Konfigurasi posisi animasi taktil Tubaba
    const positionVariants = {
        top: { initial: { y: 10, x: "-50%", opacity: 0 }, animate: { y: 0, x: "-50%", opacity: 1 }, exit: { y: 5, opacity: 0 }, classes: "bottom-full left-1/2 mb-3" },
        bottom: { initial: { y: -10, x: "-50%", opacity: 0 }, animate: { y: 0, x: "-50%", opacity: 1 }, exit: { y: -5, opacity: 0 }, classes: "top-full left-1/2 mt-3" },
        left: { initial: { x: 10, y: "-50%", opacity: 0 }, animate: { x: 0, y: "-50%", opacity: 1 }, exit: { x: 5, opacity: 0 }, classes: "right-full top-1/2 mr-3" },
        right: { initial: { x: -10, y: "-50%", opacity: 0 }, animate: { x: 0, y: "-50%", opacity: 1 }, exit: { x: -5, opacity: 0 }, classes: "left-full top-1/2 ml-3" },
    };

    const currentPos = positionVariants[position];

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        id={id}
                        initial={currentPos.initial}
                        animate={currentPos.animate}
                        exit={currentPos.exit}
                        transition={{
                            duration: 0.2,
                            delay,
                            ease: "easeOut"
                        }}
                        className={`
                            absolute z-[100] whitespace-nowrap pointer-events-none
                            px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                            ${currentPos.classes}
                            ${variant === "neumorph"
                                ? "bg-surface shadow-neumorph text-text-primary border border-white/40"
                                : "glass-effect text-text-primary"} 
                            ${className}
                        `.trim()}
                        {...props} // Sekarang props aman untuk disebar ke motion.div
                    >
                        {content}

                        {/* Arrow Element - Menyesuaikan dengan permukaan Neumorph */}
                        <div className={`
                            absolute w-2.5 h-2.5 rotate-45 border-white/20
                            ${variant === "neumorph" ? "bg-surface shadow-[2px_2px_4px_rgba(0,0,0,0.05)]" : "bg-glass-surface"}
                            ${position === "top" ? "top-full -mt-1.5 left-1/2 -translate-x-1/2 border-r border-b" : ""}
                            ${position === "bottom" ? "bottom-full -mb-1.5 left-1/2 -translate-x-1/2 border-l border-t" : ""}
                            ${position === "left" ? "left-full -ml-1.5 top-1/2 -translate-y-1/2 border-r border-t" : ""}
                            ${position === "right" ? "right-full -mr-1.5 top-1/2 -translate-y-1/2 border-l border-b" : ""}
                        `} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};