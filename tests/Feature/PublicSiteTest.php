<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicSiteTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_every_public_page_renders_in_both_languages(): void
    {
        $category = ProductCategory::create(['slug' => 'monitor', 'name' => ['id' => 'Monitor pasien', 'en' => 'Patient monitors']]);
        Product::create(['slug' => 'pm-1', 'name' => 'Patient Monitor PM-1', 'product_category_id' => $category->id, 'specs' => [['label' => 'Layar', 'value' => '12 inci']]]);
        Project::create(['slug' => 'rs-a', 'title' => ['id' => 'Instalasi ICU RS A']]);
        Post::create(['slug' => 'tips', 'title' => ['id' => 'Tips perawatan'], 'published_at' => now()->subDay()]);

        $pages = [
            '/' => 'home', '/tentang' => 'about', '/layanan' => 'services/index', '/layanan/servis-dan-pemeliharaan' => 'services/show',
            '/produk' => 'products/index', '/produk/pm-1' => 'products/show', '/proyek' => 'projects/index', '/proyek/rs-a' => 'projects/show',
            '/galeri' => 'gallery', '/artikel' => 'posts/index', '/artikel/tips' => 'posts/show', '/kontak' => 'contact',
        ];

        foreach ($pages as $path => $component) {
            $this->get($path)->assertOk()->assertInertia(fn (Assert $page) => $page->component($component)->where('locale', 'id'));
            $this->get(rtrim('/en'.$path, '/'))->assertOk()->assertInertia(fn (Assert $page) => $page->component($component)->where('locale', 'en'));
        }
    }

    public function test_content_is_translated_with_indonesian_fallback(): void
    {
        $this->get('/en/layanan')->assertInertia(fn (Assert $page) => $page->where('services.0.title', 'Equipment Supply'));

        Service::first()->update(['title' => ['id' => 'Pengadaan', 'en' => '']]);
        $this->get('/en/layanan')->assertInertia(fn (Assert $page) => $page->where('services.0.title', 'Pengadaan'));
    }

    public function test_unpublished_and_draft_content_is_hidden(): void
    {
        Product::create(['slug' => 'hidden', 'name' => 'Hidden', 'is_published' => false]);
        Post::create(['slug' => 'draft', 'title' => ['id' => 'Draf']]);
        Post::create(['slug' => 'later', 'title' => ['id' => 'Nanti'], 'published_at' => now()->addWeek()]);

        $this->get('/produk/hidden')->assertNotFound();
        $this->get('/artikel/draft')->assertNotFound();
        $this->get('/artikel/later')->assertNotFound();
        $this->get('/produk')->assertInertia(fn (Assert $page) => $page->where('products.total', 0));
    }

    public function test_catalogue_filters_by_category_and_search(): void
    {
        $a = ProductCategory::create(['slug' => 'a', 'name' => ['id' => 'A']]);
        $b = ProductCategory::create(['slug' => 'b', 'name' => ['id' => 'B']]);
        Product::create(['slug' => 'x', 'name' => 'Suction Pump', 'product_category_id' => $a->id]);
        Product::create(['slug' => 'y', 'name' => 'Infusion Pump', 'product_category_id' => $b->id]);

        $this->get('/produk?kategori=a')->assertInertia(fn (Assert $page) => $page->where('products.total', 1)->where('products.data.0.slug', 'x'));
        $this->get('/produk?q=infusion')->assertInertia(fn (Assert $page) => $page->where('products.total', 1)->where('products.data.0.slug', 'y'));
    }

    public function test_catalogue_separates_software_and_shows_demo_link(): void
    {
        Product::create(['slug' => 'pm', 'name' => 'Patient Monitor']);
        Product::create(['slug' => 'pacs', 'name' => 'KMS PACS', 'type' => 'software', 'demo_url' => 'https://demo.example.com']);

        $this->get('/produk')->assertInertia(fn (Assert $page) => $page->where('products.total', 2)->where('hasSoftware', true));
        $this->get('/produk?jenis=software')->assertInertia(fn (Assert $page) => $page->where('products.total', 1)->where('products.data.0.slug', 'pacs')->where('filters.jenis', 'software'));
        $this->get('/produk?jenis=alat')->assertInertia(fn (Assert $page) => $page->where('products.total', 1)->where('products.data.0.slug', 'pm'));
        $this->get('/produk?jenis=bogus')->assertInertia(fn (Assert $page) => $page->where('products.total', 2)->where('filters.jenis', null));
        $this->get('/produk/pacs')->assertInertia(fn (Assert $page) => $page->where('product.type', 'software')->where('product.demo_url', 'https://demo.example.com'));
    }

    public function test_old_hostinger_urls_redirect_permanently(): void
    {
        $this->get('/about')->assertStatus(301)->assertRedirect('/tentang');
        $this->get('/services')->assertStatus(301)->assertRedirect('/layanan');
        $this->get('/contact')->assertStatus(301)->assertRedirect('/kontak');
    }

    public function test_sitemap_lists_both_languages(): void
    {
        $this->get('/sitemap.xml')->assertOk()
            ->assertSee(url('/layanan/servis-dan-pemeliharaan'), false)
            ->assertSee(url('/en/layanan/servis-dan-pemeliharaan'), false)
            ->assertSee('hreflang="en"', false);
    }
}
