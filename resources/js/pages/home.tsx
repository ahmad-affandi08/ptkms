import { Link, usePage } from '@inertiajs/react';
import { Clock, Mail, Phone } from 'lucide-react';
import {
    ContactBand,
    Container,
    LocationSection,
    ProductGrid,
    SectionHeading,
    TextLink,
} from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';
import type {
    GalleryItem,
    Partner,
    Post,
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
    about: string | null;
    posts: Post[];
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
    about,
    posts,
    stats,
    services,
    products,
    brands,
    clients,
    projects,
    testimonials,
}: Props) {
    const { site } = usePage().props;
    const { t, lp, locale } = useT();

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
                            className="aspect-[4/3] w-full object-cover object-[50%_40%] sm:aspect-[16/9] lg:aspect-auto lg:h-full"
                        />
                        {hero.caption && (
                            <figcaption
                                aria-hidden
                                className="absolute bottom-0 left-0 flex items-center gap-2.5 bg-white px-4 py-2.5 text-sm text-ink"
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

            {(about || site.about_short) && (
                <section className="py-16 lg:py-24">
                    <Container className="grid gap-8 lg:grid-cols-12">
                        <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:col-span-4">
                            {t('Tentang kami')}
                        </h2>
                        <div className="lg:col-span-8">
                            <p className="max-w-3xl font-display text-2xl leading-snug font-medium sm:text-3xl">
                                {about?.split(/\n{2,}/)[0] ?? site.about_short}
                            </p>
                            <div className="mt-6">
                                <TextLink href={lp('/tentang')}>
                                    {t('Profil lengkap')}
                                </TextLink>
                            </div>
                        </div>
                    </Container>
                </section>
            )}

            {services.length > 0 && (
                <section className="border-t border-line bg-white py-16 lg:py-24">
                    <Container>
                        <SectionHeading
                            title={t('Yang kami kerjakan')}
                            action={
                                <TextLink href={lp('/layanan')}>
                                    {t('Semua layanan')}
                                </TextLink>
                            }
                            intro={t(
                                'Dari pengadaan sampai perawatan rutin, satu tim yang sama menangani alat Anda.',
                            )}
                        />
                        {/* Baris foto dan teks bergantian sisi, supaya tiap layanan terbaca sebagai pekerjaan nyata. */}
                        <ul className="space-y-12 lg:space-y-20">
                            {services.map((s) => (
                                <li
                                    key={s.slug}
                                    className="group relative grid items-center gap-6 md:grid-cols-12 md:gap-10"
                                >
                                    <div className="overflow-hidden md:col-span-7 md:group-even:order-last">
                                        <Img
                                            image={s.image}
                                            alt={s.title}
                                            sizes="(min-width: 768px) 58vw, 100vw"
                                            className="aspect-[16/10] w-full"
                                        />
                                    </div>
                                    <div className="md:col-span-5">
                                        <h3 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                                            <Link
                                                href={lp(`/layanan/${s.slug}`)}
                                                className="group-hover:text-signal after:absolute after:inset-0"
                                            >
                                                {s.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-4 text-lg text-steel">
                                            {s.excerpt}
                                        </p>
                                        <span className="mt-6 inline-block border-b-2 border-signal-bright pb-0.5 font-semibold text-signal">
                                            {t('Selengkapnya')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {field.length > 0 && (
                <section className="bg-flame py-16 text-white [--color-signal-bright:var(--color-white)] lg:py-24">
                    <Container>
                        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                            <div className="max-w-xl">
                                <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                                    {t('Di lapangan')}
                                </h2>
                                <p className="mt-3 text-white">
                                    {t(
                                        'Dokumentasi pekerjaan tim kami di rumah sakit.',
                                    )}
                                </p>
                            </div>
                            <Link
                                href={lp('/galeri')}
                                className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-4"
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
                                            className="aspect-[3/4] w-full bg-black/10"
                                        />
                                        {item.caption && (
                                            <figcaption className="mt-3 text-sm text-white">
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

            {products.length > 0 && (
                <section className="py-16 lg:py-24">
                    <Container>
                        <SectionHeading
                            title={t('Produk')}
                            intro={t(
                                'Alat kesehatan dan elektromedis untuk rumah sakit dan klinik.',
                            )}
                            action={
                                <TextLink href={lp('/produk')}>
                                    {t('Semua produk')}
                                </TextLink>
                            }
                        />
                        <ProductGrid
                            products={products}
                            columns="lg:grid-cols-4"
                        />
                    </Container>
                </section>
            )}

            {brands.length > 0 && (
                <LogoRow title={t('Brand yang kami tangani')} items={brands} />
            )}

            {projects.length > 0 && (
                <section className="border-t border-line py-16 lg:py-24">
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

            {posts.length > 0 && (
                <section className="border-t border-line py-16 lg:py-24">
                    <Container>
                        <SectionHeading
                            title={t('Artikel terbaru')}
                            action={
                                <TextLink href={lp('/artikel')}>
                                    {t('Semua artikel')}
                                </TextLink>
                            }
                        />
                        {/* Artikel terbaru besar di kiri, sisanya daftar ringkas berfoto kecil di kanan. */}
                        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr]">
                            {posts.map((p, i) => (
                                <article
                                    key={p.slug}
                                    className={cn(
                                        'group relative',
                                        i === 0
                                            ? 'lg:col-span-7 lg:row-span-3'
                                            : 'grid grid-cols-[8rem_1fr] items-start gap-5 sm:grid-cols-[12rem_1fr] lg:col-span-5',
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <Img
                                            image={p.image}
                                            alt={p.title}
                                            sizes={
                                                i === 0
                                                    ? '(min-width: 1024px) 58vw, 100vw'
                                                    : '12rem'
                                            }
                                            className={cn(
                                                'w-full',
                                                i === 0
                                                    ? 'aspect-[3/2]'
                                                    : 'aspect-[4/3]',
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <time
                                            dateTime={
                                                p.published_at ?? undefined
                                            }
                                            className={cn(
                                                'block text-sm text-steel',
                                                i === 0 && 'mt-4',
                                            )}
                                        >
                                            {formatDate(p.published_at, locale)}
                                        </time>
                                        <h3
                                            className={cn(
                                                'mt-1 leading-snug font-semibold',
                                                i === 0
                                                    ? 'text-2xl sm:text-3xl'
                                                    : 'text-lg sm:text-xl',
                                            )}
                                        >
                                            <Link
                                                href={lp(`/artikel/${p.slug}`)}
                                                className="group-hover:text-signal after:absolute after:inset-0"
                                            >
                                                {p.title}
                                            </Link>
                                        </h3>
                                        {i === 0 && p.excerpt && (
                                            <p className="mt-3 max-w-2xl text-steel">
                                                {p.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {clients.length > 0 && (
                <LogoRow title={t('Dipercaya oleh')} items={clients} />
            )}

            <LocationSection />
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

    const contacts = [
        site.office_hours && { icon: Clock, value: site.office_hours },
        site.phone && {
            icon: Phone,
            value: site.phone,
            href: `tel:${site.phone.replace(/[^\d+]/g, '')}`,
        },
        site.email && {
            icon: Mail,
            value: site.email,
            href: `mailto:${site.email}`,
        },
    ].filter(Boolean) as {
        icon: typeof Clock;
        value: string;
        href?: string;
    }[];

    if (stats.length === 0 && contacts.length === 0) {
        return null;
    }

    // Angka pengalaman besar sebagai penegas; kontak jadi daftar ringkas berikon di sebelahnya.
    return (
        <div
            className={cn(
                'flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-10',
                className,
            )}
        >
            {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-4">
                    {/* data-count: dihitung naik oleh lib/motion.ts */}
                    <p
                        data-count
                        className="font-display text-6xl leading-none font-semibold tracking-tight"
                    >
                        {s.value}
                    </p>
                    <p className="max-w-[7rem] text-sm leading-snug text-steel">
                        {s.label}
                    </p>
                </div>
            ))}
            {contacts.length > 0 && (
                <ul className="space-y-2 text-[0.95rem] sm:border-l sm:border-line sm:pl-10">
                    {contacts.map(({ icon: Icon, value, href }) => {
                        const body = (
                            <>
                                <Icon
                                    aria-hidden
                                    className="size-4 shrink-0 text-signal"
                                />
                                {value}
                            </>
                        );

                        return (
                            <li key={value}>
                                {href ? (
                                    <a
                                        href={href}
                                        className="flex items-center gap-3 hover:text-signal"
                                    >
                                        {body}
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        {body}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
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
