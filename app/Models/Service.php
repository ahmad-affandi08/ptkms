<?php

namespace App\Models;

use App\Models\Concerns\AutoFills;
use App\Models\Concerns\HasImages;
use App\Models\Concerns\HasLocalized;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;

class Service extends Model implements HasMedia
{
    use AutoFills, HasImages, HasLocalized, Listable;

    public const SLUG_FROM = 'title';

    public const EXCERPT_FROM = 'body';

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['title', 'excerpt', 'body', 'seo'];

    /** @return array<string, mixed> */
    public function toPublic(bool $full = false): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->tr('title'),
            'excerpt' => $this->tr('excerpt'),
            'image' => $this->cover(),
            ...$full ? ['body' => $this->tr('body'), 'images' => $this->images()] : [],
        ];
    }
}
