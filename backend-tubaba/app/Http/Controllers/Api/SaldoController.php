<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rekening;
use App\Models\Saldo;
use App\Models\Bank;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;

class SaldoController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');

        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheetNames = $spreadsheet->getSheetNames();

            $totalRekening = 0;
            $totalSaldo = 0;
            $tanggal = null;

            // ===== STEP 1: Load Sheet1 → Save ALL to table `rekenings` (REFERENSI UTAMA) =====
            // Semua norek dari Sheet1 disimpan sebagai referensi utama
            if (in_array('Sheet1', $sheetNames)) {
                $sheet1 = $spreadsheet->getSheetByName('Sheet1');
                $data1 = $sheet1->toArray();

                for ($i = 3; $i < count($data1); $i++) {
                    $row = $data1[$i];
                    if (empty($row[2])) continue;

                    $nomor = trim($row[2]);
                    $nama = isset($row[1]) ? trim($row[1]) : '';

                    if (str_starts_with($nomor, '===')) continue;

                    // Deteksi kategori dari nama Sheet1
                    $jenisRekening = $this->determineJenisRekening($nama);

                    // Simpan ke rekenings (referensi utama)
                    $rekening = Rekening::firstOrCreate(
                        ['nomor_rekening' => $nomor],
                        [
                            'nama_rekening' => $nama,
                            'jenis_rekening' => $jenisRekening,
                            'status' => 'aktif',
                        ]
                    );

                    $totalRekening++;
                }
            }

            // ===== STEP 2: Load ESCROW + 396 + 414 + 394 → Collect to array =====
            $allDataRows = [];

            $sheetsToProcess = ['ESCROW', '396', '414', '394'];
            
            foreach ($sheetsToProcess as $sheetName) {
                if (!in_array($sheetName, $sheetNames)) {
                    continue;
                }

                $sheet = $spreadsheet->getSheetByName($sheetName);
                $data = $sheet->toArray();

                // Ambil tanggal dari sheet pertama yang memiliki data tanggal
                // Format di spreadsheet: "TGL: 02/03/2026" = 2 Maret 2026 (dd/mm/yyyy)
                if ($tanggal === null && isset($data[0][3]) && strpos($data[0][3], 'TGL:') !== false) {
                    $tglStr = str_replace('TGL: ', '', $data[0][3]);
                    // Parse format dd/mm/yyyy (Indonesia) → Y-m-d (ISO)
                    $tanggal = \Carbon\Carbon::createFromFormat('d/m/Y', $tglStr)->format('Y-m-d');
                }

                for ($i = 4; $i < count($data); $i++) {
                    $row = $data[$i];
                    if (empty($row[1]) || empty($row[2])) continue;

                    $nomorRekening = trim($row[1]);
                    if (str_starts_with($nomorRekening, '===')) continue;

                    $namaRekening = trim($row[2]);
                    $saldo = isset($row[3]) ? (float) str_replace([',', ' '], '', trim($row[3])) : 0;

                    $allDataRows[] = [
                        'nomor' => $nomorRekening,
                        'nama' => $namaRekening,
                        'saldo' => $saldo,
                        'sheet' => $sheetName,
                    ];
                }
            }

            $tanggal = $tanggal ?? $request->tanggal ?? now()->format('Y-m-d');

            // ===== STEP 3: Proses Each Norek =====
            $processedNorek = [];

            foreach ($allDataRows as $row) {
                $nomorRekening = $row['nomor'];
                $namaRekening = $row['nama'];
                $saldo = $row['saldo'];
                $cleanNorek = str_replace(['.', ',', ' '], '', $nomorRekening);

                // Skip jika norek sudah diproses
                if (isset($processedNorek[$cleanNorek])) {
                    continue;
                }

                // Cek apakah norek sudah ada di rekenings (dari Sheet1)
                $rekening = Rekening::where('nomor_rekening', $nomorRekening)->first();

                if ($rekening) {
                    // === NOREK SUDAH ADA (dari Sheet1) ===
                    // Jangan update nama dan jenis - tetap gunakan dari Sheet1
                    // Hanya simpan saldo
                } else {
                    // === NOREK BARU (tidak ada di Sheet1) ===
                    // Buat rekening baru dengan nama dari sheet data
                    $jenisRekening = $this->determineJenisRekening($namaRekening);
                    
                    $rekening = Rekening::create([
                        'nomor_rekening' => $nomorRekening,
                        'nama_rekening' => $namaRekening,
                        'jenis_rekening' => $jenisRekening,
                        'status' => 'aktif',
                    ]);
                    $totalRekening++;
                }

                $processedNorek[$cleanNorek] = true;

                // Simpan data saldo ke tabel saldos
                Saldo::updateOrCreate(
                    ['rekening_id' => $rekening->id, 'tanggal' => $tanggal],
                    ['saldo' => $saldo, 'user_id' => $request->user()->id]
                );

                $totalSaldo += $saldo;
            }

            return response()->json([
                'message' => 'Data berhasil diupload',
                'data' => [
                    'tanggal' => $tanggal,
                    'total_rekening' => $totalRekening,
                    'total_saldo' => $totalSaldo,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memproses file: ' . $e->getMessage()
            ], 500);
        }
    }

    private function determineJenisRekening(string $nama = ''): string
    {
        // Normalisasi nama: hapus multiple spasi, ubah ke lowercase
        $namaNormalized = preg_replace('/\s+/', ' ', trim($nama));
        $namaLower = strtolower($namaNormalized);

        // 1. KASDA
        if (str_contains($namaLower, 'rkud') || str_contains($namaLower, 'operasional kab')) {
            return 'kasda';
        }

        // 2. ESCROW
        if (str_contains($namaLower, 'titipan')) {
            return 'escrow';
        }

        // 3. BLUD_PASAR_PUSKES (SEBELUM SEKOLAH - mencegah "puskesmas" terdeteksi sebagai "sma")
        if (
            str_contains($namaLower, 'puskes') ||
            str_contains($namaLower, 'puskesmas') ||
            str_contains($namaLower, 'blud') ||
            str_contains($namaLower, 'pasar')
        ) {
            return 'blud_pasar_puskes';
        }

        // 4. SEKOLAH
        if (
            str_contains($namaLower, 'sdn') ||
            str_contains($namaLower, 'smp') ||
            str_contains($namaLower, 'sma') ||
            str_contains($namaLower, 'sekolah') ||
            str_contains($namaLower, 'upt sdn')
        ) {
            return 'sekolah';
        }

        // 5. SKPD_PENERIMAAN
        if (
            str_contains($namaLower, 'penerimaan') ||
            str_contains($namaLower, 'penampungan') ||
            str_contains($namaLower, 'retribusi') ||
            str_contains($namaLower, 'pbb') ||
            str_contains($namaLower, 'opsen') ||
            str_contains($namaLower, 'pajak')
        ) {
            return 'skpd_penerimaan';
        }

        // 6. SKPD_PENGELUARAN (Default)
        return 'skpd_pengeluaran';
    }

    public function index(Request $request)
    {
        $tanggal = $request->tanggal;
        $jenis = $request->jenis;
        $bankId = $request->bank_id;
        $opdId = $request->opd_id;
        
        // Get all available dates
        $tanggalList = Saldo::select('tanggal')
            ->distinct()
            ->orderBy('tanggal', 'desc')
            ->pluck('tanggal');
        
        if ($tanggalList->isEmpty()) {
            return response()->json([
                'message' => 'Belum ada data saldo',
                'data' => []
            ]);
        }
        
        // If no specific tanggal requested, return all dates with summary
        if (!$tanggal) {
            $result = [];
            
            foreach ($tanggalList as $tgl) {
                $query = Saldo::with(['rekening.bank', 'rekening.opd'])
                    ->where('tanggal', $tgl);
                
                $saldos = $query->get();
                
                // Calculate summary per date
                $summary = [
                    'kasda' => 0,
                    'escrow' => 0,
                    'skpd_pengeluaran' => 0,
                    'skpd_penerimaan' => 0,
                    'blud_pasar_puskes' => 0,
                    'sekolah' => 0,
                    'total' => 0,
                ];
                
                $totalRekening = 0;
                
                foreach ($saldos as $saldo) {
                    $jenisRekening = $saldo->rekening->jenis_rekening;
                    if (isset($summary[$jenisRekening])) {
                        $summary[$jenisRekening] += (float) $saldo->saldo;
                    }
                    $summary['total'] += (float) $saldo->saldo;
                    $totalRekening++;
                }
                
                $result[] = [
                    'tanggal' => $tgl,
                    'total_rekening' => $totalRekening,
                    'summary' => $summary,
                ];
            }
            
            return response()->json([
                'data' => $result,
                'meta' => [
                    'total_dates' => $tanggalList->count(),
                ]
            ]);
        }
        
        // If specific tanggal requested, return ALL rekenings (including those without saldo)
        $search = $request->search;
        
        // Start from rekenings table - get ALL rekening
        $query = Rekening::with(['bank', 'opd'])
            ->when($jenis, function ($q) use ($jenis) {
                $q->where('jenis_rekening', $jenis);
            })
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('nomor_rekening', 'like', "%{$search}%")
                       ->orWhere('nama_rekening', 'like', "%{$search}%");
                });
            })
            ->when($bankId, function ($q) use ($bankId) {
                $q->where('bank_id', $bankId);
            })
            ->when($opdId, function ($q) use ($opdId) {
                $q->where('opd_id', $opdId);
            });

        $rekenings = $query->orderBy('nama_rekening', 'asc')->get();

        // Get saldo data for this tanggal
        $saldos = Saldo::where('tanggal', $tanggal)->get()->keyBy('rekening_id');

        // Merge saldo data into rekenings
        $result = $rekenings->map(function ($rekening) use ($saldos) {
            $saldo = $saldos->get($rekening->id);
            return [
                'id' => $rekening->id,
                'rekening' => [
                    'id' => $rekening->id,
                    'nomor_rekening' => $rekening->nomor_rekening,
                    'nama_rekening' => $rekening->nama_rekening,
                    'jenis_rekening' => $rekening->jenis_rekening,
                    'status' => $rekening->status,
                ],
                'saldo' => $saldo ? $saldo->saldo : 0,
                'tanggal' => $saldo ? $saldo->tanggal : null,
            ];
        });

        return response()->json([
            'data' => $result
        ]);
    }

    public function latest()
    {
        $latestDate = Saldo::max('tanggal');

        if (!$latestDate) {
            return response()->json([
                'message' => 'Belum ada data saldo',
                'data' => []
            ]);
        }

        $saldos = Saldo::with(['rekening.bank', 'rekening.opd'])
            ->where('tanggal', $latestDate)
            ->get()
            ->groupBy('rekening.jenis_rekening');

        $result = [];
        foreach ($saldos as $jenis => $items) {
            $result[$jenis] = $items->map(function ($saldo) {
                return [
                    'id' => $saldo->rekening->id,
                    'nomor_rekening' => $saldo->rekening->nomor_rekening,
                    'nama_rekening' => $saldo->rekening->nama_rekening,
                    'saldo' => $saldo->saldo,
                    'bank' => $saldo->rekening->bank?->nama_bank,
                ];
            });
        }

        return response()->json([
            'tanggal' => $latestDate,
            'data' => $result
        ]);
    }

    public function summary()
    {
        $latestDate = Saldo::max('tanggal');

        if (!$latestDate) {
            return response()->json([
                'message' => 'Belum ada data saldo',
                'data' => []
            ]);
        }

        $saldos = Saldo::where('tanggal', $latestDate)->get();

        $summary = [
            'kasda' => 0,
            'escrow' => 0,
            'skpd_pengeluaran' => 0,
            'skpd_penerimaan' => 0,
            'blud_pasar_puskes' => 0,
            'sekolah' => 0,
            'total' => 0,
        ];

        foreach ($saldos as $saldo) {
            $jenis = $saldo->rekening->jenis_rekening;

            if (isset($summary[$jenis])) {
                $summary[$jenis] += $saldo->saldo;
            }
            $summary['total'] += $saldo->saldo;
        }

        return response()->json([
            'tanggal' => $latestDate,
            'summary' => $summary
        ]);
    }

    public function history(Request $request)
    {
        $rekeningId = $request->rekening_id;

        $saldos = Saldo::where('rekening_id', $rekeningId)
            ->orderBy('tanggal', 'asc')
            ->get();

        return response()->json([
            'data' => $saldos
        ]);
    }

    public function destroyByDate(Request $request)
    {
        $tanggal = $request->tanggal;

        if (!$tanggal) {
            return response()->json([
                'message' => 'Tanggal diperlukan'
            ], 422);
        }

        $deleted = Saldo::where('tanggal', $tanggal)->delete();

        return response()->json([
            'message' => "Data saldo berhasil dihapus ({$deleted} record)",
            'deleted_count' => $deleted
        ]);
    }
}
