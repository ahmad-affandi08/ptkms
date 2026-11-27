import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
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
                        className="aspect-[16/9] w-full animate-reveal object-cover object-[50%_45%] lg:aspect-auto lg:h-full"
                    />
                    {caption && (
                        <figcaption
                            aria-hidden
                            className="absolute bottom-0 left-0 flex items-center gap-2.5 bg-ink px-4 py-2.5 text-sm text-paper"
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
    const { lp } = useT();

    return (
        <article className="group relative">
            <div className="aspect-square overflow-hidden bg-plate">
                <Img
                    image={product.image}
                    alt={product.name}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="size-full object-contain p-4 mix-blend-multiply"
                />
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
        <section className="bg-ink text-paper">
            <Container className="grid gap-8 py-16 lg:grid-cols-12 lg:items-end lg:py-20">
                <div className="lg:col-span-7">
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        {t(
                            'Alat butuh servis, atau sedang menyiapkan pengadaan?',
                        )}
                    </h2>
                    <p className="mt-3 max-w-xl text-paper/75">
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
                        className="rounded-sm border border-paper/40 px-5 py-3 font-semibold hover:border-paper hover:bg-paper hover:text-ink"
                    >
                        {t('Isi formulir')}
                    </Link>
                </div>
            </Container>
        </section>
    );
}

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
