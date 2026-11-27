import { Head, usePage } from '@inertiajs/react';
import { switchLocalePath } from '@/lib/utils';
import type { Seo as SeoProps } from '@/types';

/** Title, deskripsi, Open Graph, canonical, dan hreflang. Dirender di server lewat SSR. */
export default function Seo({
    seo,
    fallbackTitle,
}: {
    seo?: SeoProps;
    fallbackTitle?: string;
}) {
    const page = usePage();
    const { site, locale } = page.props;
    const path = page.url.split('?')[0];
    const title = seo?.title || fallbackTitle;
    const description = seo?.description || site.about_short || '';
    const image = seo?.image || site.og_image;

    return (
        <Head title={title ?? undefined}>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title ?? ''} />
            <meta property="og:description" content={description} />
            <meta
                property="og:locale"
                content={locale === 'en' ? 'en_US' : 'id_ID'}
            />
            {image && <meta property="og:image" content={image} />}
            <meta
                name="twitter:card"
                content={image ? 'summary_large_image' : 'summary'}
            />
            <link rel="canonical" href={site.url + path} />
            <link
                rel="alternate"
                hrefLang="id"
                href={site.url + switchLocalePath(path, 'id')}
            />
            <link
                rel="alternate"
                hrefLang="en"
                href={site.url + switchLocalePath(path, 'en')}
            />
            <link
                rel="alternate"
                hrefLang="x-default"
                href={site.url + switchLocalePath(path, 'id')}
            />
        </Head>
    );
}
