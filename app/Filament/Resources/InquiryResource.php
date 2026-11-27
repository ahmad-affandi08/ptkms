<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InquiryResource\Pages\ManageInquiries;
use App\Models\Inquiry;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use UnitEnum;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInboxArrowDown;

    protected static string|UnitEnum|null $navigationGroup = 'Inbox';

    protected static ?string $modelLabel = 'Pesan Masuk';

    protected static ?string $pluralModelLabel = 'Pesan Masuk';

    public static function getNavigationBadge(): ?string
    {
        $new = Inquiry::where('status', 'new')->count();

        return $new ? (string) $new : null;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        // Isi pesan dari pengunjung hanya dibaca; admin mengubah status & catatan internal.
        return $schema->columns(2)->components([
            TextInput::make('name')->label('Nama')->disabled(),
            TextInput::make('institution')->label('Instansi')->disabled(),
            TextInput::make('email')->disabled(),
            TextInput::make('phone')->label('Telepon / WA')->disabled(),
            Select::make('topic')->label('Keperluan')->options(Inquiry::TOPICS)->disabled(),
            Select::make('product_id')->label('Produk')->relationship('product', 'name')->disabled(),
            Textarea::make('message')->label('Pesan')->rows(5)->disabled()->columnSpanFull(),
            Select::make('status')->options(Inquiry::STATUSES)->required(),
            Textarea::make('notes')->label('Catatan internal')->rows(3)->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')->label('Masuk')->since()->sortable(),
                TextColumn::make('name')->label('Nama')->searchable()->description(fn (Inquiry $r) => $r->institution),
                TextColumn::make('topic')->label('Keperluan')->formatStateUsing(fn ($state) => Inquiry::TOPICS[$state] ?? $state),
                TextColumn::make('product.name')->label('Produk')->toggleable(),
                TextColumn::make('phone')->label('WA')->url(fn (Inquiry $r) => $r->phone ? 'https://wa.me/'.preg_replace('/^0/', '62', preg_replace('/\D/', '', $r->phone)) : null, true),
                TextColumn::make('email')->searchable()->toggleable(),
                TextColumn::make('status')->badge()
                    ->formatStateUsing(fn ($state) => Inquiry::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => ['new' => 'danger', 'in_progress' => 'warning', 'done' => 'success'][$state] ?? 'gray'),
            ])
            ->filters([SelectFilter::make('status')->options(Inquiry::STATUSES)])
            ->recordActions([EditAction::make()->label('Buka'), DeleteAction::make()])
            ->toolbarActions([DeleteBulkAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageInquiries::route('/')];
    }
}
