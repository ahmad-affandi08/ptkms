<?php

namespace App\Filament\Resources;

use App\Filament\Localized;
use App\Filament\Resources\ProductResource\Pages;
use App\Filament\SeoFields;
use App\Models\Product;
use App\Models\ProductCategory;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use UnitEnum;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCube;

    protected static string|UnitEnum|null $navigationGroup = 'Konten';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'Produk';

    protected static ?string $pluralModelLabel = 'Produk';

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Section::make('Produk')->columnSpan(2)->columns(2)->schema([
                TextInput::make('name')->label('Nama produk')->required()->maxLength(200)->columnSpanFull()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                TextInput::make('model')->label('Tipe / model'),
                TextInput::make('akl_number')->label('No. izin edar (AKL/AKD)'),
                Select::make('product_category_id')->label('Kategori')
                    ->options(fn () => ProductCategory::orderBy('sort')->get()->mapWithKeys(fn (ProductCategory $c) => [$c->id => $c->tr('name')]))
                    ->searchable(),
                Select::make('brand_id')->label('Brand')
                    ->relationship('brand', 'name', fn (Builder $q) => $q->where('type', 'brand'))
                    ->searchable()->preload(),
                Localized::tabs(fn ($l) => [
                    Textarea::make("excerpt.{$l}")->label('Ringkasan')->rows(2)->maxLength(300),
                    RichEditor::make("description.{$l}")->label('Deskripsi'),
                ]),
                Repeater::make('specs')->label('Spesifikasi')->columnSpanFull()->columns(2)->defaultItems(0)->reorderable()
                    ->schema([
                        TextInput::make('label')->label('Parameter')->required()->placeholder('Daya'),
                        TextInput::make('value')->label('Nilai')->required()->placeholder('220V / 50Hz'),
                    ]),
            ]),
            Section::make()->columnSpan(1)->schema([
                TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord: true),
                Toggle::make('is_published')->label('Tampilkan')->default(true),
                Toggle::make('is_featured')->label('Unggulan di beranda'),
                SpatieMediaLibraryFileUpload::make('images')->label('Foto')->collection('images')->multiple()->reorderable()->image()->imageEditor()->maxSize(6144),
                TextInput::make('tokopedia_url')->label('Link Tokopedia')->url(),
                TextInput::make('shopee_url')->label('Link Shopee')->url(),
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
                TextColumn::make('name')->label('Nama')->searchable()->description(fn (Product $r) => $r->model),
                TextColumn::make('category.name')->label('Kategori')->state(fn (Product $r) => $r->category?->tr('name')),
                TextColumn::make('brand.name')->label('Brand'),
                ToggleColumn::make('is_featured')->label('Unggulan'),
                ToggleColumn::make('is_published')->label('Tampil'),
            ])
            ->filters([
                SelectFilter::make('product_category_id')->label('Kategori')
                    ->options(fn () => ProductCategory::orderBy('sort')->get()->mapWithKeys(fn (ProductCategory $c) => [$c->id => $c->tr('name')])),
                SelectFilter::make('brand_id')->label('Brand')->relationship('brand', 'name'),
            ])
            ->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
