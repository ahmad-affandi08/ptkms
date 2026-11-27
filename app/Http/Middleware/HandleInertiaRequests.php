<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Support\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /** @return array<string, mixed> */
    public function share(Request $request): array
    {
        // Closure: dievaluasi saat render, setelah middleware SetLocale milik route berjalan.
        return [
            ...parent::share($request),
            'locale' => fn () => app()->getLocale(),
            'flash' => ['success' => fn () => $request->session()->get('success')],
            'site' => fn () => $this->site(),
        ];
    }

    /** @return array<string, mixed> */
    private function site(): array
    {
        $s = Setting::get();
        $url = fn ($path) => $path ? Storage::disk('public')->url($path) : null;
        $mapsQuery = $s['maps_query'] ?? null;

        return [
            'name' => $s['company_name'] ?? config('app.name'),
            'short_name' => $s['short_name'] ?? config('app.name'),
            'url' => rtrim(config('app.url'), '/'),
            'logo' => $url($s['logo'] ?? null) ?? asset('images/logo-mark.png'),
            'og_image' => $url($s['og_image'] ?? null),
            'about_short' => Translation::pick($s['about_short'] ?? null),
            'email' => $s['email'] ?? null,
            'phone' => $s['phone'] ?? null,
            'whatsapp' => $s['whatsapp'] ?? null,
            'address' => $s['address'] ?? null,
            'office_hours' => $s['office_hours'] ?? null,
            'maps_url' => $s['maps_url'] ?? ($mapsQuery ? 'https://www.google.com/maps/search/?'.http_build_query(['api' => 1, 'query' => $mapsQuery]) : null),
            // Embed tanpa API key, sama seperti situs lama.
            'maps_embed' => $mapsQuery ? 'https://maps.google.com/maps?'.http_build_query(['q' => $mapsQuery, 'z' => 15, 'hl' => app()->getLocale(), 'output' => 'embed']) : null,
            'social' => array_filter($s['social'] ?? []),
            'turnstile_key' => config('services.turnstile.site_key'),
        ];
    }
}
