<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    public const STATUSES = ['new' => 'Baru', 'in_progress' => 'Diproses', 'done' => 'Selesai'];

    public const TOPICS = ['quotation' => 'Permintaan penawaran', 'service' => 'Servis / perbaikan', 'consultation' => 'Konsultasi', 'other' => 'Lainnya'];

    protected $fillable = ['product_id', 'name', 'institution', 'email', 'phone', 'topic', 'message', 'status', 'notes', 'ip'];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
