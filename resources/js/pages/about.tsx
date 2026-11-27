import { usePage } from '@inertiajs/react';
import { useId, useState } from 'react';
import { ContactBand, Container, PageHeader } from '@/components/blocks';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';
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
            <PageHeader
                title={site.name}
                intro={site.about_short}
                image="/images/field/lampu-operasi.jpg"
                caption={t('Penyetelan lampu operasi')}
            />

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
                                <FaqItem key={i} {...f} />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            <ContactBand />
        </>
    );
}

/** Satu pertanyaan FAQ; jawabannya membuka dan menutup dengan animasi tinggi (grid 0fr ke 1fr). */
function FaqItem({ question, answer }: Faq) {
    const [open, setOpen] = useState(false);
    const id = useId();

    return (
        <div className="border-b border-line">
            <h3>
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={id}
                    onClick={() => setOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-xl font-semibold hover:text-signal"
                >
                    {question}
                    <span
                        aria-hidden
                        className={cn(
                            'text-2xl leading-none text-signal transition-transform duration-300 ease-out',
                            open && 'rotate-45',
                        )}
                    >
                        +
                    </span>
                </button>
            </h3>
            <div
                id={id}
                role="region"
                inert={!open}
                className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                    open
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                )}
            >
                <div className="overflow-hidden">
                    <p className="max-w-prose pb-5 text-steel">{answer}</p>
                </div>
            </div>
        </div>
    );
}
