<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\GalleryItem;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Konten awal diambil dari situs lama kmsidn.com. Produk, proyek, klien dan testimoni
 * sengaja dikosongkan: harus diisi owner dengan data asli lewat dashboard.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = config('app.admin');
        if (filled($admin['email']) && filled($admin['password'])) {
            User::updateOrCreate(['email' => $admin['email']], [
                'name' => 'Administrator',
                'password' => $admin['password'],
                'role' => User::ROLE_ADMIN,
                'is_active' => true,
            ]);
        } else {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD kosong di .env, akun admin tidak dibuat.');
        }

        if (! Setting::where('key', 'site')->exists()) {
            Setting::put([
                'company_name' => 'PT Kanda Medical Solutions Indonesia',
                'short_name' => 'PT KMS Indonesia',
                'hero_title' => [
                    'id' => 'Alat kesehatan yang siap pakai, setiap hari.',
                    'en' => 'Medical equipment that is ready, every day.',
                ],
                'hero_subtitle' => [
                    'id' => 'Pengadaan, servis, dan pemeliharaan alat elektromedis untuk rumah sakit dan klinik di Indonesia sejak lebih dari 18 tahun.',
                    'en' => 'Supply, servicing and maintenance of electromedical equipment for hospitals and clinics across Indonesia for over 18 years.',
                ],
                'about_short' => [
                    'id' => 'PT KMS Indonesia memasok dan merawat alat kesehatan untuk fasilitas layanan kesehatan, dengan tim teknisi elektromedis sendiri.',
                    'en' => 'PT KMS Indonesia supplies and maintains medical equipment for healthcare facilities, backed by its own electromedical engineering team.',
                ],
                'about' => [
                    'id' => "PT Kanda Medical Solutions Indonesia bergerak di bidang pengadaan, servis, dan pemeliharaan alat kesehatan. Dengan pengalaman lebih dari 18 tahun, kami membantu rumah sakit dan klinik menjaga peralatannya tetap aman dan siap dipakai.\n\nKami mendukung Electromedical Society dan berkomitmen pada pertumbuhan yang berkelanjutan serta hubungan jangka panjang dengan mitra kami.",
                    'en' => "PT Kanda Medical Solutions Indonesia specialises in medical equipment supply, service and maintenance. With over 18 years of experience, we help hospitals and clinics keep their equipment safe and ready for use.\n\nWe support the Electromedical Society and are committed to sustainable growth and long-term relationships with our partners.",
                ],
                'stats' => [
                    ['value' => '18+', 'label' => ['id' => 'Tahun pengalaman', 'en' => 'Years of experience']],
                ],
                'email' => 'kms.office@kmsidn.com',
                'phone' => '+62 813-1944-2002',
                'whatsapp' => '6281319442002',
                'office_hours' => 'Senin–Jumat, 09.00–17.00 WIB',
                'address' => "Ruko Natura Cattleya Utama No. 0578, Pengasinan,\nGunung Sindur, Kab. Bogor, Jawa Barat 16340",
                'social' => [
                    'instagram' => 'https://www.instagram.com/kms_indonesia.id',
                    'facebook' => 'https://www.facebook.com/profile.php?id=61578731521154',
                    'youtube' => 'https://www.youtube.com/@kmsindonesia',
                    'tokopedia' => 'https://www.tokopedia.com/kms-indonesia',
                    'shopee' => 'https://shopee.co.id/shop/1581646184',
                ],
            ]);
        }

        $services = [
            ['pengadaan-alat-kesehatan', 'Pengadaan Alat Kesehatan', 'Equipment Supply',
                'Alat kesehatan dari prinsipal tepercaya, disesuaikan dengan kebutuhan fasilitas Anda.',
                'Medical equipment from trusted manufacturers, matched to your facility\'s needs.'],
            ['servis-dan-pemeliharaan', 'Servis & Pemeliharaan', 'Service & Maintenance',
                'Perawatan berkala dan perbaikan agar alat bekerja optimal dan umurnya lebih panjang.',
                'Scheduled maintenance and repair to keep devices performing and extend their lifespan.'],
            ['konsultasi-dan-pelatihan', 'Konsultasi & Pelatihan', 'Consultation & Training',
                'Saran teknis sebelum pembelian dan pelatihan penggunaan alat untuk tenaga kesehatan.',
                'Technical advice before purchase and equipment training for healthcare staff.'],
        ];
        foreach ($services as $i => [$slug, $id, $en, $exId, $exEn]) {
            Service::firstOrCreate(['slug' => $slug], [
                'title' => ['id' => $id, 'en' => $en],
                'excerpt' => ['id' => $exId, 'en' => $exEn],
                'sort' => $i,
            ]);
        }

        $faqs = [
            ['Layanan apa saja yang tersedia?', 'Kami melayani penjualan, servis, dan pemeliharaan alat kesehatan untuk fasilitas layanan kesehatan.',
                'What services do you offer?', 'We provide medical equipment sales, service, and maintenance for healthcare facilities.'],
            ['Sudah berapa lama PT KMS beroperasi?', 'Lebih dari 18 tahun di industri alat kesehatan.',
                'How long have you been operating?', 'We have over 18 years of experience in the medical equipment industry.'],
            ['Apakah tersedia pelatihan penggunaan alat?', 'Ya, kami memberikan pelatihan penggunaan alat yang benar untuk tenaga kesehatan.',
                'Do you offer training services?', 'Yes, we provide training for proper equipment usage.'],
            ['Di mana lokasi kantor Anda?', 'Kantor kami berada di Gunung Sindur, Kabupaten Bogor, dan melayani fasilitas kesehatan di Indonesia.',
                'Where are you located?', 'Our office is in Gunung Sindur, Bogor Regency, serving healthcare providers in Indonesia.'],
            ['Bagaimana cara menghubungi tim support?', 'Melalui formulir kontak di situs ini, WhatsApp, atau telepon kantor kami.',
                'How can I contact you for support?', 'Through the contact form on this website, WhatsApp, or our office phone.'],
        ];
        foreach ($faqs as $i => [$qId, $aId, $qEn, $aEn]) {
            Faq::firstOrCreate(['question->id' => $qId], [
                'question' => ['id' => $qId, 'en' => $qEn],
                'answer' => ['id' => $aId, 'en' => $aEn],
                'sort' => $i,
            ]);
        }

        // Foto lapangan dari situs lama kmsidn.com; owner bisa mengganti atau menghapusnya di Galeri.
        if (GalleryItem::count() === 0) {
            $photos = [
                ['perbaikan-mesin-anestesi', 'Perbaikan mesin anestesi', 'Repairing an anaesthesia machine'],
                ['lampu-operasi', 'Penyetelan lampu operasi', 'Adjusting an operating light'],
                ['pelatihan-mesin-anestesi', 'Pengenalan mesin anestesi kepada staf rumah sakit', 'Walking hospital staff through an anaesthesia machine'],
                ['monitor-pasien', 'Pemeriksaan monitor pasien bersama staf rumah sakit', 'Checking a patient monitor with hospital staff'],
                ['servis-mesin-anestesi', 'Pemeriksaan mesin anestesi di kamar operasi', 'Checking an anaesthesia machine in an operating room'],
                ['lampu-operasi-dekat', 'Pemeriksaan lampu operasi', 'Inspecting an operating light'],
                ['pameran', 'Di pameran alat kesehatan', 'At a medical equipment exhibition'],
            ];
            foreach ($photos as $i => [$file, $id, $en]) {
                GalleryItem::create(['caption' => ['id' => $id, 'en' => $en], 'sort' => $i])
                    ->addMedia(public_path("images/field/{$file}.jpg"))
                    ->preservingOriginal()
                    ->toMediaCollection('images');
            }
        }
    }
}
