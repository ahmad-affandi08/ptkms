<?php

namespace App\Filament\Resources;

use App\Filament\Localized;
use App\Filament\Resources\PostResource\Pages;
use App\Filament\SeoFields;
use App\Models\Post;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNewspaper;

    protected static string|UnitEnum|null $navigationGroup = 'Konten';

    protected static ?int $navigationSort = 6;

    protected static ?string $modelLabel = 'Artikel';

    protected static ?string $pluralModelLabel = 'Artikel';

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Section::make()->columnSpan(2)->schema([
                Localized::tabs(fn ($l, $primary) => [
                    Localized::titleWithSlug('title', $l, $primary),
                    Textarea::make("excerpt.{$l}")->label('Ringkasan')->rows(2)->maxLength(300),
                    RichEditor::make("body.{$l}")->label('Isi artikel')->required($primary),
                ]),
            ]),
            Section::make()->columnSpan(1)->schema([
                TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord: true),
                DateTimePicker::make('published_at')->label('Terbit pada')->helperText('Kosongkan untuk menyimpan sebagai draf.'),
                SpatieMediaLibraryFileUpload::make('images')->label('Foto sampul')->collection('images')->image()->imageEditor()->maxSize(6144),
            ]),
            SeoFields::section(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                SpatieMediaLibraryImageColumn::make('images')->label('')->collection('images')->conversion('thumb')->limit(1),
                Localized::column('title', 'Judul'),
                TextColumn::make('published_at')->label('Terbit')->dateTime('d M Y H:i')->placeholder('Draf')->sortable(),
            ])
            ->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
