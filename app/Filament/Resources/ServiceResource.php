<?php

namespace App\Filament\Resources;

use App\Filament\Localized;
use App\Filament\Resources\ServiceResource\Pages;
use App\Filament\SeoFields;
use App\Models\Service;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use UnitEnum;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedWrenchScrewdriver;

    protected static string|UnitEnum|null $navigationGroup = 'Konten';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Layanan';

    protected static ?string $pluralModelLabel = 'Layanan';

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Section::make()->columnSpan(2)->schema([
                Localized::tabs(fn ($l, $primary) => [
                    Localized::titleWithSlug('title', $l, $primary),
                    Textarea::make("excerpt.{$l}")->label('Ringkasan')->rows(2)->maxLength(300),
                    RichEditor::make("body.{$l}")->label('Isi'),
                ]),
            ]),
            Section::make()->columnSpan(1)->schema([
                TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord: true),
                Toggle::make('is_published')->label('Tampilkan')->default(true),
                SpatieMediaLibraryFileUpload::make('images')->label('Foto')->collection('images')->multiple()->reorderable()->image()->maxSize(6144),
            ]),
            SeoFields::section(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->reorderable('sort')->defaultSort('sort')
            ->columns([
                SpatieMediaLibraryImageColumn::make('images')->label('')->collection('images')->conversion('thumb')->limit(1),
                Localized::column('title', 'Judul'),
                ToggleColumn::make('is_published')->label('Tampil'),
            ])
            ->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
