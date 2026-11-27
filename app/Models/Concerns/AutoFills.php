<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * Isi otomatis kolom teknis saat menyimpan, supaya pengguna dashboard tidak perlu mengisinya:
 * - slug dari SLUG_FROM (judul/nama bahasa Indonesia), unik, dan tidak berubah setelah dibuat agar link lama tetap jalan;
 * - ringkasan per bahasa dari EXCERPT_FROM (isi/deskripsi) jika dikosongkan.
 */
trait AutoFills
{
    public static function bootAutoFills(): void
    {
        static::saving(function (self $model) {
            $model->fillSlug();
            $model->fillExcerpt();
        });
    }

    protected function fillSlug(): void
    {
        if (! defined(static::class.'::SLUG_FROM') || filled($this->getAttribute('slug'))) {
            return;
        }

        $source = $this->getAttribute(constant(static::class.'::SLUG_FROM'));
        $text = is_array($source) ? ($source['id'] ?? reset($source)) : $source;
        $base = Str::slug((string) $text) ?: Str::slug(class_basename($this));

        $slug = $base;
        for ($i = 2; static::query()->where('slug', $slug)->whereKeyNot($this->getKey())->exists(); $i++) {
            $slug = "{$base}-{$i}";
        }

        $this->setAttribute('slug', $slug);
    }

    protected function fillExcerpt(): void
    {
        if (! defined(static::class.'::EXCERPT_FROM')) {
            return;
        }

        $excerpt = (array) ($this->getAttribute('excerpt') ?? []);
        $body = (array) ($this->getAttribute(constant(static::class.'::EXCERPT_FROM')) ?? []);

        foreach ($body as $locale => $html) {
            if (blank($excerpt[$locale] ?? null) && filled($html)) {
                // Akhir paragraf/baris jadi spasi supaya kalimat antarblok tidak menempel.
                $text = html_entity_decode(strip_tags((string) preg_replace('#</(p|li|h[1-6]|div|blockquote)>|<br\s*/?>#i', ' ', (string) $html)));
                $excerpt[$locale] = Str::limit(trim((string) preg_replace('/\s+/u', ' ', $text)), 200);
            }
        }

        $this->setAttribute('excerpt', $excerpt ?: null);
    }
}
