<?php

namespace App\Filament\Pages;

use App\Filament\Localized;
use App\Models\Setting;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/** @property-read Schema $form */
class SiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Sistem';

    protected static ?string $navigationLabel = 'Pengaturan Situs';

    protected static ?string $title = 'Pengaturan Situs';

    protected static ?int $navigationSort = 1;

    /** Halaman publik yang punya judul & deskripsi SEO sendiri. */
    public const SEO_PAGES = ['home' => 'Beranda', 'about' => 'Tentang', 'services' => 'Layanan', 'products' => 'Produk', 'projects' => 'Proyek', 'gallery' => 'Galeri', 'posts' => 'Artikel', 'contact' => 'Kontak'];

    /** @var array<string, mixed>|null */
    public ?array $data = [];

    public static function canAccess(): bool
    {
        return auth()->user() instanceof User && auth()->user()->isAdmin();
    }

    public function mount(): void
    {
        $this->form->fill(Setting::get());
    }

    public function form(Schema $schema): Schema
    {
        return $schema->statePath('data')->components([
            Section::make('Identitas perusahaan')->columns(2)->schema([
                TextInput::make('company_name')->label('Nama perusahaan')->required(),
                TextInput::make('short_name')->label('Nama singkat')->placeholder('PT KMS Indonesia'),
                FileUpload::make('logo')->label('Logo')->image()->disk('public')->directory('settings')->maxSize(2048),
                FileUpload::make('og_image')->label('Gambar share (WhatsApp/Facebook, 1200×630)')->image()->disk('public')->directory('settings')->maxSize(4096),
                TextInput::make('founded_year')->label('Tahun berdiri')->numeric()->minValue(1950)->maxValue(2100),
            ]),
            Section::make('Hero beranda')->schema([
                FileUpload::make('hero_image')->label('Foto hero')->image()->disk('public')->directory('settings')->maxSize(6144),
                Localized::tabs(fn ($l, $primary) => [
                    TextInput::make("hero_title.{$l}")->label('Judul')->required($primary)->maxLength(120),
                    Textarea::make("hero_subtitle.{$l}")->label('Sub judul')->rows(2)->maxLength(300),
                ]),
            ]),
            Section::make('Tentang perusahaan')->schema([
                Localized::tabs(fn ($l) => [
                    Textarea::make("about_short.{$l}")->label('Ringkasan (beranda & footer)')->rows(3),
                    Textarea::make("about.{$l}")->label('Profil lengkap (halaman Tentang)')->rows(8),
                ]),
                Repeater::make('stats')->label('Angka pencapaian')->columns(3)->maxItems(4)->defaultItems(0)->schema([
                    TextInput::make('value')->label('Angka')->required()->placeholder('18+'),
                    TextInput::make('label.id')->label('Keterangan (ID)')->required()->placeholder('Tahun pengalaman'),
                    TextInput::make('label.en')->label('Keterangan (EN)'),
                ]),
            ]),
            Section::make('Kontak')->columns(2)->schema([
                TextInput::make('email')->email()->required(),
                TextInput::make('phone')->label('Telepon')->tel(),
                TextInput::make('whatsapp')->label('WhatsApp (format 62…)')->regex('/^62\d{8,13}$/')->placeholder('6281319442002'),
                TextInput::make('office_hours')->label('Jam operasional')->placeholder('Senin–Jumat, 09.00–17.00'),
                Textarea::make('address')->label('Alamat')->rows(3)->columnSpanFull(),
                TextInput::make('maps_url')->label('Link Google Maps')->url()->columnSpanFull(),
            ]),
            Section::make('Media sosial & marketplace')->columns(2)->schema([
                TextInput::make('social.instagram')->label('Instagram')->url(),
                TextInput::make('social.facebook')->label('Facebook')->url(),
                TextInput::make('social.youtube')->label('YouTube')->url(),
                TextInput::make('social.linkedin')->label('LinkedIn')->url(),
                TextInput::make('social.tokopedia')->label('Tokopedia')->url(),
                TextInput::make('social.shopee')->label('Shopee')->url(),
            ]),
            Section::make('SEO halaman')->description('Judul & deskripsi yang tampil di Google. Kosongkan untuk memakai default.')->collapsed()->schema(
                collect(self::SEO_PAGES)->map(fn ($label, $page) => Section::make($label)->compact()->schema([
                    Localized::tabs(fn ($l) => [
                        TextInput::make("seo.{$page}.{$l}.title")->label('Judul')->maxLength(70),
                        Textarea::make("seo.{$page}.{$l}.description")->label('Deskripsi')->rows(2)->maxLength(160),
                    ]),
                ]))->values()->all()
            ),
        ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Form::make([EmbeddedSchema::make('form')])
                ->id('form')
                ->livewireSubmitHandler('save')
                ->footer([Actions::make([Action::make('save')->label('Simpan')->submit('save')->keyBindings(['mod+s'])])->sticky()]),
        ]);
    }

    public function save(): void
    {
        Setting::put($this->form->getState());

        Notification::make()->success()->title('Pengaturan tersimpan')->send();
    }
}
