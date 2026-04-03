<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bank extends Model
{
    protected $fillable = ['kode_bank', 'nama_bank', 'nama_cabang', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function rekenings(): HasMany
    {
        return $this->hasMany(Rekening::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}