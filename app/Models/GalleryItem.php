<?php

namespace App\Models;

use App\Models\Concerns\HasImages;
use App\Models\Concerns\HasLocalized;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;

class GalleryItem extends Model implements HasMedia
{
    use HasImages, HasLocalized, Listable;

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['caption'];

    /** @return array<string, mixed> */
    public function toPublic(): array
    {
        return ['caption' => $this->tr('caption'), 'image' => $this->cover()];
    }
}
