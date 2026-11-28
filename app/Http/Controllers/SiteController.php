<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Faq;
use App\Models\GalleryItem;
use App\Models\Inquiry;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Support\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function home(): Response
    {
        $s = Setting::get();

        return $this->page('home', 'home', [
            'hero' => [
                'title' => Translation::pick($s['hero_title'] ?? null),
                'subtitle' => Translation::pick($s['hero_subtitle'] ?? null),
                // Tanpa unggahan di Pengaturan Situs, pakai foto lapangan bawaan beserta keterangannya.
                'image' => isset($s['hero_image']) ? Storage::disk('public')->url($s['hero_image']) : asset('images/field/hero.webp'),
                'caption' => isset($s['hero_image']) ? null : Translation::pick(['id' => 'Pemeriksaan mesin anestesi di kamar operasi', 'en' => 'Checking an anaesthesia machine in an operating room']),
            ],
            'field' => GalleryItem::visible()->with('media')->limit(4)->get()->map->toPublic(),
            'about' => Translation::pick($s['about'] ?? null),
            'stats' => array_map(fn (array $row) => ['value' => $row['value'], 'label' => Translation::pick($row['label'] ?? null)], $s['stats'] ?? []),
            'services' => Service::visible()->with('media')->get()->map->toPublic(),
            // Produk unggulan dulu, lalu terbaru; hanya yang berfoto, supaya beranda tidak menampilkan kartu kosong.
            'products' => Product::visible()->has('media')->reorder()->orderByDesc('is_featured')->orderBy('sort')->latest('id')->with('category', 'brand', 'media')->limit(8)->get()->map->toPublic(),
            'brands' => Partner::visible()->where('type', 'brand')->with('media')->get()->map->toPublic(),
            'clients' => Partner::visible()->where('type', 'client')->with('media')->get()->map->toPublic(),
            'projects' => Project::visible()->with('media')->limit(3)->get()->map->toPublic(),
            'testimonials' => Testimonial::visible()->limit(3)->get()->map->toPublic(),
            'posts' => Post::visible()->with('media')->limit(3)->get()->map->toPublic(),
        ]);
    }

    public function about(): Response
    {
        return $this->page('about', 'about', [
            'about' => Translation::pick(Setting::get()['about'] ?? null),
            'certificates' => Certificate::visible()->with('media')->get()->map->toPublic(),
            'faqs' => Faq::visible()->get()->map->toPublic(),
            'testimonials' => Testimonial::visible()->get()->map->toPublic(),
            'clients' => Partner::visible()->where('type', 'client')->with('media')->get()->map->toPublic(),
        ]);
    }

    public function services(): Response
    {
        return $this->page('services/index', 'services', [
            'services' => Service::visible()->with('media')->get()->map->toPublic(),
        ]);
    }

    public function service(string $slug): Response
    {
        $service = Service::where('slug', $slug)->where('is_published', true)->with('media')->firstOrFail();

        return $this->detail('services/show', $service, $service->tr('title'), $service->tr('excerpt'), [
            'service' => $service->toPublic(full: true),
            'others' => Service::visible()->whereKeyNot($service->id)->get()->map->toPublic(),
        ]);
    }

    public function products(Request $request): Response
    {
        $category = $request->string('kategori')->toString();
        $type = ['alat' => 'device', 'software' => 'software'][$request->string('jenis')->toString()] ?? null;
        $search = Str::limit($request->string('q')->trim()->toString(), 100, '');

        $products = Product::visible()
            ->with('category', 'brand', 'media')
            ->when($type, fn ($q) => $q->where('type', $type))
            ->when($category, fn ($q) => $q->whereHas('category', fn ($c) => $c->where('slug', $category)))
            ->when($search, fn ($q) => $q->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('model', 'like', "%{$search}%")
                ->orWhereHas('brand', fn ($b) => $b->where('name', 'like', "%{$search}%"))))
            ->paginate(24)
            ->withQueryString()
            ->through(fn (Product $p) => $p->toPublic());

        return $this->page('products/index', 'products', [
            'products' => $products,
            'categories' => ProductCategory::orderBy('sort')->has('products')->get()->map->toPublic(),
            'filters' => ['kategori' => $category ?: null, 'q' => $search ?: null, 'jenis' => $type ? array_search($type, ['alat' => 'device', 'software' => 'software']) : null],
            'hasSoftware' => Product::visible()->where('type', 'software')->exists(),
        ]);
    }

    public function product(string $slug): Response
    {
        $product = Product::where('slug', $slug)->where('is_published', true)->with('category', 'brand', 'media')->firstOrFail();

        return $this->detail('products/show', $product, $product->name, $product->tr('excerpt'), [
            'product' => $product->toPublic(full: true) + ['id' => $product->id],
            'related' => Product::visible()->where('product_category_id', $product->product_category_id)
                ->whereKeyNot($product->id)->with('category', 'brand', 'media')->limit(4)->get()->map->toPublic(),
        ]);
    }

    public function projects(): Response
    {
        return $this->page('projects/index', 'projects', [
            'projects' => Project::visible()->with('media')->get()->map->toPublic(),
        ]);
    }

    public function project(string $slug): Response
    {
        $project = Project::where('slug', $slug)->where('is_published', true)->with('media')->firstOrFail();

        return $this->detail('projects/show', $project, $project->tr('title'), $project->tr('excerpt'), [
            'project' => $project->toPublic(full: true),
        ]);
    }

    public function gallery(): Response
    {
        return $this->page('gallery', 'gallery', [
            'items' => GalleryItem::visible()->with('media')->get()->map->toPublic(),
        ]);
    }

    public function posts(): Response
    {
        return $this->page('posts/index', 'posts', [
            'posts' => Post::visible()->with('media')->paginate(12)->through(fn (Post $p) => $p->toPublic()),
        ]);
    }

    public function post(string $slug): Response
    {
        $post = Post::visible()->where('slug', $slug)->with('media')->firstOrFail();

        return $this->detail('posts/show', $post, $post->tr('title'), $post->tr('excerpt'), [
            'post' => $post->toPublic(full: true),
        ]);
    }

    public function contact(Request $request): Response
    {
        $product = $request->integer('produk') ? Product::where('is_published', true)->find($request->integer('produk')) : null;

        return $this->page('contact', 'contact', [
            'product' => $product ? ['id' => $product->id, 'name' => $product->name] : null,
            'topic' => $product ? 'quotation' : (array_key_exists($request->string('perlu')->toString(), Inquiry::TOPICS) ? $request->string('perlu')->toString() : null),
        ]);
    }

    /** Halaman statis: SEO diambil dari Pengaturan Situs > SEO halaman. */
    /** @param array<string, mixed> $props */
    private function page(string $component, string $seoKey, array $props): Response
    {
        $seo = Translation::pick(Setting::get()['seo'][$seoKey] ?? null) ?? [];

        return Inertia::render($component, $props + ['seo' => [
            'title' => $seo['title'] ?? null,
            'description' => $seo['description'] ?? null,
        ]]);
    }

    /** Halaman detail: SEO dari field SEO record, fallback ke judul & ringkasan. */
    /** @param array<string, mixed> $props */
    private function detail(string $component, Service|Product|Project|Post $record, ?string $title, ?string $description, array $props): Response
    {
        $seo = $record->tr('seo') ?? [];

        return Inertia::render($component, $props + ['seo' => [
            'title' => ($seo['title'] ?? null) ?: $title,
            'description' => ($seo['description'] ?? null) ?: $description,
            'image' => $record->cover()['large'] ?? null,
        ]]);
    }
}
