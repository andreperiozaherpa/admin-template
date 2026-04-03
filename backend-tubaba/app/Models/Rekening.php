<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rekening extends Model
{
    protected $fillable = ['nomor_rekening', 'nama_rekening', 'opd_id', 'bank_id', 'jenis_rekening', 'status'];

    public function opd(): BelongsTo
    {
        return $this->belongsTo(OPD::class);
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    public function saldos(): HasMany
    {
        return $this->hasMany(Saldo::class);
    }
}