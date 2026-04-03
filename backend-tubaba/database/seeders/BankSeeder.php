<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bank;

class BankSeeder extends Seeder
{
    public function run(): void
    {
        $banks = [
            ['kode_bank' => '396', 'nama_bank' => 'Bank Lampung', 'nama_cabang' => 'Cab. Tulang Bawang Barat', 'is_active' => true],
            ['kode_bank' => '414', 'nama_bank' => 'Bank BRI', 'nama_cabang' => 'Cab. Tulang Bawang', 'is_active' => true],
            ['kode_bank' => '394', 'nama_bank' => 'Bank BTN', 'nama_cabang' => 'Cab. Menggala', 'is_active' => true],
        ];

        foreach ($banks as $bank) {
            Bank::create($bank);
        }
    }
}