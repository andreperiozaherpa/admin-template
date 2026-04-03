<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rekenings', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_rekening', 50)->unique();
            $table->string('nama_rekening');
            $table->unsignedBigInteger('opd_id')->nullable();
            $table->unsignedBigInteger('bank_id')->nullable();
            $table->enum('jenis_rekening', ['kasda', 'escrow', 'skpd_pengeluaran', 'skpd_penerimaan', 'blud_pasar_puskes', 'sekolah'])->default('kasda');
            $table->enum('status', ['aktif', 'tutup'])->default('aktif');
            $table->timestamps();
            
            $table->index('jenis_rekening');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekenings');
    }
};
