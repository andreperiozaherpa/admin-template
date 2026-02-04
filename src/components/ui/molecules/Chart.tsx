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

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Filler, Legend
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface ChartDataset {
    label: string;
    data: number[];
    color?: string;
}

interface ChartProps {
    type?: ChartType;
    title: string;
    subtitle?: string;
    data?: number[]; // Single data support
    datasets?: ChartDataset[]; // Multi dataset support
    labels?: string[];
    height?: number | string;
    noContainer?: boolean;
    className?: string;
}

export const Chart = ({
    type = 'line',
    title,
    subtitle,
    data = [],
    datasets,
    labels = [],
    height = 500,
    noContainer = false,
    className = "",
}: ChartProps) => {
    const [themeColor, setThemeColor] = useState('#a855f7');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const style = getComputedStyle(document.documentElement);
        const color = style.getPropertyValue('--theme-base').trim();
        setThemeColor(color || '#a855f7');
    }, []);

    const finalDatasets = useMemo(() => {
        if (datasets && datasets.length > 0) {
            return datasets.map((ds, idx) => ({
                label: ds.label,
                data: ds.data,
                borderColor: ds.color || (idx === 0 ? '#94a3b8' : themeColor),
                backgroundColor: ds.color || (idx === 0 ? '#94a3b8' : themeColor),
                borderRadius: 6,
                borderWidth: 1,
            }));
        }
        return [{
            label: title,
            data: data,
            backgroundColor: themeColor,
            borderRadius: 8,
        }];
    }, [datasets, data, themeColor, title]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: { color: '#768390', font: { size: 11, weight: 'bold' }, padding: 20 }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#768390', font: { size: 10, weight: 'bold' } }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: {
                    color: '#768390',
                    font: { size: 10 },
                    maxTicksLimit: 10, // MENAMBAH JUMLAH TITIK DATA PADA SUMBU Y
                    callback: function (value: any) {
                        // Memperpendek angka (jt, M, T) agar tidak memakan tempat
                        if (value >= 1e12) return (value / 1e12).toFixed(1) + ' T';
                        if (value >= 1e9) return (value / 1e9).toFixed(1) + ' M';
                        if (value >= 1e6) return (value / 1e6).toFixed(1) + ' jt';
                        return value;
                    }
                }
            }
        }
    };

    const content = (
        <div className="w-full h-full relative" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
            {type === 'bar' && <Bar data={{ labels, datasets: finalDatasets }} options={chartOptions as any} />}
            {type === 'line' && <Line data={{ labels, datasets: finalDatasets }} options={chartOptions as any} />}
            {type === 'pie' && <Pie data={{ labels, datasets: finalDatasets }} options={chartOptions as any} />}
            {type === 'doughnut' && <Doughnut data={{ labels, datasets: finalDatasets }} options={chartOptions as any} />}
        </div>
    );

    if (noContainer) return <div className={`w-full ${className}`}>{content}</div>;

    return (
        <div className={`glass-effect rounded-[2rem] p-6 border border-white/5 flex flex-col ${className}`}>
            {content}
        </div>
    );
};