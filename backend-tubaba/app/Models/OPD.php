<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OPD extends Model
{
    protected $fillable = ['kode_opd', 'nama_opd', 'nama_singkat', 'alamat', 'telepon', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function rekenings(): HasMany
    {
        return $this->hasMany(Rekening::class);
    }
}