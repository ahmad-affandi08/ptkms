<?php

use App\Http\Controllers\InquiryController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\SetLocale;
use Illuminate\Support\Facades\Route;

// Bahasa Indonesia di root, English di /en. Slug sama untuk kedua bahasa.
foreach (['id' => '', 'en' => 'en'] as $locale => $prefix) {
    Route::prefix($prefix)
        ->middleware(SetLocale::class.':'.$locale)
        ->name($prefix ? 'en.' : '')
        ->controller(SiteController::class)
        ->group(function () {
            Route::get('/', 'home')->name('home');
            Route::get('tentang', 'about')->name('about');
            Route::get('layanan', 'services')->name('services');
            Route::get('layanan/{slug}', 'service')->name('service');
            Route::get('produk', 'products')->name('products');
            Route::get('produk/{slug}', 'product')->name('product');
            Route::get('proyek', 'projects')->name('projects');
            Route::get('proyek/{slug}', 'project')->name('project');
            Route::get('galeri', 'gallery')->name('gallery');
            Route::get('artikel', 'posts')->name('posts');
            Route::get('artikel/{slug}', 'post')->name('post');
            Route::get('kontak', 'contact')->name('contact');
        });
}

Route::post('kontak', [InquiryController::class, 'store'])->middleware('throttle:5,1')->name('inquiry.store');
Route::get('sitemap.xml', SitemapController::class)->name('sitemap');

// URL situs lama (Hostinger) supaya peringkat Google tidak hilang.
Route::permanentRedirect('about', '/tentang');
Route::permanentRedirect('services', '/layanan');
Route::permanentRedirect('contact', '/kontak');
