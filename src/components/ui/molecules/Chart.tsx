"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TooltipItem
} from 'chart.js';
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Info, PieChart, EyeOff } from "lucide-react";

// Registrasi Modul Chart.js
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Filler, Legend
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface ChartProps {
    type?: ChartType;
    title: string;
    subtitle?: string;
    data?: number[];
    labels?: string[];
    height?: number | string;
    trend?: string;
    onSliceClick?: (index: number) => void;
    noContainer?: boolean;
    className?: string;
}

export const Chart = ({
    type = 'line',
    title,
    subtitle,
    data = [],
    labels = [],
    height = 350,
    trend,
    onSliceClick,
    noContainer = false,
    className = "",
}: ChartProps) => {
    // 1. REF UNTUK MENGAKSES CHART INSTANCE
    const chartRef = useRef<any>(null);

    const [themeColor, setThemeColor] = useState('#6366f1');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // 2. STATE UNTUK MELACAK DATA YANG DI-HIDE
    const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);

    // 3. HITUNG TOTAL VALUE DINAMIS (Hanya data yang visible yang dijumlahkan)
    const totalValue = useMemo(() => {
        return data.reduce((acc, curr, idx) => {
            // Jika index sedang disembunyikan, jangan dijumlahkan
            if (hiddenIndices.includes(idx)) return acc;
            return acc + (curr || 0);
        }, 0);
    }, [data, hiddenIndices]);

    const hasData = data.length > 0 && labels.length > 0;

    const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", {
        notation: "compact",
        maximumFractionDigits: 1,
        style: "currency",
        currency: "IDR"
    }).format(val);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const style = getComputedStyle(document.documentElement);
            const primary = style.getPropertyValue('--primary-base').trim();
            if (primary) setThemeColor(primary);
        }
    }, []);

    // Palet Warna
    const colorPalette = useMemo(() => [
        themeColor,      // Primary
        '#0ea5e9',       // Sky Blue
        '#10b981',       // Emerald
        '#f59e0b',       // Amber
        '#f43f5e',       // Rose
        '#8b5cf6',       // Violet
        '#06b6d4',       // Cyan
        '#64748b',       // Slate
    ], [themeColor]);

    // 4. LOGIKA TRENDING (UP/DOWN)
    const isTrendingDown = trend?.trim().startsWith('-');
    const TrendIcon = isTrendingDown ? TrendingDown : TrendingUp;

    // Warna Trend Badge
    const trendStyles = isTrendingDown
        ? "text-rose-600 bg-rose-50 border-rose-100"
        : "text-emerald-600 bg-emerald-50 border-emerald-100";

    // 5. FUNGSI TOGGLE VISIBILITY
    const handleLegendClick = (index: number) => {
        const chart = chartRef.current;
        if (chart) {
            // Fungsi bawaan Chart.js untuk hide/show data
            chart.toggleDataVisibility(index);
            chart.update();

            // Update state lokal untuk styling legend & perhitungan total
            setHiddenIndices(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index) // Show
                    : [...prev, index]              // Hide
            );
        }
    };

    const chartData = useMemo(() => ({
        labels,
        datasets: [{
            label: title,
            data,
            backgroundColor: (type === 'pie' || type === 'doughnut')
                ? colorPalette
                : (type === 'line' ? `${themeColor}20` : themeColor),
            borderColor: (type === 'line' || type === 'bar') ? themeColor : '#ffffff',
            borderWidth: type === 'doughnut' ? 2 : 0,
            hoverOffset: type === 'doughnut' ? 8 : 0,
            borderRadius: type === 'bar' ? 6 : 4,
            tension: 0.4,
            pointRadius: type === 'line' ? 4 : 0,
            pointHoverRadius: 6,
        }]
    }), [labels, data, themeColor, type, title, colorPalette]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any[]) => {
            if (elements.length > 0 && onSliceClick) {
                // Kirim index data yang diklik ke parent
                onSliceClick(elements[0].index);
            }
        },
        onHover: (event: any, elements: any) => {
            if (type === 'doughnut') {
                setHoveredIndex(elements.length > 0 ? elements[0].index : null);
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: type !== 'doughnut',
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 13 },
                callbacks: {
                    label: (context: TooltipItem<any>) => `
                    ${formatCurrency(context.parsed.y || context.parsed)}
                    `
                }
            }
        },
        scales: {
            x: {
                display: type === 'line' || type === 'bar',
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 10 } }
            },
            y: {
                display: type === 'line' || type === 'bar',
                grid: { color: 'rgba(0,0,0,0.03)' },
                ticks: { color: '#94a3b8', font: { size: 10 }, callback: (value: any) => formatCurrency(value) }
            }
        },
        cutout: type === 'doughnut' ? '70%' : undefined,
    }), [type, onSliceClick]);

    const renderChart = () => (
        <div className="w-full h-full relative flex flex-col items-center justify-center">
            {type === 'doughnut' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={hoveredIndex !== null ? `hover-${hoveredIndex}` : "total"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="text-center"
                        >
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                {/* Tampilkan nama item yang di-hover, atau "Total Aset" */}
                                {hoveredIndex !== null ? labels[hoveredIndex] : "Total Aset"}
                            </p>
                            <p className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">
                                {/* Tampilkan nilai item atau Total Value dinamis */}
                                {hoveredIndex !== null ? formatCurrency(data[hoveredIndex]) : formatCurrency(totalValue)}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            <div className="relative w-full h-full z-0">
                {/* PASANG REF PADA SEMUA TIPE CHART AGAR BISA DIAKSES */}
                {type === 'bar' && <Bar ref={chartRef} data={chartData} options={chartOptions as any} />}
                {type === 'line' && <Line ref={chartRef} data={chartData} options={chartOptions as any} />}
                {type === 'pie' && <Pie ref={chartRef} data={chartData} options={chartOptions as any} />}
                {type === 'doughnut' && <Doughnut ref={chartRef} data={chartData} options={chartOptions as any} />}
            </div>
        </div>
    );

    if (!hasData) return <div className={`h-[${height}px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl`}>No Data</div>;

    if (noContainer) return <div style={{ height }}>{renderChart()}</div>;

    return (
        <div className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col ${className}`}>
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                        {type === 'doughnut' && <PieChart size={16} className="text-primary-base" />}
                        {title}
                    </h2>
                    {subtitle && <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wide">{subtitle}</p>}
                </div>

                {/* 6. TREND BADGE DINAMIS */}
                {trend && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${trendStyles}`}>
                        <TrendIcon size={12} />
                        <span className="text-[10px] font-bold">
                            {trend?.replace('-', '')}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 w-full min-h-0 relative" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
                {renderChart()}
            </div>

            {/* CUSTOM LEGEND DENGAN KLIK HANDLER */}
            {(type === 'doughnut' || type === 'pie') && (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6 shrink-0 border-t border-dashed border-gray-100 pt-4">
                    {labels.map((label, idx) => {
                        const color = colorPalette[idx % colorPalette.length];
                        const isHidden = hiddenIndices.includes(idx); // Cek status hidden
                        const isHovered = hoveredIndex === idx;
                        const isDimmed = (hoveredIndex !== null && hoveredIndex !== idx) || isHidden; // Redup jika hidden atau tidak di-hover

                        return (
                            <button
                                key={idx}
                                onClick={() => handleLegendClick(idx)} // AKSI KLIK
                                className={`
                                    flex items-center gap-1.5 transition-all duration-300 group outline-none
                                    ${isHidden ? 'opacity-40 grayscale' : (isDimmed ? 'opacity-30 blur-[0.5px]' : 'opacity-100')}
                                `}
                                title={isHidden ? "Klik untuk menampilkan" : "Klik untuk menyembunyikan"}
                            >
                                <div
                                    className={`
                                        w-2.5 h-2.5 rounded-full shadow-sm transition-transform duration-300
                                        ${isHidden ? 'scale-75 bg-gray-400' : ''}
                                        ${!isHidden && 'group-hover:scale-125'}
                                    `}
                                    style={{ backgroundColor: isHidden ? undefined : color }}
                                />
                                <span
                                    className={`
                                        text-[10px] font-bold uppercase tracking-tight transition-all
                                        ${isHidden ? 'text-gray-400 line-through decoration-gray-400' : 'text-gray-500'}
                                        ${!isHidden && isHovered ? 'text-gray-900 scale-105' : ''}
                                    `}
                                >
                                    {label}
                                </span>
                                {/* Ikon Mata Kecil saat Hidden */}
                                {isHidden && <EyeOff size={10} className="text-gray-400" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
};