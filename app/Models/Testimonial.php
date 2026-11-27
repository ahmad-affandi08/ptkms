<?php

namespace App\Models;

use App\Models\Concerns\HasLocalized;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasLocalized, Listable;

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['quote'];

    /** @return array<string, mixed> */
    public function toPublic(): array
    {
        return [
            'name' => $this->name,
            'position' => $this->position,
            'institution' => $this->institution,
            'quote' => $this->tr('quote'),
        ];
    }
}
