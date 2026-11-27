<?php

namespace App\Filament\Resources;

use App\Filament\Localized;
use App\Filament\Resources\CertificateResource\Pages\ManageCertificates;
use App\Models\Certificate;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use UnitEnum;

class CertificateResource extends Resource
{
    protected static ?string $model = Certificate::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Perusahaan';

    protected static ?string $modelLabel = 'Legalitas';

    protected static ?string $pluralModelLabel = 'Legalitas & Sertifikat';

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Localized::tabs(fn ($l, $primary) => [
                TextInput::make("title.{$l}")->label('Nama dokumen')->required($primary)->placeholder('Izin Distribusi Alat Kesehatan (IDAK)'),
            ]),
            TextInput::make('number')->label('Nomor'),
            TextInput::make('issuer')->label('Penerbit')->placeholder('Kementerian Kesehatan RI'),
            DatePicker::make('valid_until')->label('Berlaku sampai'),
            SpatieMediaLibraryFileUpload::make('file')->label('File (PDF/gambar, opsional)')->collection('file')
                ->acceptedFileTypes(['application/pdf', 'image/*'])->maxSize(10240)->columnSpanFull(),
            Toggle::make('is_published')->label('Tampilkan')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->reorderable('sort')->defaultSort('sort')
            ->columns([
                Localized::column('title', 'Dokumen'),
                TextColumn::make('number')->label('Nomor'),
                TextColumn::make('valid_until')->label('Berlaku s.d.')->date('d M Y')
                    ->color(fn ($state) => $state && $state->isPast() ? 'danger' : null),
                ToggleColumn::make('is_published')->label('Tampil'),
            ])
            ->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageCertificates::route('/')];
    }
}
