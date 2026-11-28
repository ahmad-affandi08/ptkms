import { Link } from '@inertiajs/react';
import {
    buttonOutline,
    ComingSoon,
    ContactBand,
    Container,
    PageHeader,
} from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import type { Project, Seo as SeoData } from '@/types';

export default function Projects({
    seo,
    projects,
}: {
    seo: SeoData;
    projects: Project[];
}) {
    const { t, lp } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Proyek')} />
            <PageHeader title={t('Proyek')} />
            <Container className="py-12 lg:py-20">
                {projects.length === 0 && (
                    <ComingSoon
                        art="hospital"
                        title={t('Dokumentasi proyek segera hadir')}
                        text={t(
                            'Sementara itu, lihat foto pekerjaan tim kami di galeri.',
                        )}
                    >
                        <Link href={lp('/galeri')} className={buttonOutline}>
                            {t('Lihat galeri')}
                        </Link>
                    </ComingSoon>
                )}
                <div className="space-y-16 lg:space-y-24">
                    {projects.map((p, i) => (
                        <article
                            key={p.slug}
                            className="group relative grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12"
                        >
                            <Img
                                image={p.image}
                                alt={p.title}
                                sizes="(min-width: 1024px) 58vw, 100vw"
                                className={`aspect-[3/2] w-full lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}
                            />
                            <div className="lg:col-span-5">
                                <p className="text-sm text-steel">
                                    {[p.client, p.location, p.year]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                                <h2 className="mt-2 text-3xl leading-tight font-semibold">
                                    <Link
                                        href={lp(`/proyek/${p.slug}`)}
                                        className="group-hover:text-signal after:absolute after:inset-0"
                                    >
                                        {p.title}
                                    </Link>
                                </h2>
                                {p.excerpt && (
                                    <p className="mt-3 text-steel">
                                        {p.excerpt}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </Container>
            <ContactBand />
        </>
    );
}
