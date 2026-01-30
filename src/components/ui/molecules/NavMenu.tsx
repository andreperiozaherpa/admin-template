"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Index";

// --- CONSTANTS ---
const TRAVEL_SPRING: Transition = {
    type: "spring",
    stiffness: 380,
    damping: 35,
    mass: 1,
    restDelta: 0.001
};

const ICON_TRANSITION: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 30
};

const ACCORDION_TRANSITION: Transition = {
    height: {
        duration: 0.45,
        ease: [0.33, 1, 0.68, 1]
    },
    opacity: {
        duration: 0.3,
        ease: "linear"
    }
};

const CHILD_ITEM_VARIANTS = {
    closed: { opacity: 0, x: -8 },
    open: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            delay: i * 0.05,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        x: -5,
        transition: { duration: 0.2 }
    }
};

// --- INTERFACES ---
export interface NavItem {
    href: string;
    label: string;
    icon?: LucideIcon;
    badge?: string | number;
    badgeColor?: "primary" | "success" | "danger" | "warning";
    children?: NavItem[];
}

export interface NavMenuProps {
    items: NavItem[];
    className?: string;
}

// --- HELPERS ---
const checkActive = (pathname: string | null, href: string) => {
    if (!pathname) return false;
    if (href === '/' || href === '#') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
};

// --- COMPONENTS ---
const NavGroup = ({ item, pathname, index, onItemClick }: { item: NavItem, pathname: string | null, index: number, onItemClick?: () => void }) => {
    const isChildActive = useMemo(() =>
        !!item.children?.some(child => checkActive(pathname, child.href)),
        [item.children, pathname]);

    const [isOpen, setIsOpen] = useState<boolean>(isChildActive);

    useEffect(() => {
        setIsOpen(isChildActive);
    }, [pathname, isChildActive]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...TRAVEL_SPRING, delay: index * 0.05 }}
            className="relative w-full"
        >
            <div className="relative h-[52px] group">
                {isChildActive && (
                    <motion.div
                        layoutId="traveling-pill-bg"
                        className="absolute inset-0 rounded-[20px] bg-surface border border-white/5"
                        transition={TRAVEL_SPRING}
                        style={{ zIndex: 0 }}
                    />
                )}

                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    // PERBAIKAN: scale diubah ke 0.98 agar tombol tidak hilang saat diklik
                    whileTap={{ scale: 0.98 }}
                    className={`
                        w-full h-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative z-10
                        ${isOpen || isChildActive ? "text-[var(--theme-base)] font-black" : "text-text-secondary hover:text-text-primary font-bold"}
                    `}
                >
                    <div className={`
                        w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                        ${isChildActive ? "shadow-neumorph bg-surface" : "bg-surface-secondary/50 group-hover:shadow-neumorph"}
                    `}>
                        {item.icon && <item.icon size={18} />}
                    </div>

                    <span className="flex-1 text-sm text-left tracking-tight truncate">
                        {item.label}
                    </span>

                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="opacity-40"
                    >
                        <ChevronRight size={14} />
                    </motion.div>
                </motion.button>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={ACCORDION_TRANSITION}
                        style={{
                            overflow: 'hidden',
                            originY: 0,
                        }}
                        className=" space-y-1 border-l-2 border-border-main/5"
                    >
                        <div className="pb-2 pt-1">
                            {item.children?.map((child, idx) => {
                                const isSubActive = checkActive(pathname, child.href);
                                return (
                                    <motion.div
                                        key={child.href}
                                        custom={idx}
                                        initial="closed"
                                        animate="open"
                                        exit="exit"
                                        className="px-1"
                                    >
                                        <Link
                                            href={child.href}
                                            onClick={onItemClick}
                                            className={`
                                            relative flex items-center gap-3 px-4 py-2.5 text-[12px] rounded-xl transition-all duration-300
                                            ${isSubActive ? "text-[var(--theme-base)] font-bold bg-surface/30 shadow-neumorph-inset" : "text-text-muted hover:text-text-primary"}
                                        `}
                                        >
                                            <div className="w-1.5 flex justify-center shrink-0">
                                                {isSubActive && (
                                                    <motion.div
                                                        layoutId="subDotFlow"
                                                        // PERBAIKAN: Menggunakan variabel tema dinamis
                                                        className="w-1.5 h-1.5 bg-[var(--theme-base)] rounded-full shadow-[0_0_8px_var(--theme-glow)]"
                                                        transition={TRAVEL_SPRING}
                                                    />
                                                )}
                                            </div>
                                            <span className="truncate min-w-0 flex-1">{child.label}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const NavMenu = ({ items, className = "", onItemClick }: NavMenuProps & { onItemClick?: () => void }) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <nav className={`flex flex-col gap-2 p-2 ${className}`}>
            {items.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    return <NavGroup key={item.href} item={item} pathname={pathname} index={index} onItemClick={onItemClick} />;
                }

                const isActive = checkActive(pathname, item.href);

                return (
                    <div key={item.href} className="relative group">
                        {isActive && (
                            <motion.div
                                layoutId="traveling-pill-bg"
                                className="absolute inset-0 rounded-[20px] bg-surface shadow-neumorph-inset border border-white/5"
                                transition={TRAVEL_SPRING}
                                style={{ zIndex: 0 }}
                            />
                        )}

                        <Link key={item.href} href={item.href} onClick={onItemClick} className="block relative z-10">
                            <motion.div

                                whileHover={{ scale: 1.01 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500 select-none
                                    ${isActive ? "text-[var(--theme-base)] font-black" : "text-text-secondary hover:text-text-primary font-bold"}`}
                            >
                                <div className={`
                                    w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                                    ${isActive ? "shadow-neumorph bg-surface scale-110" : "bg-surface-secondary/50 group-hover:shadow-neumorph"}
                                `}>
                                    {item.icon && <item.icon size={18} className={isActive ? "text-[var(--theme-base)]" : "opacity-40 group-hover:opacity-100"} />}
                                </div>

                                <span className="flex-1 text-sm tracking-tight truncate">
                                    {item.label}
                                </span>

                                {item.badge && (
                                    <Badge variant={isActive ? "neumorph" : "soft"} size="sm">
                                        {item.badge}
                                    </Badge>
                                )}
                            </motion.div>
                        </Link>
                    </div>
                );
            })}
        </nav>
    );
};