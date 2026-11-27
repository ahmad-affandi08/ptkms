<?php

namespace App\Models;

use App\Models\Concerns\HasLocalized;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/** Legalitas: izin distribusi alkes, sertifikat CDAKB, ISO, dsb. */
class Certificate extends Model implements HasMedia
{
    use HasLocalized, InteractsWithMedia, Listable;

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['title'];

    protected $casts = ['valid_until' => 'date'];

    /** @return array<string, mixed> */
    public function toPublic(): array
    {
        return [
            'title' => $this->tr('title'),
            'number' => $this->number,
            'issuer' => $this->issuer,
            'valid_until' => $this->valid_until?->toDateString(),
            'file' => $this->getFirstMediaUrl('file') ?: null,
        ];
    }
}
