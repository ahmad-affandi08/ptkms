import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import {
    ContactBand,
    Container,
    ProductGrid,
    Prose,
    SectionHeading,
} from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Product, Seo as SeoData } from '@/types';

export default function ProductShow({
    seo,
    product,
    related,
}: {
    seo: SeoData;
    product: Product & { id: number };
    related: Product[];
}) {
    const { t, lp } = useT();
    const software = product.type === 'software';
    const images = product.images ?? [];
    const [active, setActive] = useState(0);

    const facts = [
        [t('Brand'), product.brand],
        [t('Tipe'), product.model],
        [t('Kategori'), product.category?.name],
        [t('Jenis produk'), software ? t('Software') : null],
        [t('No. izin edar'), product.akl_number],
    ].filter(([, v]) => v) as [string, string][];

    return (
        <>
            <Seo seo={seo} />
            <Container className="pt-6">
                <nav aria-label="Breadcrumb" className="text-sm text-steel">
                    <Link href={lp('/produk')} className="hover:text-ink">
                        {t('Produk')}
                    </Link>
                    {product.category && (
                        <>
                            {' / '}
                            <Link
                                href={lp(
                                    `/produk?kategori=${product.category.slug}`,
                                )}
                                className="hover:text-ink"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                </nav>
            </Container>

            <Container className="grid gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
                <div className="lg:col-span-7">
                    <div
                        className={cn(
                            'bg-plate',
                            software
                                ? 'aspect-video border border-line'
                                : 'aspect-square',
                        )}
                    >
                        <Img
                            image={images[active]}
                            alt={product.name}
                            eager
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            className={
                                software
                                    ? 'size-full object-contain'
                                    : 'size-full object-contain p-6 mix-blend-multiply'
                            }
                        />
                    </div>
                    {images.length > 1 && (
                        <ul className="mt-3 grid grid-cols-5 gap-2">
                            {images.map((img, i) => (
                                <li key={img.thumb}>
                                    <button
                                        type="button"
                                        onClick={() => setActive(i)}
                                        aria-label={`${product.name} ${i + 1}`}
                                        aria-pressed={i === active}
                                        className={cn(
                                            'block aspect-square w-full border-2 bg-plate',
                                            i === active
                                                ? 'border-ink'
                                                : 'border-transparent hover:border-line',
                                        )}
                                    >
                                        <img
                                            src={img.thumb}
                                            alt=""
                                            loading="lazy"
                                            className="size-full object-contain p-1 mix-blend-multiply"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="lg:col-span-5">
                    <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                        {product.name}
                    </h1>
                    {product.excerpt && (
                        <p className="mt-4 text-lg text-steel">
                            {product.excerpt}
                        </p>
                    )}

                    {facts.length > 0 && (
                        <dl className="mt-6 border-t border-ink text-[0.95rem]">
                            {facts.map(([k, v]) => (
                                <div
                                    key={k}
                                    className="grid grid-cols-5 gap-4 border-b border-line py-2.5"
                                >
                                    <dt className="col-span-2 text-steel">
                                        {k}
                                    </dt>
                                    <dd className="col-span-3 font-medium">
                                        {v}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                        {product.demo_url && (
                            <a
                                href={product.demo_url}
                                target="_blank"
                                rel="noopener"
                                className="inline-flex items-center gap-2 rounded-sm bg-signal px-6 py-3 font-semibold text-white hover:bg-signal-dark"
                            >
                                {t('Coba demo')}
                                <ExternalLink aria-hidden className="size-4" />
                            </a>
                        )}
                        <Link
                            href={lp(`/kontak?produk=${product.id}`)}
                            className={cn(
                                'rounded-sm px-6 py-3 font-semibold',
                                product.demo_url
                                    ? 'border border-ink/25 hover:border-ink'
                                    : 'bg-signal text-white hover:bg-signal-dark',
                            )}
                        >
                            {software
                                ? t('Minta demo atau penawaran')
                                : t('Tanyakan produk ini')}
                        </Link>
                        {product.tokopedia_url && (
                            <a
                                href={product.tokopedia_url}
                                target="_blank"
                                rel="noopener"
                                className="rounded-sm border border-ink/25 px-5 py-3 font-semibold hover:border-ink"
                            >
                                {t('Beli di Tokopedia')}
                            </a>
                        )}
                        {product.shopee_url && (
                            <a
                                href={product.shopee_url}
                                target="_blank"
                                rel="noopener"
                                className="rounded-sm border border-ink/25 px-5 py-3 font-semibold hover:border-ink"
                            >
                                {t('Beli di Shopee')}
                            </a>
                        )}
                    </div>
                </div>
            </Container>

            {(product.description || (product.specs?.length ?? 0) > 0) && (
                <Container className="grid gap-12 border-t border-line py-12 lg:grid-cols-12 lg:py-16">
                    {product.description && (
                        <Prose
                            html={product.description}
                            className="lg:col-span-7"
                        />
                    )}
                    {(product.specs?.length ?? 0) > 0 && (
                        <section
                            className={
                                product.description
                                    ? 'lg:col-span-5'
                                    : 'lg:col-span-8'
                            }
                        >
                            <h2 className="text-2xl font-semibold">
                                {t('Spesifikasi')}
                            </h2>
                            <table className="mt-4 w-full border-t-2 border-ink text-left text-[0.95rem]">
                                <tbody>
                                    {product.specs!.map((s, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-line"
                                        >
                                            <th
                                                scope="row"
                                                className="w-2/5 py-2.5 pr-4 align-top font-normal text-steel"
                                            >
                                                {s.label}
                                            </th>
                                            <td className="py-2.5 font-medium tabular-nums">
                                                {s.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </Container>
            )}

            {related.length > 0 && (
                <section className="border-t border-line bg-white py-14">
                    <Container>
                        <SectionHeading title={t('Produk terkait')} />
                        <ProductGrid
                            products={related}
                            columns="lg:grid-cols-4"
                        />
                    </Container>
                </section>
            )}

            <ContactBand />
        </>
    );
}
