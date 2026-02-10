import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity } from "lucide-react";

// Definisi varian warna untuk estetika yang berbeda
type CardVariant = "primary" | "secondary" | "success" | "warning" | "danger";

interface StatsCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    trend?: number; // Persentase kenaikan/penurunan (misal: 12.5 atau -5.2)
    variant?: CardVariant;
    description?: string;
    loading?: boolean;
    className?: string;
    onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
    primary: "from-blue-500/10 to-blue-600/5 border-blue-200 text-blue-700",
    secondary: "from-violet-500/10 to-purple-600/5 border-violet-200 text-violet-700",
    success: "from-emerald-500/10 to-green-600/5 border-emerald-200 text-emerald-700",
    warning: "from-amber-500/10 to-orange-600/5 border-amber-200 text-amber-700",
    danger: "from-red-500/10 to-rose-600/5 border-red-200 text-red-700",
};

const iconBgStyles: Record<CardVariant, string> = {
    primary: "bg-blue-100 text-blue-600",
    secondary: "bg-violet-100 text-violet-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
};

export function StatsCard({
    title,
    value,
    icon,
    trend,
    variant = "primary",
    description,
    loading = false,
    className,
    onClick
}: StatsCardProps) {

    // Formatter Uang
    const formattedValue = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);

    // Jika Loading
    if (loading) {
        return (
            <div className="h-40 rounded-2xl bg-gray-100 animate-pulse border border-gray-200" />
        );
    }

    const isPositive = trend ? trend >= 0 : true;

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
                "bg-gradient-to-br border backdrop-blur-sm",
                "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
                variantStyles[variant],
                className
            )}
        >
            {/* Background Decor - Abstract Circles */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-[0.05] transition-transform duration-500 group-hover:scale-150" />
            <div className="absolute -right-2 -bottom-6 h-32 w-32 rounded-full bg-current opacity-[0.03] transition-transform duration-700 group-hover:scale-110" />

            <div className="relative z-10 flex flex-col h-full justify-between">

                {/* Header: Title & Icon */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500/90 tracking-wide uppercase">
                            {title}
                        </p>
                        {description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{description}</p>
                        )}
                    </div>
                    <div className={cn("p-2.5 rounded-xl shadow-sm transition-colors", iconBgStyles[variant])}>
                        {icon || <Activity size={20} />}
                    </div>
                </div>

                {/* Body: Value & Trend */}
                <div className="mt-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
                        {formattedValue}
                    </h3>

                    {/* Trend Indicator */}
                    {trend !== undefined && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                                "flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
                                isPositive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            )}>
                                {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {Math.abs(trend)}%
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                dari bulan lalu
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}