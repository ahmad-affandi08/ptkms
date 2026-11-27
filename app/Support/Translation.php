<?php

namespace App\Support;

class Translation
{
    /**
     * Ambil nilai untuk bahasa aktif dari {"id": ..., "en": ...}.
     * Bahasa Indonesia adalah bahasa utama dan jadi cadangan bila terjemahan kosong.
     */
    public static function pick(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        $locale = app()->getLocale();

        return filled($value[$locale] ?? null) ? $value[$locale] : ($value['id'] ?? null);
    }
}
