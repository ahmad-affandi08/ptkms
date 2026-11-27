<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use Symfony\Component\HttpFoundation\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $entries = [];
        foreach (['/', '/tentang', '/layanan', '/produk', '/proyek', '/galeri', '/artikel', '/kontak'] as $path) {
            $entries[] = [$path, null];
        }

        foreach (['layanan' => Service::visible(), 'produk' => Product::visible(), 'proyek' => Project::visible(), 'artikel' => Post::visible()] as $prefix => $query) {
            foreach ($query->get(['slug', 'updated_at']) as $record) {
                $entries[] = ["/{$prefix}/{$record->slug}", $record->updated_at];
            }
        }

        $id = fn (string $path) => url($path);
        $en = fn (string $path) => url(rtrim('/en'.$path, '/'));

        $sitemap = Sitemap::create();
        foreach ($entries as [$path, $updated]) {
            foreach ([$id($path), $en($path)] as $loc) {
                $tag = Url::create($loc)->addAlternate($id($path), 'id')->addAlternate($en($path), 'en');
                if ($updated) {
                    $tag->setLastModificationDate($updated);
                }
                $sitemap->add($tag);
            }
        }

        return $sitemap->toResponse(request());
    }
}
