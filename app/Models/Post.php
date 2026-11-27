<?php

namespace App\Models;

use App\Models\Concerns\HasImages;
use App\Models\Concerns\HasLocalized;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;

class Post extends Model implements HasMedia
{
    use HasImages, HasLocalized;

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['title', 'excerpt', 'body', 'seo'];

    protected $casts = ['published_at' => 'datetime'];

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now())->latest('published_at');
    }

    /** @return array<string, mixed> */
    public function toPublic(bool $full = false): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->tr('title'),
            'excerpt' => $this->tr('excerpt'),
            'published_at' => $this->published_at?->toDateString(),
            'image' => $this->cover(),
            ...$full ? ['body' => $this->tr('body')] : [],
        ];
    }
}
