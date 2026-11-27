<?php

namespace App\Models;

use App\Models\Concerns\HasLocalized;
use App\Models\Concerns\Listable;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasLocalized, Listable;

    protected $guarded = [];

    /** @var list<string> */
    protected array $localized = ['question', 'answer'];

    /** @return array<string, mixed> */
    public function toPublic(): array
    {
        return ['question' => $this->tr('question'), 'answer' => $this->tr('answer')];
    }
}
