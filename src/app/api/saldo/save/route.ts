import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

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

interface FinancialSnapshot {
    date: string;
    kasda: DataRekening[];
    escrow: DataRekening[];
    skpd_pengeluaran: DataRekening[];
    skpd_penerimaan: DataRekening[];
    blud_pasar_puskes: DataRekening[];
    sekolah: DataRekening[];
}

export async function POST(req: NextRequest) {
    try {
        const body: UploadedData = await req.json();
        const { tanggal, data } = body;

        if (!tanggal || !data || data.length === 0) {
            return NextResponse.json(
                { error: "Data tidak valid" },
                { status: 400 }
            );
        }

        const kategoriData: Record<string, DataRekening[]> = {
            kasda: [],
            escrow: [],
            skpd_pengeluaran: [],
            skpd_penerimaan: [],
            blud_pasar_puskes: [],
            sekolah: [],
        };

        for (const item of data) {
            const kategori = item.kategori || "skpd_penerimaan";
            if (kategoriData[kategori]) {
                kategoriData[kategori].push(item);
            } else {
                kategoriData.skpd_penerimaan.push(item);
            }
        }

        const snapshot: FinancialSnapshot = {
            date: tanggal,
            kasda: kategoriData.kasda,
            escrow: kategoriData.escrow,
            skpd_pengeluaran: kategoriData.skpd_pengeluaran,
            skpd_penerimaan: kategoriData.skpd_penerimaan,
            blud_pasar_puskes: kategoriData.blud_pasar_puskes,
            sekolah: kategoriData.sekolah,
        };

        const filePath = path.join(process.cwd(), "public", "uploads", "saldo.json");
        
        let existingData: FinancialSnapshot[] = [];
        
        try {
            const fileContent = await fs.readFile(filePath, "utf-8");
            existingData = JSON.parse(fileContent);
            if (!Array.isArray(existingData)) {
                existingData = [];
            }
        } catch {
            existingData = [];
        }

        const existingIndex = existingData.findIndex(
            (item) => item.date === tanggal
        );

        if (existingIndex >= 0) {
            existingData[existingIndex] = snapshot;
        } else {
            existingData.push(snapshot);
        }

        existingData.sort((a, b) => {
            const [am, ad, ay] = a.date.split("/").map(Number);
            const [bm, bd, by] = b.date.split("/").map(Number);
            return (ay * 10000 + am * 100 + ad) - (by * 10000 + bm * 100 + bd);
        });

        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

        return NextResponse.json({
            message: "Data berhasil disimpan",
            tanggal,
            totalRekening: data.length,
        });
    } catch (error) {
        console.error("Error saving saldo:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}