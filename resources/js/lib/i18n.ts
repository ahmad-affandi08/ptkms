import { usePage } from '@inertiajs/react';
import { localePath } from '@/lib/utils';

const en = {
    Beranda: 'Home',
    Tentang: 'About',
    Layanan: 'Services',
    Produk: 'Products',
    Proyek: 'Projects',
    Galeri: 'Gallery',
    Artikel: 'Articles',
    Kontak: 'Contact',
    'Minta penawaran': 'Request a quote',
    'Lihat katalog': 'Browse catalogue',
    Menu: 'Menu',
    'Tutup menu': 'Close menu',
    'Ganti ke bahasa Inggris': 'Switch to Indonesian',
    'Chat WhatsApp': 'Chat on WhatsApp',
    'Yang kami kerjakan': 'What we do',
    'Dari pengadaan sampai perawatan rutin, satu tim yang sama menangani alat Anda.':
        'From procurement to routine maintenance, the same team looks after your equipment.',
    Selengkapnya: 'Read more',
    'Produk unggulan': 'Featured products',
    'Semua produk': 'All products',
    'Brand yang kami tangani': 'Brands we handle',
    'Dipercaya oleh': 'Trusted by',
    'Proyek terbaru': 'Recent projects',
    'Semua proyek': 'All projects',
    'Kata mereka': 'What clients say',
    'Alat butuh servis, atau sedang menyiapkan pengadaan?':
        'Equipment due for service, or planning a purchase?',
    'Ceritakan kebutuhan Anda. Tim kami membalas pada jam kerja.':
        'Tell us what you need. Our team replies during office hours.',
    'Isi formulir': 'Fill in the form',
    Kategori: 'Category',
    'Semua kategori': 'All categories',
    'Cari nama, tipe, atau brand': 'Search name, model or brand',
    Cari: 'Search',
    produk: 'products',
    'Belum ada produk yang cocok. Coba kata kunci lain atau hubungi kami, kami bantu carikan.':
        'No matching products yet. Try another keyword or contact us and we will help you find it.',
    'Tanyakan produk ini': 'Ask about this product',
    'Beli di Tokopedia': 'Buy on Tokopedia',
    'Beli di Shopee': 'Buy on Shopee',
    Spesifikasi: 'Specifications',
    'No. izin edar': 'Registration no.',
    Brand: 'Brand',
    Tipe: 'Model',
    'Produk terkait': 'Related products',
    Halaman: 'Page',
    dari: 'of',
    Sebelumnya: 'Previous',
    Berikutnya: 'Next',
    Klien: 'Client',
    Lokasi: 'Location',
    Tahun: 'Year',
    'Profil perusahaan': 'Company profile',
    'Legalitas & sertifikat': 'Licences & certificates',
    'Berlaku sampai': 'Valid until',
    'Lihat dokumen': 'View document',
    'Pertanyaan umum': 'Frequently asked questions',
    'Layanan lain': 'Other services',
    'Hubungi kami': 'Contact us',
    'Kirim pesan dan kami balas pada jam kerja, atau langsung chat lewat WhatsApp.':
        'Send a message and we will reply during office hours, or chat with us directly on WhatsApp.',
    Alamat: 'Address',
    'Jam operasional': 'Office hours',
    Telepon: 'Phone',
    'Buka di Google Maps': 'Open in Google Maps',
    Nama: 'Name',
    'Instansi / rumah sakit': 'Institution / hospital',
    'Nomor HP / WhatsApp': 'Mobile / WhatsApp number',
    Keperluan: 'Purpose',
    Pesan: 'Message',
    'Kirim pesan': 'Send message',
    'Mengirim…': 'Sending…',
    'Permintaan penawaran': 'Quotation request',
    'Servis / perbaikan': 'Service / repair',
    Konsultasi: 'Consultation',
    Lainnya: 'Other',
    'Produk yang ditanyakan': 'Product in question',
    'Sebutkan merek, tipe alat, jumlah, atau kendala yang dialami.':
        'Mention the brand, model, quantity, or the problem you are having.',
    'Belum ada artikel.': 'No articles yet.',
    'Belum ada foto.': 'No photos yet.',
    'Belum ada proyek yang dipublikasikan.': 'No published projects yet.',
    'Ikuti kami': 'Follow us',
    'Belanja online': 'Shop online',
    'Semua hak dilindungi.': 'All rights reserved.',
    Pengalaman: 'Experience',
    'Langsung ke konten': 'Skip to content',
} as const;

export type TranslationKey = keyof typeof en;

/** Teks antarmuka. Kunci = teks Bahasa Indonesia; konten dari dashboard sudah diterjemahkan di server. */
export function useT() {
    const { locale } = usePage().props;

    return {
        locale,
        t: (key: TranslationKey) => (locale === 'en' ? en[key] : key),
        lp: (path: string) => localePath(locale, path),
    };
}
