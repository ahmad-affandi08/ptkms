import { Link, usePage } from '@inertiajs/react';
import {
    ContactBand,
    Container,
    ProductCard,
    SectionHeading,
    TextLink,
} from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type {
    GalleryItem,
    Partner,
    Product,
    Project,
    Seo as SeoData,
    Service,
    Testimonial,
} from '@/types';

type Props = {
    seo: SeoData;
    hero: {
        title: string | null;
        subtitle: string | null;
        image: string | null;
        caption: string | null;
    };
    field: GalleryItem[];
    stats: { value: string; label: string }[];
    services: Service[];
    products: Product[];
    brands: Partner[];
    clients: Partner[];
    projects: Project[];
    testimonials: Testimonial[];
};

export default function Home({
    seo,
    hero,
    field,
    stats,
    services,
    products,
    brands,
    clients,
    projects,
    testimonials,
}: Props) {
    const { site } = usePage().props;
    const { t, lp } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={hero.title ?? undefined} />

            <section className="relative border-b border-line">
                {hero.image && (
                    <figure className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[42%]">
                        <img
                            src={hero.image}
                            alt={hero.caption ?? ''}
                            fetchPriority="high"
                            className="aspect-[4/3] w-full animate-reveal object-cover object-[50%_40%] sm:aspect-[16/9] lg:aspect-auto lg:h-full"
                        />
                        {hero.caption && (
                            <figcaption
                                aria-hidden
                                className="absolute bottom-0 left-0 flex items-center gap-2.5 bg-ink px-4 py-2.5 text-sm text-paper"
                            >
                                <span className="size-2 bg-signal-bright" />
                                {hero.caption}
                            </figcaption>
                        )}
                    </figure>
                )}

                <Container className="relative">
                    <div
                        className={
                            hero.image
                                ? 'py-12 lg:flex lg:min-h-[calc(100svh-5rem)] lg:w-[54%] lg:flex-col lg:justify-center lg:py-20'
                                : 'py-12 lg:py-20'
                        }
                    >
                        <h1 className="text-[2.6rem] leading-[1] font-semibold tracking-tight sm:text-6xl lg:text-[5.25rem]">
                            {hero.title ?? site.name}
                        </h1>
                        {hero.subtitle && (
                            <p className="mt-6 max-w-xl text-lg text-steel sm:text-xl">
                                {hero.subtitle}
                            </p>
                        )}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={lp('/kontak?perlu=quotation')}
                                className="rounded-sm bg-signal px-6 py-3 font-semibold text-white hover:bg-signal-dark"
                            >
                                {t('Minta penawaran')}
                            </Link>
                            <Link
                                href={lp('/produk')}
                                className="rounded-sm border border-ink/25 px-6 py-3 font-semibold hover:border-ink"
                            >
                                {t('Lihat katalog')}
                            </Link>
                        </div>
                        <SpecPlate stats={stats} className="mt-12 lg:mt-16" />
                    </div>
                </Container>
            </section>

            {field.length > 0 && (
                <section className="bg-ink py-16 text-paper lg:py-24">
                    <Container>
                        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                            <div className="max-w-xl">
                                <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                                    {t('Di lapangan')}
                                </h2>
                                <p className="mt-3 text-paper/70">
                                    {t(
                                        'Dokumentasi pekerjaan tim kami di rumah sakit.',
                                    )}
                                </p>
                            </div>
                            <Link
                                href={lp('/galeri')}
                                className="font-semibold underline decoration-signal-bright decoration-2 underline-offset-4 hover:text-white"
                            >
                                {t('Lihat galeri')}
                            </Link>
                        </div>
                        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
                            {field.map((item, i) => (
                                <li key={i} className="lg:even:mt-12">
                                    <figure>
                                        <Img
                                            image={item.image}
                                            alt={item.caption ?? ''}
                                            sizes="(min-width: 1024px) 25vw, 50vw"
                                            className="aspect-[3/4] w-full bg-ink-soft"
                                        />
                                        {item.caption && (
                                            <figcaption className="mt-3 text-sm text-paper/75">
                                                {item.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {services.length > 0 && (
                <section className="py-16 lg:py-24">
                    <Container>
                        <SectionHeading
                            title={t('Yang kami kerjakan')}
                            intro={t(
                                'Dari pengadaan sampai perawatan rutin, satu tim yang sama menangani alat Anda.',
                            )}
                        />
                        <ul className="border-t border-ink">
                            {services.map((s) => (
                                <li
                                    key={s.slug}
                                    className="group relative grid gap-2 border-b border-line py-6 md:grid-cols-12 md:items-baseline md:gap-8"
                                >
                                    <h3 className="text-2xl font-semibold md:col-span-4">
                                        <Link
                                            href={lp(`/layanan/${s.slug}`)}
                                            className="group-hover:text-signal after:absolute after:inset-0"
                                        >
                                            {s.title}
                                        </Link>
                                    </h3>
                                    <p className="text-steel md:col-span-6">
                                        {s.excerpt}
                                    </p>
                                    <span className="text-sm font-semibold text-signal md:col-span-2 md:text-right">
                                        {t('Selengkapnya')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {products.length > 0 && (
                <section className="border-t border-line bg-white py-16 lg:py-24">
                    <Container>
                        <SectionHeading
                            title={t('Produk unggulan')}
                            action={
                                <TextLink href={lp('/produk')}>
                                    {t('Semua produk')}
                                </TextLink>
                            }
                        />
                        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
                            {products.map((p) => (
                                <ProductCard key={p.slug} product={p} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {brands.length > 0 && (
                <LogoRow title={t('Brand yang kami tangani')} items={brands} />
            )}

            {projects.length > 0 && (
                <section className="py-16 lg:py-24">
                    <Container>
                        <SectionHeading
                            title={t('Proyek terbaru')}
                            action={
                                <TextLink href={lp('/proyek')}>
                                    {t('Semua proyek')}
                                </TextLink>
                            }
                        />
                        <div className="grid gap-10 md:grid-cols-3">
                            {projects.map((p) => (
                                <article
                                    key={p.slug}
                                    className="group relative"
                                >
                                    <Img
                                        image={p.image}
                                        alt={p.title}
                                        sizes="(min-width: 768px) 33vw, 100vw"
                                        className="aspect-[4/3] w-full"
                                    />
                                    <p className="mt-4 text-sm text-steel">
                                        {[p.client, p.location, p.year]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                    <h3 className="mt-1 text-xl font-semibold">
                                        <Link
                                            href={lp(`/proyek/${p.slug}`)}
                                            className="group-hover:text-signal after:absolute after:inset-0"
                                        >
                                            {p.title}
                                        </Link>
                                    </h3>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {testimonials.length > 0 && (
                <section className="border-t border-line py-16 lg:py-24">
                    <Container>
                        <h2 className="sr-only">{t('Kata mereka')}</h2>
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((q, i) => (
                                <figure key={i}>
                                    <blockquote className="font-display text-xl leading-snug font-medium sm:text-2xl">
                                        “{q.quote}”
                                    </blockquote>
                                    <figcaption className="mt-4 text-sm">
                                        <span className="font-semibold">
                                            {q.name}
                                        </span>
                                        <span className="block text-steel">
                                            {[q.position, q.institution]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {clients.length > 0 && (
                <LogoRow title={t('Dipercaya oleh')} items={clients} />
            )}

            <ContactBand />
        </>
    );
}

/**
 * Pelat spesifikasi: meniru nameplate pada alat elektromedis (bingkai, paku keling di sudut, label kecil + nilai).
 * Isinya fakta perusahaan dari Pengaturan Situs.
 */
function SpecPlate({
    stats,
    className,
}: {
    stats: Props['stats'];
    className?: string;
}) {
    const { site } = usePage().props;
    const { t } = useT();

    const cells = [
        ...stats.map((s) => ({ label: s.label, value: s.value })),
        site.office_hours && {
            label: t('Jam operasional'),
            value: site.office_hours,
        },
        site.phone && {
            label: t('Telepon'),
            value: site.phone,
            href: `tel:${site.phone.replace(/[^\d+]/g, '')}`,
        },
        site.email && {
            label: 'Email',
            value: site.email,
            href: `mailto:${site.email}`,
        },
    ].filter(Boolean) as { label: string; value: string; href?: string }[];

    if (cells.length === 0) {
        return null;
    }

    return (
        <dl
            className={cn(
                'relative grid grid-cols-1 gap-px border-2 border-ink bg-line sm:grid-cols-2',
                className,
            )}
        >
            {[
                'top-2 left-2',
                'top-2 right-2',
                'bottom-2 left-2',
                'right-2 bottom-2',
            ].map((pos) => (
                <span
                    key={pos}
                    aria-hidden
                    className={`absolute z-10 ${pos} size-1.5 rounded-full bg-ink/40`}
                />
            ))}
            {cells.map((c) => (
                <div key={c.label} className="bg-white px-6 py-5">
                    <dt className="text-sm text-steel">{c.label}</dt>
                    <dd className="mt-1 font-display text-xl font-semibold break-words sm:text-2xl">
                        {c.href ? (
                            <a href={c.href} className="hover:text-signal">
                                {c.value}
                            </a>
                        ) : (
                            c.value
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

function LogoRow({ title, items }: { title: string; items: Partner[] }) {
    return (
        <section className="border-t border-line py-12 lg:py-16">
            <Container>
                <h2 className="text-lg font-semibold">{title}</h2>
                <ul className="mt-6 grid grid-cols-3 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
                    {items.map((p) => (
                        <li key={p.name} className="flex h-14 items-center">
                            {p.logo ? (
                                <img
                                    src={p.logo.thumb}
                                    alt={p.name}
                                    loading="lazy"
                                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0"
                                />
                            ) : (
                                <span className="font-display text-lg font-semibold text-steel">
                                    {p.name}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
