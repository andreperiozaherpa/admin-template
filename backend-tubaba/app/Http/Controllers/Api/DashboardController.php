<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Saldo;
use App\Models\Rekening;
use App\Models\Bank;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startDateInput = $request->start_date;
        $endDateInput = $request->end_date;
        
        // Get all available dates from saldos table
        $tanggalList = Saldo::select('tanggal')
            ->distinct()
            ->orderBy('tanggal', 'asc')
            ->pluck('tanggal');
        
        if ($tanggalList->isEmpty()) {
            return response()->json([
                'message' => 'Belum ada data',
                'data' => []
            ]);
        }
        
        // Determine effective date range
        $yearStart = date('Y') . '-01-01';
        $today = date('Y-m-d');
        
        // Find start date
        $startDate = $startDateInput;
        if (!$startDateInput) {
            $startDate = $yearStart;
        }
        
        // Find end date
        $endDate = $endDateInput;
        if (!$endDateInput) {
            $endDate = $today;
        }
        
        // Adjust if start_date data doesn't exist - use earliest available
        if ($tanggalList->min($tanggalList) > $startDate) {
            $startDate = $tanggalList->min();
        }
        
        // Adjust if end_date data doesn't exist - use latest available
        if ($tanggalList->max() < $endDate) {
            $endDate = $tanggalList->max();
        }
        
        // Filter tanggal list to only include dates within range
        $filteredTanggalList = $tanggalList->filter(function ($tanggal) use ($startDate, $endDate) {
            return $tanggal >= $startDate && $tanggal <= $endDate;
        });
        
        // Get ALL rekenings (from Sheet1 + new ones from 396/414/394)
        $allRekenings = Rekening::where('status', 'aktif')->get();
        
        $result = [];
        
        foreach ($filteredTanggalList as $tanggal) {
            $dataByKategori = [
                'kasda' => [],
                'escrow' => [],
                'skpd_pengeluaran' => [],
                'skpd_penerimaan' => [],
                'blud_pasar_puskes' => [],
                'sekolah' => [],
            ];
            
            $no = 1;
            
            // Get saldos for this tanggal (to lookup saldo values)
            $saldosForDate = Saldo::where('tanggal', $tanggal)->get()->keyBy('rekening_id');
            
            // Loop ALL rekenings - this ensures we show ALL norek even with saldo = 0
            foreach ($allRekenings as $rekening) {
                $kategori = $rekening->jenis_rekening;
                
                // Get saldo from saldos table, or 0 if not exists
                $saldoRecord = $saldosForDate->get($rekening->id);
                $saldoValue = $saldoRecord ? (float) $saldoRecord->saldo : 0;
                
                $dataByKategori[$kategori][] = [
                    'no' => $no++,
                    'nomor_rekening' => $rekening->nomor_rekening,
                    'nama_rekening' => $rekening->nama_rekening,
                    'saldo' => $saldoValue,
                ];
            }
            
            // Convert date to ISO format (YYYY-MM-DD) for consistent frontend handling
            $dateFormatted = Carbon::parse($tanggal)->format('Y-m-d');
            
            $result[] = [
                'date' => $dateFormatted,
                'kasda' => $dataByKategori['kasda'],
                'escrow' => $dataByKategori['escrow'],
                'skpd_pengeluaran' => $dataByKategori['skpd_pengeluaran'],
                'skpd_penerimaan' => $dataByKategori['skpd_penerimaan'],
                'blud_pasar_puskes' => $dataByKategori['blud_pasar_puskes'],
                'sekolah' => $dataByKategori['sekolah'],
            ];
        }
        
        return response()->json([
            'data' => $result
        ]);
    }

    public function comparison(Request $request)
    {
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $kategori = $request->kategori ?? 'kasda';

        if (!$startDate || !$endDate) {
            // Get last 30 days by default
            $endDate = Carbon::now()->format('Y-m-d');
            $startDate = Carbon::now()->subDays(30)->format('Y-m-d');
        }

        $saldos = Saldo::with(['rekening'])
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->whereHas('rekening', function ($q) use ($kategori) {
                $q->where('jenis_rekening', $kategori);
            })
            ->get()
            ->groupBy('tanggal')
            ->map(function ($items) {
                return $items->sum('saldo');
            })
            ->sortBy(fn($date) => $date)
            ->toArray();

        $labels = array_keys($saldos);
        $data = array_values($saldos);

        return response()->json([
            'labels' => $labels,
            'data' => $data,
            'start' => $startDate,
            'end' => $endDate,
        ]);
    }

    public function summary()
    {
        $tanggalList = Saldo::select('tanggal')
            ->distinct()
            ->orderBy('tanggal', 'desc')
            ->pluck('tanggal');

        if ($tanggalList->isEmpty()) {
            return response()->json([
                'kasda' => 0,
                'escrow' => 0,
                'skpd' => 0,
                'blud_pasar_puskes' => 0,
                'sekolah' => 0,
                'lastUpdated' => null,
            ]);
        }

        $latestDate = $tanggalList->first();
        
        // Get ALL rekenings (not just those in saldos)
        $allRekenings = Rekening::where('status', 'aktif')->get();
        
        // Get saldos for this date
        $saldosForDate = Saldo::where('tanggal', $latestDate)->get()->keyBy('rekening_id');

        $summary = [
            'kasda' => 0,
            'escrow' => 0,
            'skpd' => 0,
            'blud_pasar_puskes' => 0,
            'sekolah' => 0,
        ];

        // Loop ALL rekenings - include those with saldo = 0
        foreach ($allRekenings as $rekening) {
            $kategori = $rekening->jenis_rekening;
            $saldoRecord = $saldosForDate->get($rekening->id);
            $saldoValue = $saldoRecord ? (float) $saldoRecord->saldo : 0;
            
            if ($kategori === 'skpd_pengeluaran' || $kategori === 'skpd_penerimaan') {
                $summary['skpd'] += $saldoValue;
            } elseif (isset($summary[$kategori])) {
                $summary[$kategori] += $saldoValue;
            }
        }

        $summary['lastUpdated'] = $latestDate;

        return response()->json($summary);
    }

    public function topRekening(Request $request)
    {
        $tanggal = Saldo::max('tanggal');
        $limit = $request->limit ?? 5;
        $jenis = $request->jenis ?? 'kasda';

        $saldos = Saldo::with(['rekening'])
            ->where('tanggal', $tanggal)
            ->whereHas('rekening', function ($q) use ($jenis) {
                $q->where('jenis_rekening', $jenis);
            })
            ->orderByDesc('saldo')
            ->limit($limit)
            ->get();

        return response()->json([
            'tanggal' => $tanggal,
            'data' => $saldos->map(fn($s) => [
                'nomor_rekening' => $s->rekening->nomor_rekening,
                'nama_rekening' => $s->rekening->nama_rekening,
                'saldo' => (float) $s->saldo,
            ])
        ]);
    }

    public function banks()
    {
        $banks = Bank::where('is_active', true)->get(['id', 'kode_bank', 'nama_bank']);
        return response()->json($banks);
    }
}
