@php
    $site = \App\Models\Setting::get();
    $org = array_filter([
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        'name' => $site['company_name'] ?? config('app.name'),
        'url' => config('app.url'),
        'logo' => asset('images/logo-mark.png'),
        'email' => $site['email'] ?? null,
        'telephone' => $site['phone'] ?? null,
        'address' => isset($site['address']) ? ['@type' => 'PostalAddress', 'streetAddress' => $site['address'], 'addressCountry' => 'ID'] : null,
        'sameAs' => array_values(array_filter($site['social'] ?? [])) ?: null,
    ]);
@endphp
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#1c1b1a">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/images/icon-192.png" type="image/png" sizes="192x192">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <script type="application/ld+json">{!! json_encode($org, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) !!}</script>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $site['short_name'] ?? config('app.name') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
