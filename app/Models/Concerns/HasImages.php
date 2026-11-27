<?php

namespace App\Models\Concerns;

use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HasImages
{
    use InteractsWithMedia;

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')->performOnCollections('images')->fit(Fit::Max, 800, 800)->format('webp');
        $this->addMediaConversion('large')->performOnCollections('images')->fit(Fit::Max, 1920, 1920)->format('webp');
    }

    /** @return list<array{thumb: string, large: string, alt: string}> */
    public function images(): array
    {
        return array_values($this->getMedia('images')->map(fn (Media $m) => [
            'thumb' => $m->getAvailableUrl(['thumb']),
            'large' => $m->getAvailableUrl(['large']),
            'alt' => (string) $m->getCustomProperty('alt', ''),
        ])->all());
    }

    /** @return array{thumb: string, large: string, alt: string}|null */
    public function cover(): ?array
    {
        return $this->images()[0] ?? null;
    }
}
