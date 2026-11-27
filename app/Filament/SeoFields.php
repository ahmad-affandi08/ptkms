<?php

namespace App\Filament;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

class SeoFields
{
    public static function section(): Section
    {
        return Section::make('SEO')->description('Kosongkan untuk memakai judul & ringkasan.')->collapsed()->columnSpanFull()->schema([
            Localized::tabs(fn ($l) => [
                TextInput::make("seo.{$l}.title")->label('Judul SEO')->maxLength(70),
                Textarea::make("seo.{$l}.description")->label('Deskripsi SEO')->rows(2)->maxLength(160),
            ]),
        ]);
    }
}
