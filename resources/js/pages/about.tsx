import { usePage } from '@inertiajs/react';
import { ContactBand, Container, PageHeader } from '@/components/blocks';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import type {
    Certificate,
    Faq,
    Partner,
    Seo as SeoData,
    Testimonial,
} from '@/types';

type Props = {
    seo: SeoData;
    about: string | null;
    certificates: Certificate[];
    faqs: Faq[];
    testimonials: Testimonial[];
    clients: Partner[];
};

export default function About({
    seo,
    about,
    certificates,
    faqs,
    testimonials,
    clients,
}: Props) {
    const { site } = usePage().props;
    const { t, locale } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Tentang')} />
            <PageHeader title={site.name} intro={site.about_short} />

            {about && (
                <Container className="grid gap-8 py-12 lg:grid-cols-12 lg:py-20">
                    <h2 className="text-2xl font-semibold lg:col-span-4">
                        {t('Profil perusahaan')}
                    </h2>
                    <div className="space-y-5 text-lg lg:col-span-8">
                        {about.split(/\n{2,}/).map((para, i) => (
                            <p key={i} className="max-w-prose">
                                {para}
                            </p>
                        ))}
                    </div>
                </Container>
            )}

            {certificates.length > 0 && (
                <section className="border-t border-line bg-white py-12 lg:py-20">
                    <Container className="grid gap-8 lg:grid-cols-12">
                        <h2 className="text-2xl font-semibold lg:col-span-4">
                            {t('Legalitas & sertifikat')}
                        </h2>
                        <ul className="border-t border-ink lg:col-span-8">
                            {certificates.map((c, i) => (
                                <li
                                    key={i}
                                    className="grid gap-1 border-b border-line py-4 sm:grid-cols-3 sm:gap-6"
                                >
                                    <div className="sm:col-span-2">
                                        <p className="font-display text-xl font-semibold">
                                            {c.title}
                                        </p>
                                        <p className="text-sm text-steel">
                                            {[c.number, c.issuer]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </div>
                                    <div className="text-sm sm:text-right">
                                        {c.valid_until && (
                                            <p className="text-steel">
                                                {t('Berlaku sampai')}{' '}
                                                {formatDate(
                                                    c.valid_until,
                                                    locale,
                                                )}
                                            </p>
                                        )}
                                        {c.file && (
                                            <a
                                                href={c.file}
                                                target="_blank"
                                                rel="noopener"
                                                className="font-semibold text-signal underline underline-offset-4"
                                            >
                                                {t('Lihat dokumen')}
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {testimonials.length > 0 && (
                <section className="border-t border-line py-12 lg:py-20">
                    <Container>
                        <h2 className="text-2xl font-semibold">
                            {t('Kata mereka')}
                        </h2>
                        <div className="mt-8 grid gap-12 md:grid-cols-2">
                            {testimonials.map((q, i) => (
                                <figure key={i}>
                                    <blockquote className="font-display text-xl leading-snug font-medium">
                                        “{q.quote}”
                                    </blockquote>
                                    <figcaption className="mt-3 text-sm">
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
                <section className="border-t border-line py-12">
                    <Container>
                        <h2 className="text-lg font-semibold">
                            {t('Dipercaya oleh')}
                        </h2>
                        <ul className="mt-6 grid grid-cols-3 items-center gap-8 sm:grid-cols-4 lg:grid-cols-6">
                            {clients.map((c) => (
                                <li
                                    key={c.name}
                                    className="flex h-14 items-center"
                                >
                                    {c.logo ? (
                                        <img
                                            src={c.logo.thumb}
                                            alt={c.name}
                                            loading="lazy"
                                            className="max-h-full max-w-full object-contain grayscale"
                                        />
                                    ) : (
                                        <span className="font-semibold text-steel">
                                            {c.name}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {faqs.length > 0 && (
                <section className="border-t border-line py-12 lg:py-20">
                    <Container className="grid gap-8 lg:grid-cols-12">
                        <h2 className="text-2xl font-semibold lg:col-span-4">
                            {t('Pertanyaan umum')}
                        </h2>
                        <div className="border-t border-ink lg:col-span-8">
                            {faqs.map((f, i) => (
                                <details
                                    key={i}
                                    className="group border-b border-line"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
                                        {f.question}
                                        <span
                                            aria-hidden
                                            className="text-2xl leading-none text-signal transition-transform group-open:rotate-45"
                                        >
                                            +
                                        </span>
                                    </summary>
                                    <p className="max-w-prose pb-5 text-steel">
                                        {f.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            <ContactBand />
        </>
    );
}
