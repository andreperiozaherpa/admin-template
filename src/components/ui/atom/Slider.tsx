"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
    color?: "primary" | "success" | "danger" | "info" | "warning";
    label?: string;
    icon?: LucideIcon | React.ElementType;
    variant?: "linear" | "circular";
    size?: "sm" | "md" | "lg";
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

// =========================================
// SUB-COMPONENT: CIRCULAR SLIDER (KNOB)
// =========================================
const CircularSlider = ({
    value, min = 0, max = 100, step = 1, onChange, color = "primary", size = "md", label, icon: Icon,
    variant, // Ambil variant di sini agar tidak masuk ke domProps
    id, className = "",
    ...domProps // Sekarang domProps murni berisi atribut HTML (id, onClick, dll)
}: SliderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const colorClass = `var(--${color}-base)`;
    const valueRef = useRef(value);

    useEffect(() => { valueRef.current = value; }, [value]);

    const dimensionMap = { sm: 140, md: 180, lg: 240 };
    const width = dimensionMap[size];
    const center = width / 2;
    const radius = center - 25;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = size === "sm" ? 12 : size === "lg" ? 22 : 16;

    const valueToDegree = useCallback((val: number) => {
        const percentage = (clamp(val, min, max) - min) / (max - min);
        return percentage * 360;
    }, [min, max]);

    const angleMV = useMotionValue(valueToDegree(value));

    useEffect(() => {
        if (!isDragging) {
            animate(angleMV, valueToDegree(value), { type: "spring", stiffness: 300, damping: 30 });
        }
    }, [value, isDragging, angleMV, valueToDegree]);

    const strokeDashoffset = useTransform(angleMV, [0, 360], [circumference, 0]);
    const knobX = useTransform(angleMV, (a) => radius * Math.cos((a - 90) * (Math.PI / 180)));
    const knobY = useTransform(angleMV, (a) => radius * Math.sin((a - 90) * (Math.PI / 180)));

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);

        let angleDeg = (Math.atan2(dy, dx) + Math.PI / 2) * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360;

        let newValue = (angleDeg / 360) * (max - min) + min;
        const diff = newValue - valueRef.current;
        const range = max - min;

        if (Math.abs(diff) > range * 0.1) {
            newValue = valueRef.current > (min + range / 2) ? max : min;
        }

        if (step > 0) newValue = Math.round(newValue / step) * step;
        newValue = clamp(newValue, min, max);

        if (newValue !== valueRef.current) {
            onChange(newValue);
            angleMV.set(valueToDegree(newValue));
        }
    }, [min, max, step, onChange, angleMV, valueToDegree]);

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handleUp);
        }
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handleUp);
        };
    }, [isDragging, handlePointerMove]);

    return (
        <div
            id={id}
            ref={containerRef}
            className={`relative flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing ${className}`}
            style={{ width, height: width }}
            onPointerDown={(e) => {
                setIsDragging(true);
                handlePointerMove(e.nativeEvent as PointerEvent);
            }}
            {...domProps}
        >
            <div className="absolute inset-0 rounded-full bg-surface shadow-neumorph border border-border-main/5" />
            <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`} className="absolute inset-0 overflow-visible pointer-events-none">
                <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" className="text-text-muted/10" strokeWidth={strokeWidth} />
                <motion.circle
                    cx={center} cy={center} r={radius} fill="none" stroke={colorClass} strokeWidth={strokeWidth} strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, filter: `drop-shadow(0 0 8px ${colorClass}66)` }}
                />
            </svg>
            <motion.div
                className="absolute z-20 rounded-full bg-surface border border-white/40 shadow-neumorph flex items-center justify-center pointer-events-none"
                style={{ width: strokeWidth + 12, height: strokeWidth + 12, x: knobX, y: knobY }}
            >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorClass }} />
            </motion.div>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none p-6">
                {Icon && <Icon size={size === "sm" ? 22 : size === "lg" ? 38 : 30} className="mb-2 opacity-90" style={{ color: colorClass }} />}
                <span className={`font-black tabular-nums text-text-primary leading-none ${size === "sm" ? "text-xl" : size === "lg" ? "text-4xl" : "text-3xl"}`}>{value}</span>
                {label && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mt-2">{label}</span>}
            </div>
        </div>
    );
};

// =========================================
// SUB-COMPONENT: LINEAR SLIDER
// =========================================
const LinearSlider = ({
    value, min = 0, max = 100, step = 1, onChange, color = "primary", label, icon: Icon,
    variant, size, // Ambil props kustom di sini agar tidak bocor ke domProps
    id, className = "", ...domProps
}: SliderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const percentage = ((value - min) / (max - min)) * 100;
    const colorClass = `var(--${color}-base)`;

    return (
        <div id={id} className={`w-full space-y-4 select-none ${className}`} {...domProps}>
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={14} style={{ color: colorClass }} className="opacity-80" />}
                    {label && <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>}
                </div>
                <span className="text-xs font-black tabular-nums text-text-primary">{value}</span>
            </div>
            <div className="relative flex items-center group h-6">
                <div className="absolute w-full h-2.5 rounded-full bg-surface shadow-neumorph-inset border border-border-main/5" />
                <motion.div
                    className="absolute h-2.5 rounded-full z-10" initial={false} animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ backgroundColor: colorClass, boxShadow: `0 0 12px ${colorClass}66` }}
                />
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)}
                    className="absolute w-full h-6 opacity-0 cursor-pointer z-30"
                />
                <motion.div
                    className={`absolute z-20 w-6 h-6 rounded-full bg-surface border border-white/40 shadow-neumorph flex items-center justify-center transition-transform pointer-events-none ${isDragging ? "scale-90" : "scale-100 group-hover:scale-110"}`}
                    animate={{ left: `calc(${percentage}% - 12px)` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorClass, boxShadow: `0 0 8px ${colorClass}aa` }} />
                </motion.div>
            </div>
        </div>
    );
};

export const Slider = (props: SliderProps) => {
    const { variant = "linear" } = props;
    if (variant === "circular") return <CircularSlider {...props} />;
    return <LinearSlider {...props} />;
};