"use client";

import React, { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Save, AlertCircle, CheckCircle2, X, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/molecules/Card";
import { Button } from "@/components/ui/atom/Button";
import { Badge } from "@/components/ui/atom/Badge";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/services/api.service";

interface DataRekening {
    nomor_rekening: string;
    nama_rekening: string;
    saldo: number;
    kategori: string;
}

interface UploadedData {
    tanggal: string;
    data: DataRekening[];
}

const KATEGORI_MAPPING: Record<string, string> = {
    "kas": "kasda",
    "tunai": "kasda",
    "giro": "kasda",
    "deposito": "kasda",
    "escrow": "escrow",
    "titipan": "escrow",
    "bpkd": "skpd_pengeluaran",
    "dinas": "skpd_pengeluaran",
    "kecamatan": "skpd_pengeluaran",
    "kelurahan": "skpd_pengeluaran",
    "sekolah": "sekolah",
    "sd": "sekolah",
    "smp": "sekolah",
    "sma": "sekolah",
    "puskesmas": "blud_pasar_puskes",
    "blud": "blud_pasar_puskes",
    "pasar": "blud_pasar_puskes",
};

const guessKategori = (namaRekening: string): string => {
    const lower = namaRekening.toLowerCase();
    for (const [key, value] of Object.entries(KATEGORI_MAPPING)) {
        if (lower.includes(key)) return value;
    }
    return "skpd_penerimaan";
};

export default function InputDataPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<UploadedData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const processFile = useCallback(async (file: File) => {
        setIsProcessing(true);
        setFileName(file.name);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            
            // Find sheet with TGL: date (sheets 396, 414, 394 have this)
            const sheetNames = workbook.SheetNames;
            let jsonData: any[][] = [];
            let tanggal = "";
            
            // Try to find TGL: in any sheet
            for (const sheetName of sheetNames) {
                if (sheetName === "Sheet1" || sheetName === "TABUNGAN") continue;
                
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
                
                // Look for TGL: in first few rows
                for (let i = 0; i < Math.min(10, sheetData.length); i++) {
                    const row = sheetData[i];
                    if (!row) continue;
                    
                    const rowStr = String(row.join(" ")).toUpperCase();
                    if (rowStr.includes("TGL:")) {
                        // Extract date from TGL: DD/MM/YYYY (spreadsheet format is DD/MM/YYYY)
                        const tglMatch = rowStr.match(/TGL:\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                        if (tglMatch) {
                            const day = tglMatch[1].padStart(2, "0");
                            const month = tglMatch[2].padStart(2, "0");
                            const year = tglMatch[3];
                            // Keep as DD/MM/YYYY for backend compatibility
                            tanggal = `${day}/${month}/${year}`;
                            jsonData = sheetData;
                            break;
                        }
                    }
                }
                
                if (tanggal) break;
            }
            
            // If no TGL found, use first sheet
            if (!jsonData.length) {
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
            }
            
            const dataRekening: DataRekening[] = [];

            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!row || row.length === 0) continue;

                const rowStr = String(row[0] || "").toLowerCase();
                
                if (rowStr.includes("tanggal") || rowStr.includes("date")) {
                    const dateVal = row[1];
                    if (dateVal) {
                        if (typeof dateVal === "number") {
                            const date = XLSX.SSF.parse_date_code(dateVal);
                            tanggal = `${String(date.m).padStart(2, "0")}/${String(date.d).padStart(2, "0")}/${date.y}`;
                        } else {
                            tanggal = String(dateVal);
                        }
                    }
                    continue;
                }

                const rekening = String(row[0] || "").trim();
                const nama = String(row[1] || "").trim();
                const saldo = parseFloat(String(row[2] || "0").replace(/[^0-9.-]/g, "")) || 0;

                if (rekening && nama && !isNaN(saldo)) {
                    dataRekening.push({
                        nomor_rekening: rekening,
                        nama_rekening: nama,
                        saldo: saldo,
                        kategori: guessKategori(nama),
                    });
                }
            }

            if (!tanggal) {
                const now = new Date();
                tanggal = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
            }

            setParsedData({ tanggal, data: dataRekening });
            
            toast.success(`Berhasil membaca ${dataRekening.length} data rekening`, {
                description: `Tanggal: ${tanggal}`,
            });

        } catch (error) {
            console.error(error);
            toast.error("Gagal memproses file Excel");
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            processFile(file);
        } else {
            toast.error("Format file tidak didukung. Gunakan .xlsx atau .xls");
        }
    }, [processFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            processFile(file);
        }
    }, [processFile]);

    const handleSave = async () => {
        if (!selectedFile) {
            toast.error("Pilih file terlebih dahulu");
            return;
        }

        const file = selectedFile;
        const tanggal = parsedData?.tanggal || new Date().toISOString().split('T')[0];

        try {
            await api.uploadSaldo(file, tanggal);
            toast.success("Data berhasil diupload ke backend");
            setParsedData(null);
            setFileName(null);
            setSelectedFile(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Gagal upload data");
        }
    };

    const handleReset = () => {
        setParsedData(null);
        setFileName(null);
        setShowPreview(false);
        setSelectedFile(null);
    };

    const totalSaldo = parsedData?.data.reduce((acc, item) => acc + item.saldo, 0) || 0;

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Input Data Saldo</h1>
                    <p className="text-gray-500 mt-1">Upload file Excel untuk import data saldo OPD</p>
                </div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-sm">
                        ← Kembali ke Dashboard
                    </Button>
                </Link>
            </div>

            {!parsedData ? (
                <Card className="p-8">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`
                            relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
                            ${isDragging 
                                ? "border-primary-base bg-primary-base/5 scale-[1.02]" 
                                : "border-gray-200 hover:border-primary-base/50"}
                        `}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className={`
                                w-20 h-20 rounded-full flex items-center justify-center transition-all
                                ${isDragging ? "bg-primary-base text-white" : "bg-surface-secondary text-gray-400"}
                            `}>
                                <Upload size={36} />
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-gray-700">
                                    {isDragging ? "Lepaskan file di sini" : "Drag & Drop file Excel"}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">atau klik untuk memilih file</p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <FileSpreadsheet size={14} />
                                <span>Format: .xlsx, .xls (Kolom: No.Rekening, Nama Rekening, Saldo)</span>
                            </div>

                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    {isProcessing && (
                        <div className="mt-6 flex items-center justify-center gap-3 text-primary-base">
                            <div className="w-5 h-5 border-2 border-primary-base border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-medium">Memproses file...</span>
                        </div>
                    )}
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-success-base/10 flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-success-base" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Data Berhasil Dibaca</h3>
                                    <p className="text-sm text-gray-500">{fileName}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="default"
                                    onClick={() => setShowPreview(!showPreview)}
                                >
                                    <Eye size={16} className="mr-2" />
                                    {showPreview ? "Sembunyikan" : "Lihat"} Preview
                                </Button>
                                <Button 
                                    variant="default"
                                    onClick={handleReset}
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Reset
                                </Button>
                                <Button 
                                    variant="primary"
                                    onClick={handleSave}
                                >
                                    <Save size={16} className="mr-2" />
                                    Simpan Data
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-surface-secondary rounded-2xl p-4">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Tanggal Data</p>
                                <p className="text-lg font-black text-gray-800 mt-1">{parsedData.tanggal}</p>
                            </div>
                            <div className="bg-surface-secondary rounded-2xl p-4">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total Rekening</p>
                                <p className="text-lg font-black text-gray-800 mt-1">{parsedData.data.length}</p>
                            </div>
                            <div className="bg-surface-secondary rounded-2xl p-4">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total Saldo</p>
                                <p className="text-lg font-black text-gray-800 mt-1">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalSaldo)}
                                </p>
                            </div>
                            <div className="bg-surface-secondary rounded-2xl p-4">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Status</p>
                                <Badge variant="soft" color="success" size="sm" className="mt-1">Siap Disimpan</Badge>
                            </div>
                        </div>
                    </Card>

                    {showPreview && (
                        <Card className="overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-800">Preview Data ({Math.min(parsedData.data.length, 20)} dari {parsedData.data.length})</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-500">
                                        <tr>
                                            <th className="px-4 py-3 text-left">No</th>
                                            <th className="px-4 py-3 text-left">No. Rekening</th>
                                            <th className="px-4 py-3 text-left">Nama Rekening</th>
                                            <th className="px-4 py-3 text-left">Kategori</th>
                                            <th className="px-4 py-3 text-right">Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {parsedData.data.slice(0, 20).map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{item.nomor_rekening}</td>
                                                <td className="px-4 py-3">{item.nama_rekening}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="soft" color={item.kategori === "kasda" ? "primary" : "info"} size="sm">
                                                        {item.kategori}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.saldo)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {parsedData.data.length > 20 && (
                                <div className="p-4 text-center text-sm text-gray-400 border-t">
                                    ... dan {parsedData.data.length - 20} data lainnya
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}