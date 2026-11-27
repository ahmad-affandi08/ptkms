<?php

namespace App\Models;

use App\Models\Concerns\AutoFills;
use App\Models\Concerns\HasImages;
use App\Models\Concerns\HasLocalized;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;

class Product extends Model implements HasMedia
{
    use AutoFills, HasImages, HasLocalized, Listable;

    public const SLUG_FROM = 'name';

    public const EXCERPT_FROM = 'description';

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['excerpt', 'description', 'seo'];

    public const TYPES = ['device' => 'Alat kesehatan', 'software' => 'Software'];

    protected $casts = ['specs' => 'array', 'is_featured' => 'boolean'];

    /** @return BelongsTo<ProductCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /** @return BelongsTo<Partner, $this> */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'brand_id');
    }

    /** @return array<string, mixed> */
    public function toPublic(bool $full = false): array
    {
        return [
            'slug' => $this->slug,
            'type' => $this->type,
            'name' => $this->name,
            'model' => $this->model,
            'excerpt' => $this->tr('excerpt'),
            'category' => $this->category?->toPublic(),
            'brand' => $this->brand?->name,
            'image' => $this->cover(),
            ...$full ? [
                'description' => $this->tr('description'),
                'akl_number' => $this->akl_number,
                'specs' => $this->specs ?? [],
                'images' => $this->images(),
                'tokopedia_url' => $this->tokopedia_url,
                'shopee_url' => $this->shopee_url,
                'demo_url' => $this->demo_url,
            ] : [],
        ];
    }
}
