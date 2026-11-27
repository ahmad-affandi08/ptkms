<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PartnerResource\Pages\ManagePartners;
use App\Models\Partner;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class PartnerResource extends Resource
{
    protected static ?string $model = Partner::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static string|UnitEnum|null $navigationGroup = 'Perusahaan';

    protected static ?string $modelLabel = 'Brand & Klien';

    protected static ?string $pluralModelLabel = 'Brand & Klien';

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(2)->components([
            Select::make('type')->label('Jenis')->options(Partner::TYPES)->required()->default('brand'),
            TextInput::make('name')->label('Nama')->required(),
            TextInput::make('url')->label('Website')->url(),
            Toggle::make('is_published')->label('Tampilkan')->default(true)->inline(false),
            SpatieMediaLibraryFileUpload::make('images')->label('Logo')->collection('images')->image()->maxSize(2048)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->reorderable('sort')->defaultSort('sort')
            ->columns([
                SpatieMediaLibraryImageColumn::make('images')->label('Logo')->collection('images')->conversion('thumb')->limit(1),
                TextColumn::make('name')->label('Nama')->searchable(),
                TextColumn::make('type')->label('Jenis')->badge()->formatStateUsing(fn ($state) => Partner::TYPES[$state] ?? $state),
                ToggleColumn::make('is_published')->label('Tampil'),
            ])
            ->filters([SelectFilter::make('type')->label('Jenis')->options(Partner::TYPES)])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManagePartners::route('/')];
    }
}
