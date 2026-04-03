<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Saldo extends Model
{
    protected $fillable = ['rekening_id', 'tanggal', 'saldo', 'user_id'];

    protected $casts = [
        'saldo' => 'decimal:2',
        'tanggal' => 'date',
    ];

    public function rekening(): BelongsTo
    {
        return $this->belongsTo(Rekening::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}