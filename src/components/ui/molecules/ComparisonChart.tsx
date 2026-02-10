"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    TooltipItem,
    ScriptableContext,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { cn } from "@/lib/utils";
import { Play, Pause, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ComparisonChartProps {
    data: { name: string; awal: number; akhir: number }[];
    title: string;
    periodStart: string;
    periodEnd: string;
    className?: string;
    itemsPerView?: number;
}

export function ComparisonChart({
    data,
    title,
    periodStart,
    periodEnd,
    className,
    itemsPerView = 6,
}: ComparisonChartProps) {

    const [windowStart, setWindowStart] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false); // State untuk Auto-Play
    const chartRef = useRef<any>(null);

    const maxStart = Math.max(0, data.length - itemsPerView);

    // --- LOGIC: Auto-Play Heart Rate Effect ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setWindowStart((prev) => {
                    // Jika sampai ujung, kembali ke awal (looping)
                    if (prev >= maxStart) return 0;
                    return prev + 1;
                });
            }, 2000); // Geser setiap 2 detik
        }
        return () => clearInterval(interval);
    }, [isPlaying, maxStart]);

    // Logic Slicing Data
    const visibleData = useMemo(() => {
        if (data.length <= itemsPerView) return data;
        return data.slice(windowStart, windowStart + itemsPerView);
    }, [data, windowStart, itemsPerView]);

    // --- UI: Helper Gradient ---
    const createGradient = (ctx: CanvasRenderingContext2D, colorStart: string, colorEnd: string) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    };

    const chartData = {
        labels: visibleData.map((item) => item.name),
        datasets: [
            {
                label: "Posisi Awal",
                // Gradient Abu-abu ke Silver
                backgroundColor: (context: ScriptableContext<"bar">) => {
                    const ctx = context.chart.ctx;
                    if (!ctx) return "#9CA3AF";
                    return createGradient(ctx, "#9CA3AF", "#E5E7EB");
                },
                data: visibleData.map((item) => item.awal),
                borderRadius: 8, // Lebih bulat
                borderSkipped: false, // Membulatkan semua sisi (atas bawah)
                barPercentage: 0.6,
                categoryPercentage: 0.8,
            },
            {
                label: "Posisi Akhir",
                // Gradient Biru Tua ke Biru Muda
                backgroundColor: (context: ScriptableContext<"bar">) => {
                    const ctx = context.chart.ctx;
                    if (!ctx) return "#2563EB";
                    return createGradient(ctx, "#3B82F6", "#60A5FA");
                },
                data: visibleData.map((item) => item.akhir),
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800, // Lebih lambat biar smooth
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                position: "top",
                align: "end",
                labels: {
                    usePointStyle: true,
                    pointStyle: "rectRounded",
                    boxWidth: 12,
                    font: { family: "'Inter', sans-serif", size: 12 }
                },
            },
            tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                titleColor: "#111827",
                bodyColor: "#4B5563",
                borderColor: "#E5E7EB",
                borderWidth: 1,
                padding: 14,
                cornerRadius: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function (context: TooltipItem<"bar">) {
                        let label = context.dataset.label || "";
                        if (label) label += ": ";
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                            }).format(context.parsed.y);
                        }
                        return label;
                    },
                    // Kita TIDAK menambahkan callback 'title' di sini, 
                    // sehingga tooltip akan tetap menampilkan nama lengkap (default behavior).
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, family: "'Inter', sans-serif" }, // Font sedikit dikecilkan
                    color: "#6B7280",
                    maxRotation: 45,
                    minRotation: 45,

                    // --- LOGIKA TRUNCATE / PEMOTONGAN LABEL ---
                    callback: function (value) {
                        // 'this' merujuk pada Scale object Chart.js
                        const label = this.getLabelForValue(value as number);

                        // Batasi maksimal 15 karakter (sesuaikan angka ini jika perlu)
                        const MAX_LENGTH = 15;

                        if (typeof label === 'string' && label.length > MAX_LENGTH) {
                            return label.substring(0, MAX_LENGTH) + "...";
                        }
                        return label;
                    }
                },
            },
            y: {
                border: { display: false },
                grid: { color: "#F3F4F6" },
                ticks: {
                    color: "#9CA3AF",
                    font: { size: 10 },
                    callback: (value) => new Intl.NumberFormat("id-ID", { notation: "compact" }).format(Number(value)),
                },
            },
        },
        interaction: {
            mode: "index",
            intersect: false,
        },
    };

    return (
        <div className={cn(
            "bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5",
            className
        )}>

            {/* --- HEADER MEWAH --- */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <BarChart3 size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 font-medium pl-1">
                        Periode: {periodStart} — {periodEnd}
                    </p>
                </div>

                {/* Indikator Window/Pagination text */}
                <div className="hidden md:block text-right">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                        {windowStart + 1} - {Math.min(windowStart + itemsPerView, data.length)}
                        <span className="text-gray-400 font-normal"> / {data.length}</span>
                    </span>
                </div>
            </div>

            {/* --- AREA CHART --- */}
            <div className="relative flex-1 w-full min-h-[300px]">
                <Bar ref={chartRef} data={chartData} options={options} />
            </div>

            {/* --- KONTROL UI PREMIUM --- */}
            {data.length > itemsPerView && (
                <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center gap-4">

                    {/* Tombol Play/Pause dengan efek Neumorph halus */}
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95",
                            isPlaying
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        )}
                        title={isPlaying ? "Pause Auto-Scroll" : "Play Auto-Scroll"}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>

                    {/* Tombol Manual Prev */}
                    <button
                        disabled={windowStart === 0}
                        onClick={() => { setIsPlaying(false); setWindowStart(Math.max(0, windowStart - 1)); }}
                        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Custom Slider Bar */}
                    <div className="flex-1 relative group h-6 flex items-center">
                        {/* Track Background */}
                        <div className="absolute w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-all duration-300"
                                style={{
                                    width: `${((windowStart + itemsPerView) / data.length) * 100}%`
                                }}
                            />
                        </div>

                        {/* Actual Range Input (Invisible but Clickable) */}
                        <input
                            type="range"
                            min={0}
                            max={maxStart}
                            value={windowStart}
                            onChange={(e) => {
                                setIsPlaying(false); // Matikan auto-play jika user menggeser manual
                                setWindowStart(Number(e.target.value));
                            }}
                            className="absolute w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-10"
                        />

                        {/* Custom Thumb (Visual Only) */}
                        <div
                            className="absolute h-4 w-4 bg-white border-2 border-blue-600 rounded-full shadow-md pointer-events-none transition-all duration-100 ease-out"
                            style={{
                                left: `${(windowStart / maxStart) * 100}%`,
                                transform: `translateX(-${(windowStart / maxStart) * 100}%)` // Koreksi posisi thumb
                            }}
                        />
                    </div>

                    {/* Tombol Manual Next */}
                    <button
                        disabled={windowStart >= maxStart}
                        onClick={() => { setIsPlaying(false); setWindowStart(Math.min(maxStart, windowStart + 1)); }}
                        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>

                </div>
            )}
        </div>
    );
}