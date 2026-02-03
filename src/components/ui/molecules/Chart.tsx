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
} from 'chart.js';
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

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
    className?: string;
}

export const Chart = ({
    type = 'line',
    title,
    subtitle,
    data = [],
    labels = [],
    height = 300,
    trend,
    className = "",
}: ChartProps) => {
    // 1. REFS & STATE
    const chartRef = useRef<any>(null);
    const [themeColor, setThemeColor] = useState('#a855f7');
    const [textColor, setTextColor] = useState('#2d3436');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const hasData = data.length > 0 && labels.length > 0;
    const totalValue = useMemo(() => data.reduce((a, b) => a + b, 0), [data]);

    // 2. THEME SYNC
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const style = getComputedStyle(document.documentElement);
        setTextColor(style.getPropertyValue('--text-primary').trim() || '#2d3436');
        const color = style.getPropertyValue('--theme-base').trim();
        if (color?.startsWith('var')) {
            const baseVar = color.match(/\(([^)]+)\)/)?.[1] || '--primary-base';
            setThemeColor(style.getPropertyValue(baseVar).trim() || '#a855f7');
        } else if (color) {
            setThemeColor(color);
        }
    }, []);

    // 3. GRADIENT INJECTION (The "Nuclear" Fix for Map Error)
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart || type !== 'line') return;

        const ctx = chart.ctx;
        const area = chart.chartArea;

        // Buat gradasi langsung pada instance chart
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, `${themeColor}40`);

        chart.data.datasets[0].backgroundColor = gradient;
        chart.update();
    }, [themeColor, type, hasData]);

    // 4. STABLE DATA OBJECT
    const chartData = useMemo(() => ({
        labels,
        datasets: [{
            label: title,
            data,
            fill: type === 'line',
            borderColor: type === 'line' ? themeColor : 'transparent',
            backgroundColor: type === 'line' ? `${themeColor}10` : (type === 'bar' ? themeColor :
                [themeColor, '#60a5fa', '#4ade80', '#fb7185', '#fbbf24']),
            tension: 0.4,
            pointRadius: type === 'line' ? 4 : 0,
            pointBackgroundColor: themeColor,
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            borderWidth: type === 'line' ? 3 : 0,
            borderRadius: type === 'bar' ? 12 : 0,
            hoverOffset: type === 'doughnut' ? 20 : 0,
        }]
    }), [labels, data, themeColor, type, title]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event: any, elements: any) => {
            if (type !== 'doughnut') return;
            setHoveredIndex(elements.length > 0 ? elements[0].index : null);
        },
        plugins: {
            legend: {
                display: type !== 'doughnut',
                position: 'bottom' as const,
                labels: { color: '#768390', font: { size: 10, weight: 'bold' }, usePointStyle: true, padding: 20 }
            },
            tooltip: { enabled: type !== 'doughnut', backgroundColor: 'rgba(28, 33, 40, 0.9)', cornerRadius: 12 }
        },
        scales: {
            x: { display: type === 'line' || type === 'bar', grid: { display: false }, ticks: { color: '#768390', font: { size: 10, weight: 'bold' } } },
            y: { display: type === 'line' || type === 'bar', grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#768390', font: { size: 10 } } }
        },
        cutout: type === 'doughnut' ? '82%' : undefined,
    }), [type]);

    if (!hasData) return null;

    return (
        <div className={`glass-effect rounded-[var(--border-radius)] p-6 md:p-8 border border-white/10 flex flex-col transition-all duration-500 hover:shadow-neumorph ${className}`}>
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h2 className="text-sm font-black italic uppercase tracking-widest text-text-primary">
                        {title.split(' ')[0]} <span className="text-[var(--theme-base)]">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    {subtitle && <p className="text-[9px] font-bold text-text-muted uppercase mt-1 tracking-widest opacity-60">{subtitle}</p>}
                </div>
                {trend && (
                    <div className="flex items-center gap-2 text-success-base bg-success-base/5 px-3 py-1 rounded-full border border-success-base/10">
                        <TrendingUp size={12} />
                        <span className="text-[10px] font-black">{trend}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 w-full relative flex items-center justify-center min-h-0" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
                {type === 'doughnut' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={hoveredIndex !== null ? `hover-${hoveredIndex}` : "total"}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                className="w-[55%] h-[55%] flex items-center justify-center"
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <text x="50" y="42" textAnchor="middle" className="fill-text-muted font-black uppercase" style={{ fontSize: '8px', letterSpacing: '0.1em' }}>
                                        {hoveredIndex !== null ? (labels[hoveredIndex] || "Detail") : "Total"}
                                    </text>
                                    <text x="50" y="64" textAnchor="middle" className="fill-text-primary font-black italic" style={{ fontSize: '24px' }}>
                                        {hoveredIndex !== null ? data[hoveredIndex] : totalValue}
                                    </text>
                                </svg>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                <div className="w-full h-full relative">
                    {type === 'bar' && <Bar data={chartData} options={chartOptions as any} />}
                    {type === 'pie' && <Pie data={chartData} options={chartOptions as any} />}
                    {type === 'doughnut' && <Doughnut data={chartData} options={chartOptions as any} />}
                    {type === 'line' && (
                        <Line
                            ref={chartRef} // Gunakan ref untuk stabilitas
                            data={chartData}
                            options={chartOptions as any}
                        />
                    )}
                </div>
            </div>

            {type === 'doughnut' && (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6 shrink-0 border-t border-white/5 pt-4">
                    {labels.map((label, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] || themeColor }} />
                            <span className={`text-[9px] font-bold uppercase tracking-tighter ${hoveredIndex === idx ? 'text-text-primary' : 'text-text-muted'}`}>{label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};