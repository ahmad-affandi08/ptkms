<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = ['value' => 'array'];

    protected static function booted(): void
    {
        static::saved(fn (Setting $s) => Cache::forget("settings.{$s->key}"));
    }

    /** @return array<string, mixed> */
    public static function get(string $key = 'site'): array
    {
        return Cache::rememberForever("settings.{$key}", fn () => static::firstWhere('key', $key)->value ?? []);
    }

    /** @param array<string, mixed> $value */
    public static function put(array $value, string $key = 'site'): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
