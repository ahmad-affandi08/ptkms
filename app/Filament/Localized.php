<?php

namespace App\Filament;

use Closure;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

/** Helper form/tabel untuk kolom dua bahasa ({"id": ..., "en": ...}). */
class Localized
{
    public const LOCALES = ['id' => 'Indonesia', 'en' => 'English'];

    /** @param  Closure(string $locale, bool $primary): array<int, Component>  $fields */
    public static function tabs(Closure $fields, ?string $label = null): Tabs
    {
        return Tabs::make($label ?? 'Bahasa')
            ->tabs(collect(self::LOCALES)->map(fn ($name, $locale) => Tab::make($name)->schema($fields($locale, $locale === 'id')))->values()->all())
            ->columnSpanFull();
    }

    /** Field judul yang otomatis mengisi slug saat membuat data baru. */
    public static function titleWithSlug(string $name, string $locale, bool $primary, string $label = 'Judul'): TextInput
    {
        return TextInput::make("{$name}.{$locale}")
            ->label($label)
            ->required($primary)
            ->maxLength(200)
            ->live(onBlur: true)
            ->afterStateUpdated(function (Set $set, ?string $state, string $operation) use ($primary) {
                if ($primary && $operation === 'create') {
                    $set('slug', Str::slug((string) $state));
                }
            });
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
