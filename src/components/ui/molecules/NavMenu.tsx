"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Index";

// --- CONSTANTS & ANIMATIONS (Tetap Sama) ---
const TRAVEL_SPRING: Transition = {
    type: "spring",
    stiffness: 380,
    damping: 35,
    mass: 1,
    restDelta: 0.001
};

const ACCORDION_TRANSITION: Transition = {
    height: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
    opacity: { duration: 0.25, ease: "linear" }
};

// --- HELPERS ---
const checkActive = (pathname: string | null, href: string) => {
    if (!pathname) return false;
    if (href === '/' || href === '#') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
};

const isAnyChildActive = (item: NavItem, pathname: string | null): boolean => {
    if (!item.children) return false;
    return item.children.some(child =>
        checkActive(pathname, child.href) || isAnyChildActive(child, pathname)
    );
};

// --- INTERFACES ---
export interface NavItem {
    href: string;
    label: string;
    icon?: LucideIcon;
    badge?: string | number;
    children?: NavItem[];
}

export interface NavMenuProps {
    items: NavItem[];
    className?: string;
    onItemClick?: () => void;
}

// --- SUB-COMPONENT: NAV ITEM (Recursive) ---
const NavMenuItem = ({
    item,
    pathname,
    index,
    depth = 0,
    onItemClick,
    openGroupHref,
    onToggle
}: {
    item: NavItem;
    pathname: string | null;
    index: number;
    depth?: number;
    onItemClick?: () => void;
    openGroupHref: string | null;
    onToggle: (href: string) => void;
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = checkActive(pathname, item.href);
    const activeChild = useMemo(() => isAnyChildActive(item, pathname), [item, pathname]);

    const [localOpen, setLocalOpen] = useState(activeChild);
    const isOpen = depth === 0 ? openGroupHref === item.href : localOpen;

    const handleInternalToggle = () => {
        if (depth === 0) {
            onToggle(item.href);
        } else {
            setLocalOpen(!localOpen);
        }
    };

    // 1. RENDER SEBAGAI GROUP (Jika punya children)
    if (hasChildren) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRAVEL_SPRING, delay: index * 0.05 }}
                className="relative w-full"
            >
                <div className="relative h-[52px] group">
                    {(activeChild || isActive) && depth === 0 && (
                        <motion.div
                            layoutId="traveling-pill-bg"
                            className="absolute inset-0 rounded-[20px] bg-surface shadow-neumorph-inset border border-white/5"
                            transition={TRAVEL_SPRING}
                            style={{ zIndex: 0 }}
                        />
                    )}

                    <motion.button
                        onClick={handleInternalToggle}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            w-full h-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative z-10
                            ${isOpen || activeChild || isActive ? "text-[var(--theme-base)] font-black" : "text-text-secondary hover:text-text-primary font-bold"}
                            ${depth > 0 ? "pl-4" : ""} 
                        `}
                    >
                        {/* FIX: Hanya tampilkan Ikon jika depth === 0 */}
                        {depth === 0 ? (
                            <div className={`
                                w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                                ${activeChild || isActive ? "shadow-neumorph bg-surface" : "bg-surface-secondary/50 group-hover:shadow-neumorph"}
                            `}>
                                {item.icon && <item.icon size={18} />}
                            </div>
                        ) : (
                            /* Dot style untuk parent group di dalam submenu */
                            <div className="w-6 flex justify-center shrink-0">
                                {(activeChild || isActive) && (
                                    <motion.div
                                        layoutId={`subDot-${item.href}`}
                                        className="w-1.5 h-1.5 bg-[var(--theme-base)] rounded-full shadow-[0_0_8px_var(--theme-glow)]"
                                        transition={TRAVEL_SPRING}
                                    />
                                )}
                            </div>
                        )}

                        <span className={`flex-1 ${depth > 0 ? "text-[12px]" : "text-sm"} text-left tracking-tight truncate`}>
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
                            className="space-y-1 border-l-2 border-border-main/5 overflow-hidden origin-top ml-4"
                        >
                            <div className="pb-2 pt-1">
                                {item.children?.map((child, idx) => (
                                    <NavMenuItem
                                        key={child.href}
                                        item={child}
                                        pathname={pathname}
                                        index={idx}
                                        depth={depth + 1}
                                        onItemClick={onItemClick}
                                        openGroupHref={null}
                                        onToggle={() => { }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }

    // 2. RENDER SEBAGAI SINGLE ITEM
    return (
        <div className="relative group">
            {isActive && depth === 0 && (
                <motion.div
                    layoutId="traveling-pill-bg"
                    className="absolute inset-0 rounded-[20px] bg-surface shadow-neumorph-inset border border-white/5"
                    transition={TRAVEL_SPRING}
                    style={{ zIndex: 0 }}
                />
            )}

            <Link
                href={item.href}
                onClick={() => {
                    if (depth === 0) onToggle("");
                    onItemClick?.();
                }}
                className="block relative z-10"
            >
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500 select-none
                        ${depth > 0 ? "pl-4" : ""}
                        ${isActive ? "text-[var(--theme-base)] font-black" : "text-text-secondary hover:text-text-primary font-bold"}
                        ${isActive && depth > 0 ? "bg-surface/30 shadow-neumorph-inset" : ""}
                    `}
                >
                    {/* FIX: Logika ternary untuk membedakan level 0 dan level dalam */}
                    {depth > 0 ? (
                        <div className="w-6 flex justify-center shrink-0">
                            {isActive && (
                                <motion.div
                                    layoutId="subDotFlow"
                                    className="w-1.5 h-1.5 bg-[var(--theme-base)] rounded-full shadow-[0_0_8px_var(--theme-glow)]"
                                    transition={TRAVEL_SPRING}
                                />
                            )}
                        </div>
                    ) : (
                        /* Level 0 menggunakan Ikon */
                        <div className={`
                            w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                            ${isActive ? "shadow-neumorph bg-surface scale-110" : "bg-surface-secondary/50 group-hover:shadow-neumorph"}
                        `}>
                            {item.icon && <item.icon size={18} className={isActive ? "text-[var(--theme-base)]" : "opacity-40 group-hover:opacity-100"} />}
                        </div>
                    )}

                    <span className={`flex-1 ${depth > 0 ? "text-[12px]" : "text-sm"} tracking-tight truncate`}>
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
};

// --- MAIN COMPONENT ---
export const NavMenu = ({ items, className = "", onItemClick }: NavMenuProps) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [openGroupHref, setOpenGroupHref] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const activeGroup = items.find(item => isAnyChildActive(item, pathname));
        if (activeGroup) setOpenGroupHref(activeGroup.href);
    }, [pathname, items]);

    if (!mounted) return null;

    const handleToggle = (href: string) => {
        setOpenGroupHref(prev => prev === href ? null : href);
    };

    return (
        <nav className={`flex flex-col gap-2 p-2 ${className}`}>
            {items.map((item, index) => (
                <NavMenuItem
                    key={item.href}
                    item={item}
                    index={index}
                    pathname={pathname}
                    onItemClick={onItemClick}
                    openGroupHref={openGroupHref}
                    onToggle={handleToggle}
                />
            ))}
        </nav>
    );
};