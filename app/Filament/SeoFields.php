<?php

namespace App\Filament;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

class SeoFields
{
    public static function section(): Section
    {
        return Section::make('Tampilan di Google (opsional)')->description('Sudah terisi otomatis dari judul dan ringkasan. Isi hanya jika ingin teks berbeda di hasil pencarian Google.')->collapsed()->columnSpanFull()->schema([
            Localized::tabs(fn ($l) => [
                TextInput::make("seo.{$l}.title")->label('Judul di Google')->maxLength(70),
                Textarea::make("seo.{$l}.description")->label('Deskripsi di Google')->rows(2)->maxLength(160),
            ]),
        ]);
    }
}
