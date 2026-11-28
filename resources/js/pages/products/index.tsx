import { Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    buttonPrimary,
    ComingSoon,
    ShopLinks,
    Container,
    Empty,
    PageHeader,
    Pagination,
    ProductCard,
} from '@/components/blocks';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Category, Paginated, Product, Seo as SeoData } from '@/types';

type Props = {
    seo: SeoData;
    products: Paginated<Product> & { total: number };
    categories: Category[];
    filters: {
        kategori: string | null;
        q: string | null;
        jenis: 'alat' | 'software' | null;
    };
    hasSoftware: boolean;
};

export default function Products({
    seo,
    products,
    categories,
    filters,
    hasSoftware,
}: Props) {
    const { t, lp } = useT();

    const search = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const q = (
            e.currentTarget.elements.namedItem('q') as HTMLInputElement
        ).value.trim();
        router.get(
            lp('/produk'),
            {
                ...(filters.jenis && { jenis: filters.jenis }),
                ...(filters.kategori && { kategori: filters.kategori }),
                ...(q && { q }),
            },
            { preserveState: true },
        );
    };

    const catHref = (slug: string | null) => {
        const params = new URLSearchParams({
            ...(filters.jenis && { jenis: filters.jenis }),
            ...(slug && { kategori: slug }),
            ...(filters.q && { q: filters.q }),
        });

        return lp('/produk') + (params.size ? `?${params}` : '');
    };

    const typeHref = (jenis: string | null) => {
        const params = new URLSearchParams({
            ...(jenis && { jenis }),
            ...(filters.q && { q: filters.q }),
        });

        return lp('/produk') + (params.size ? `?${params}` : '');
    };

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Produk')} />
            <PageHeader title={t('Produk')}>
                <form
                    role="search"
                    onSubmit={search}
                    className="mt-8 flex max-w-xl"
                >
                    <label htmlFor="q" className="sr-only">
                        {t('Cari nama, tipe, atau brand')}
                    </label>
                    <input
                        id="q"
                        name="q"
                        type="search"
                        defaultValue={filters.q ?? ''}
                        placeholder={t('Cari nama, tipe, atau brand')}
                        className="min-w-0 flex-1 rounded-l-sm border border-r-0 border-ink/30 bg-white px-4 py-3 focus:border-ink focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="rounded-r-sm bg-signal px-5 font-semibold text-white hover:bg-signal-dark"
                    >
                        {t('Cari')}
                    </button>
                </form>
            </PageHeader>

            <Container className="grid gap-10 py-10 lg:grid-cols-12 lg:py-14">
                {categories.length > 0 && (
                    <nav aria-label={t('Kategori')} className="lg:col-span-3">
                        <h2 className="text-sm text-steel">{t('Kategori')}</h2>
                        <ul className="mt-2 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-0.5 lg:overflow-visible">
                            {[
                                { slug: null, name: t('Semua kategori') },
                                ...categories,
                            ].map((c) => {
                                const active =
                                    (c.slug ?? null) === filters.kategori;

                                return (
                                    <li
                                        key={c.slug ?? 'all'}
                                        className="shrink-0"
                                    >
                                        <Link
                                            href={catHref(c.slug)}
                                            preserveState
                                            aria-current={
                                                active ? 'page' : undefined
                                            }
                                            className={cn(
                                                'block rounded-sm border border-line px-3 py-1.5 whitespace-nowrap lg:border-0 lg:border-l-2 lg:border-transparent lg:px-3 lg:py-2',
                                                active
                                                    ? 'border-signal bg-signal text-white lg:border-signal-bright lg:bg-transparent lg:font-semibold lg:text-ink'
                                                    : 'hover:text-signal',
                                            )}
                                        >
                                            {c.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                )}

                <div
                    className={
                        categories.length > 0
                            ? 'lg:col-span-9'
                            : 'lg:col-span-12'
                    }
                >
                    {(hasSoftware || filters.jenis) && (
                        <nav
                            aria-label={t('Jenis produk')}
                            className="mb-6 inline-flex rounded-sm border border-line bg-white p-1"
                        >
                            {(
                                [
                                    [null, t('Semua')],
                                    ['alat', t('Alat kesehatan')],
                                    ['software', t('Software')],
                                ] as const
                            ).map(([jenis, label]) => (
                                <Link
                                    key={jenis ?? 'all'}
                                    href={typeHref(jenis)}
                                    preserveState
                                    aria-current={
                                        filters.jenis === jenis
                                            ? 'page'
                                            : undefined
                                    }
                                    className={cn(
                                        'rounded-[2px] px-4 py-2 text-sm font-semibold',
                                        filters.jenis === jenis
                                            ? 'bg-signal text-white'
                                            : 'text-steel hover:text-ink',
                                    )}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    )}
                    <p className="mb-6 text-sm text-steel" aria-live="polite">
                        {products.total} {t('produk')}
                    </p>
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                            {products.data.map((p) => (
                                <ProductCard key={p.slug} product={p} />
                            ))}
                        </div>
                    ) : !filters.q && !filters.kategori && !filters.jenis ? (
                        <ComingSoon
                            art="monitor"
                            aspect="aspect-square"
                            title={t('Katalog sedang dilengkapi')}
                            text={t(
                                'Untuk daftar alat dan harga, minta penawaran atau kunjungi toko online kami.',
                            )}
                        >
                            <Link
                                href={lp('/kontak?perlu=quotation')}
                                className={buttonPrimary}
                            >
                                {t('Minta penawaran')}
                            </Link>
                            <ShopLinks />
                        </ComingSoon>
                    ) : (
                        <Empty>
                            {t(
                                'Belum ada produk yang cocok. Coba kata kunci lain atau hubungi kami, kami bantu carikan.',
                            )}{' '}
                            <Link
                                href={lp('/kontak')}
                                className="font-semibold text-signal underline"
                            >
                                {t('Hubungi kami')}
                            </Link>
                        </Empty>
                    )}
                    <Pagination page={products} />
                </div>
            </Container>
        </>
    );
}
