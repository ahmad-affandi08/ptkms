<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait Listable
{
    public function initializeListable(): void
    {
        $this->mergeCasts(['is_published' => 'boolean']);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_published', true)->orderBy('sort')->orderBy('id');
    }
}
