import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import ComingSoonArt from '@/components/coming-soon-art';
import type { Art } from '@/components/coming-soon-art';
import Img from '@/components/img';
import { WhatsAppIcon } from '@/components/site-layout';
import { useT } from '@/lib/i18n';
import { cn, waLink } from '@/lib/utils';
import type { Paginated, Product } from '@/types';

export function Container({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn('mx-auto max-w-7xl px-4 sm:px-6', className)}>
            {children}
        </div>
    );
}

/** Judul halaman dalam: judul besar rata kiri, opsional foto lapangan di kanan (selebar tepi layar). */
export function PageHeader({
    title,
    intro,
    image,
    caption,
    children,
}: {
    title: string;
    intro?: string | null;
    image?: string;
    caption?: string;
    children?: ReactNode;
}) {
    return (
        <header className="relative border-b border-line">
            {image && (
                <figure className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[38%]">
                    <img
                        src={image}
                        alt={caption ?? ''}
                        className="aspect-[16/9] w-full object-cover object-[50%_45%] lg:aspect-auto lg:h-full"
                    />
                    {caption && (
                        <figcaption
                            aria-hidden
                            className="absolute bottom-0 left-0 flex items-center gap-2.5 bg-white px-4 py-2.5 text-sm text-ink"
                        >
                            <span className="size-2 bg-signal-bright" />
                            {caption}
                        </figcaption>
                    )}
                </figure>
            )}
            <Container className="relative">
                <div
                    className={cn(
                        'pt-12 pb-10 lg:pt-20 lg:pb-14',
                        image &&
                            'lg:flex lg:min-h-[28rem] lg:w-[56%] lg:flex-col lg:justify-end',
                    )}
                >
                    <h1 className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    {intro && (
                        <p className="mt-4 max-w-2xl text-lg text-steel">
                            {intro}
                        </p>
                    )}
                    {children}
                </div>
            </Container>
        </header>
    );
}

export function SectionHeading({
    title,
    intro,
    action,
}: {
    title: string;
    intro?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
            <div className="max-w-2xl">
                <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                    {title}
                </h2>
                {intro && <p className="mt-3 text-steel">{intro}</p>}
            </div>
            {action}
        </div>
    );
}

export function TextLink({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="font-semibold text-signal underline decoration-1 underline-offset-4 hover:text-signal-dark hover:decoration-2"
        >
            {children}
        </Link>
    );
}

export function ProductCard({ product }: { product: Product }) {
    const { t, lp } = useT();
    const software = product.type === 'software';

    return (
        <article className="group relative">
            <div className="relative aspect-square overflow-hidden bg-plate">
                <Img
                    image={product.image}
                    alt={product.name}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className={
                        software
                            ? 'size-full object-cover object-top'
                            : 'size-full object-contain p-4 mix-blend-multiply'
                    }
                />
                {software && (
                    <span className="absolute top-2 left-2 rounded-sm bg-white px-2 py-1 text-xs font-semibold text-signal ring-1 ring-line">
                        {t('Software')}
                    </span>
                )}
            </div>
            <h3 className="mt-3 font-display text-lg leading-snug font-semibold">
                <Link
                    href={lp(`/produk/${product.slug}`)}
                    className="group-hover:underline group-hover:decoration-signal-bright group-hover:underline-offset-4 after:absolute after:inset-0"
                >
                    {product.name}
                </Link>
            </h3>
            <p className="mt-0.5 text-sm text-steel">
                {[product.brand, product.model].filter(Boolean).join(' / ') ||
                    product.category?.name}
            </p>
        </article>
    );
}

export function Pagination({ page }: { page: Paginated<unknown> }) {
    const { t } = useT();

    if (page.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-between border-t border-line pt-6 text-sm"
        >
            {page.prev_page_url ? (
                <Link
                    href={page.prev_page_url}
                    preserveScroll={false}
                    className="font-semibold hover:text-signal"
                >
                    {t('Sebelumnya')}
                </Link>
            ) : (
                <span />
            )}
            <span className="text-steel">
                {t('Halaman')} {page.current_page} {t('dari')} {page.last_page}
            </span>
            {page.next_page_url ? (
                <Link
                    href={page.next_page_url}
                    className="font-semibold hover:text-signal"
                >
                    {t('Berikutnya')}
                </Link>
            ) : (
                <span />
            )}
        </nav>
    );
}

/** Alamat, jam operasional, dan peta Google Maps (dari Pengaturan Situs). */
export function LocationSection() {
    const { site } = usePage().props;
    const { t } = useT();

    if (!site.maps_embed && !site.address) {
        return null;
    }

    return (
        <section className="border-t border-line bg-white py-16 lg:py-24">
            <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        {t('Lokasi kami')}
                    </h2>
                    <p className="mt-3 max-w-md text-steel">
                        {t('Kunjungi kantor kami pada jam operasional.')}
                    </p>
                    <dl className="mt-8 space-y-6 border-t border-ink pt-6">
                        {site.address && (
                            <div>
                                <dt className="text-sm text-steel">
                                    {t('Alamat')}
                                </dt>
                                <dd className="mt-1 text-lg whitespace-pre-line">
                                    {site.address}
                                </dd>
                            </div>
                        )}
                        {site.office_hours && (
                            <div>
                                <dt className="text-sm text-steel">
                                    {t('Jam operasional')}
                                </dt>
                                <dd className="mt-1 text-lg">
                                    {site.office_hours}
                                </dd>
                            </div>
                        )}
                    </dl>
                    {site.maps_url && (
                        <a
                            href={site.maps_url}
                            target="_blank"
                            rel="noopener"
                            className="mt-8 inline-block rounded-sm border border-ink/25 px-5 py-3 font-semibold hover:border-ink"
                        >
                            {t('Buka di Google Maps')}
                        </a>
                    )}
                </div>
                {site.maps_embed && (
                    <div className="lg:col-span-7">
                        <iframe
                            src={site.maps_embed}
                            title={t('Peta lokasi kantor')}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="aspect-[4/3] w-full border border-line bg-plate lg:aspect-auto lg:h-full lg:min-h-[26rem]"
                        />
                    </div>
                )}
            </Container>
        </section>
    );
}

/** Ajakan kontak di akhir halaman. */
export function ContactBand() {
    const { site } = usePage().props;
    const { t, lp } = useT();

    return (
        <section className="bg-flame text-white [--color-signal-bright:var(--color-white)]">
            <Container className="grid gap-8 py-16 lg:grid-cols-12 lg:items-end lg:py-20">
                <div className="lg:col-span-7">
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        {t(
                            'Alat butuh servis, atau sedang menyiapkan pengadaan?',
                        )}
                    </h2>
                    <p className="mt-3 max-w-xl text-white">
                        {t(
                            'Ceritakan kebutuhan Anda. Tim kami membalas pada jam kerja.',
                        )}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
                    {site.whatsapp && (
                        <a
                            href={waLink(site.whatsapp)}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-2 rounded-sm bg-clinic px-5 py-3 font-semibold text-white hover:bg-clinic-dark"
                        >
                            <WhatsAppIcon className="size-5" />
                            {t('Chat WhatsApp')}
                        </a>
                    )}
                    <Link
                        href={lp('/kontak')}
                        className="rounded-sm bg-white px-5 py-3 font-semibold text-ink hover:bg-paper"
                    >
                        {t('Isi formulir')}
                    </Link>
                </div>
            </Container>
        </section>
    );
}

/**
 * Placeholder saat daftar masih kosong: kartu bayangan (abu-abu, bergaris tipis) seperti isi yang akan datang,
 * dengan panel pesan di tengah. Tidak menampilkan konten karangan.
 */
export function ComingSoon({
    art,
    title,
    text,
    cards = 3,
    aspect = 'aspect-[4/3]',
    columns = 'sm:grid-cols-3',
    children,
}: {
    art: Art;
    title: string;
    text: string;
    cards?: number;
    aspect?: string;
    columns?: string;
    children?: ReactNode;
}) {
    return (
        <div className="relative">
            <ul
                aria-hidden
                className={cn('hidden gap-x-6 gap-y-10 sm:grid', columns)}
            >
                {Array.from({ length: cards }, (_, i) => (
                    <li key={i}>
                        <div
                            className={cn(
                                aspect,
                                'grid place-items-center border border-line bg-plate bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgb(0_0_0/0.03)_12px_13px)]',
                            )}
                        >
                            <ComingSoonArt
                                art={art}
                                className="art-still h-16 text-ink/15 [--art-accent:currentColor] [--art-glow:currentColor]"
                            />
                        </div>
                        <div className="mt-4 h-3 w-1/3 rounded-full bg-line" />
                        <div className="mt-3 h-4 w-4/5 rounded-full bg-line/80" />
                        <div className="mt-2 h-4 w-3/5 rounded-full bg-line/60" />
                    </li>
                ))}
            </ul>
            <div className="grid place-items-center sm:absolute sm:inset-0 sm:p-6">
                <div className="w-full max-w-lg border border-line bg-white px-6 py-8 text-center shadow-xl shadow-ink/5 sm:px-8">
                    <ComingSoonArt
                        art={art}
                        className="mx-auto h-24 text-ink"
                    />
                    <p className="mt-4 font-display text-xl font-semibold">
                        {title}
                    </p>
                    <p className="mt-2 text-steel">{text}</p>
                    {children && (
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/** Logo toko online (Tokopedia/Shopee) dari Pengaturan Situs. */
export function ShopLinks() {
    const { site } = usePage().props;

    return (['tokopedia', 'shopee'] as const)
        .filter((k) => site.social[k])
        .map((k) => (
            <a
                key={k}
                href={site.social[k]}
                target="_blank"
                rel="noopener"
                className="flex h-12 items-center rounded-sm border border-line bg-white px-4 hover:border-ink/40"
            >
                <img
                    src={`/images/brands/${k}.svg`}
                    alt={k === 'shopee' ? 'Shopee' : 'Tokopedia'}
                    loading="lazy"
                    className={k === 'shopee' ? 'h-6' : 'h-[18px]'}
                />
            </a>
        ));
}

export const buttonPrimary =
    'rounded-sm bg-signal px-5 py-3 font-semibold text-white hover:bg-signal-dark';
export const buttonOutline =
    'rounded-sm border border-ink/25 bg-white px-5 py-3 font-semibold hover:border-ink';

export function Empty({ children }: { children: ReactNode }) {
    return (
        <p className="border border-dashed border-line px-6 py-12 text-center text-steel">
            {children}
        </p>
    );
}

export function Prose({
    html,
    className,
}: {
    html: string | null | undefined;
    className?: string;
}) {
    if (!html) {
        return null;
    }

    // Konten berasal dari editor dashboard (hanya akun admin/editor).
    return (
        <div
            className={cn('prose-kms', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
