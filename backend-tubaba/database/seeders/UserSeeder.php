<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Bank;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $bankLampung = Bank::where('kode_bank', '396')->first();

        $users = [
            [
                'name' => 'Administrator',
                'email' => 'admin@tubaba.go.id',
                'password' => 'admin123',
                'nip' => '1234567890',
                'role' => 'admin',
            ],
            [
                'name' => 'Operator Bank Lampung',
                'email' => 'bank@tubaba.go.id',
                'password' => 'bank123',
                'nip' => '0987654321',
                'role' => 'bank',
                'bank_id' => $bankLampung?->id,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}