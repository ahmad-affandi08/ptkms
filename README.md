# Website PT KMS Indonesia

Situs company profile + katalog alat kesehatan dengan dashboard konten.

- **Publik:** Laravel 13 + Inertia 3 + React 19 + Tailwind 4, dirender di server (SSR). Bahasa Indonesia di `/`, English di `/en`.
- **Dashboard:** Filament 5 di `/admin`. Peran **Admin** (semua akses) dan **Editor** (konten & pesan masuk, tanpa Pengguna/Pengaturan Situs).
- **Gambar:** spatie/laravel-medialibrary, otomatis dibuat versi WebP 800px & 1920px.

## Isi dashboard

| Menu                                                               | Untuk                                                                           |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Inbox › Pesan Masuk                                                | Formulir kontak & permintaan penawaran, status baru/diproses/selesai, tombol WA |
| Konten › Layanan, Produk, Kategori Produk, Proyek, Galeri, Artikel | Konten halaman publik (dua bahasa, SEO per item)                                |
| Perusahaan › Brand & Klien, Testimoni, FAQ, Legalitas              | Kepercayaan: logo prinsipal/klien, izin & sertifikat                            |
| Sistem › Pengaturan Situs                                          | Logo, hero beranda, profil, kontak, WA, sosial media, SEO per halaman           |
| Sistem › Pengguna                                                  | Akun admin/editor                                                               |

## Lokal

```bash
composer install && npm install
cp .env.example .env && php artisan key:generate   # isi DB_* dan ADMIN_EMAIL/ADMIN_PASSWORD
php artisan migrate --seed && php artisan storage:link
composer run dev
```

Test memakai database MySQL `ptkms_test` (lihat `phpunit.xml`): `php artisan test`.

## Deploy ke VPS

Butuh PHP ≥ 8.3 (ext: gd, intl, pdo_mysql, zip, exif), MySQL 8, Node ≥ 22, Nginx.

```bash
composer install --no-dev --optimize-autoloader
npm ci && npm run build:ssr
php artisan migrate --force --seed      # seed sekali di awal: admin + konten dasar
php artisan storage:link
php artisan optimize && php artisan filament:optimize
```

`.env` produksi: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://kmsidn.com`, `MAIL_*` (SMTP untuk notifikasi pesan masuk), opsional `INQUIRY_NOTIFY_EMAIL` dan `TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` (anti-spam Cloudflare).

Proses yang harus selalu jalan (supervisor/systemd):

```ini
[program:kms-ssr]
command=php /var/www/kms/artisan inertia:start-ssr
autorestart=true
user=www-data
```

Setiap deploy: jalankan ulang `npm run build:ssr` lalu `php artisan inertia:stop-ssr` (supervisor menyalakannya lagi dengan bundle baru).

URL lama Hostinger (`/about`, `/services`, `/contact`) sudah di-redirect 301. Setelah domain pindah, kirim `https://kmsidn.com/sitemap.xml` ke Google Search Console.
