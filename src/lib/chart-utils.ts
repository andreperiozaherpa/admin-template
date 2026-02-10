import { FinancialSnapshot, FinancialRecord } from "@/types/finance";

interface ComparisonData {
  name: string;
  awal: number;
  akhir: number;
}

export function prepareComparisonData(
  data: FinancialSnapshot[],
  category: keyof FinancialSnapshot,
  nameField: keyof FinancialRecord = "nama_rekening",
): { chartData: ComparisonData[]; periods: { start: string; end: string } } {
  // 1. Validasi Data
  // Jika data kosong atau kurang dari 2 snapshot, kembalikan array kosong
  if (!data || data.length < 2) {
    return { chartData: [], periods: { start: "-", end: "-" } };
  }

  // 2. Tentukan Titik Awal & Akhir
  // Fungsi ini tidak memfilter tanggal lagi, dia "percaya" pada data yang dikirim
  // (yang sudah difilter di page.tsx)
  const firstSnapshot = data[0];
  const lastSnapshot = data[data.length - 1];

  // Pastikan kita mengambil array, jika null/undefined jadikan array kosong
  const firstItems = (firstSnapshot[category] as FinancialRecord[]) || [];
  const lastItems = (lastSnapshot[category] as FinancialRecord[]) || [];

  // --- LOGIC BARU: UNION (PENGGABUNGAN) AKUN ---

  // Gunakan Set untuk menyimpan Nomor Rekening yang Unik (agar tidak duplikat)
  const allAccountNumbers = new Set<string>();

  // Gunakan Map untuk menyimpan Nama Rekening (lookup cepat)
  const accountNames = new Map<string, string>();

  // Helper untuk memproses item dan memasukkan ke Set & Map
  const collectAccounts = (items: FinancialRecord[]) => {
    items.forEach((item) => {
      // Masukkan nomor rekening ke Set (otomatis handle duplikat)
      allAccountNumbers.add(item.nomor_rekening);

      // Simpan nama rekening jika belum ada di Map
      // Kita prioritaskan nama dari data terakhir nanti
      if (!accountNames.has(item.nomor_rekening)) {
        accountNames.set(item.nomor_rekening, item[nameField] as string);
      }
    });
  };

  // 3. Eksekusi Pengumpulan
  // Kita proses lastItems DULUAN agar nama yang dipakai adalah nama terbaru (jika ada perubahan nama)
  collectAccounts(lastItems);
  collectAccounts(firstItems);

  // 4. Mapping Data dari Set Gabungan
  const chartData = Array.from(allAccountNumbers).map((accNumber) => {
    // Cari data saldo di snapshot awal & akhir
    const itemAwal = firstItems.find((i) => i.nomor_rekening === accNumber);
    const itemAkhir = lastItems.find((i) => i.nomor_rekening === accNumber);

    // Ambil nama dan bersihkan
    let rawName = accountNames.get(accNumber) || "Unknown Account";
    const cleanName = rawName.replace(/^[0-9\s]+/, ""); // Regex hapus angka depan

    return {
      name: cleanName,
      // Jika itemAwal undefined (berarti rekening baru), saldonya 0
      awal: itemAwal ? itemAwal.saldo || 0 : 0,
      // Jika itemAkhir undefined (berarti rekening tutup), saldonya 0
      akhir: itemAkhir ? itemAkhir.saldo || 0 : 0,
    };
  });

  // 5. Sorting
  // Urutkan berdasarkan saldo akhir tertinggi.
  // Jika saldo akhir sama, gunakan saldo awal.
  chartData.sort((a, b) => {
    if (b.akhir !== a.akhir) return b.akhir - a.akhir;
    return b.awal - a.awal;
  });

  return {
    chartData,
    periods: {
      start: firstSnapshot.date,
      end: lastSnapshot.date,
    },
  };
}
