<?php

namespace App\Models;

use App\Models\Concerns\AutoFills;
use App\Models\Concerns\HasLocalized;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends Model
{
    use AutoFills, HasLocalized;

    public const SLUG_FROM = 'name';

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['name'];

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** @return array<string, mixed> */
    public function toPublic(): array
    {
        return ['slug' => $this->slug, 'name' => $this->tr('name')];
    }
}
