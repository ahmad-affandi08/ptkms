<?php

namespace App\Models\Concerns;

use App\Support\Translation;

/** Kolom di $localized disimpan sebagai {"id": "...", "en": "..."}. */
trait HasLocalized
{
    public function initializeHasLocalized(): void
    {
        $this->mergeCasts(array_fill_keys($this->localized, 'array'));
    }

    public function tr(string $attribute): mixed
    {
        return Translation::pick($this->getAttribute($attribute));
    }
}
