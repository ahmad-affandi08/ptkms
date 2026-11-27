<?php

namespace App\Filament;

use Closure;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Text;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

/** Helper form/tabel untuk kolom dua bahasa ({"id": ..., "en": ...}). */
class Localized
{
    public const LOCALES = ['id' => 'Indonesia', 'en' => 'English'];

    /** @param  Closure(string $locale, bool $primary): array<int, Component>  $fields */
    public static function tabs(Closure $fields, ?string $label = null): Tabs
    {
        return Tabs::make($label ?? 'Bahasa')
            ->tabs(collect(self::LOCALES)->map(fn ($name, $locale) => Tab::make($name)->schema([
                ...($locale === 'id' ? [] : [Text::make('Boleh dikosongkan. Bagian yang kosong otomatis memakai teks bahasa Indonesia.')]),
                ...$fields($locale, $locale === 'id'),
            ]))->values()->all())
            ->columnSpanFull();
    }

    /** Field judul/nama; wajib di bahasa Indonesia. Alamat halaman (slug) dibuat otomatis oleh model. */
    public static function title(string $name, string $locale, bool $primary, string $label = 'Judul'): TextInput
    {
        return TextInput::make("{$name}.{$locale}")->label($label)->required($primary)->maxLength(200);
    }

    /** Ringkasan opsional; jika kosong diambil otomatis dari isi. */
    public static function excerpt(string $locale): Textarea
    {
        return Textarea::make("excerpt.{$locale}")->label('Ringkasan')->rows(2)->maxLength(300)
            ->helperText('Boleh dikosongkan, akan diambil otomatis dari kalimat awal isi.');
    }

    /** Link ke halaman publik data ini, hanya di halaman edit. */
    public static function publicLink(string $path): TextEntry
    {
        return TextEntry::make('slug')->label('Alamat di situs')
            ->state(fn ($record) => url("{$path}/{$record->slug}"))
            ->url(fn ($record) => url("{$path}/{$record->slug}"), shouldOpenInNewTab: true)
            ->color('primary')
            ->helperText('Dibuat otomatis dari judul. Bisa dibuka jika "Tampilkan" aktif.')
            ->visibleOn('edit');
    }

    public static function column(string $name, string $label): TextColumn
    {
        return TextColumn::make($name)
            ->label($label)
            ->state(fn ($record) => $record->tr($name))
            ->searchable(query: fn (Builder $query, string $search) => $query->where($name, 'like', "%{$search}%"))
            ->limit(60);
    }
}
