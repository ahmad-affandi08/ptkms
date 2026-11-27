<?php

namespace App\Models;

use App\Models\Concerns\HasImages;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;

/** Brand yang didistribusikan (type=brand) atau klien/rumah sakit (type=client). */
class Partner extends Model implements HasMedia
{
    use HasImages, Listable;

    public const TYPES = ['brand' => 'Brand / Prinsipal', 'client' => 'Klien'];

    protected $guarded = [];

    /** @return array<string, mixed> */
    public function toPublic(): array
    {
        return ['name' => $this->name, 'url' => $this->url, 'logo' => $this->cover()];
    }
}
