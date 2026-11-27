import { Link } from '@inertiajs/react';
import { ContactBand, Container, PageHeader } from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import type { Seo as SeoData, Service } from '@/types';

export default function Services({
    seo,
    services,
}: {
    seo: SeoData;
    services: Service[];
}) {
    const { t, lp } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Layanan')} />
            <PageHeader
                title={t('Layanan')}
                intro={t(
                    'Dari pengadaan sampai perawatan rutin, satu tim yang sama menangani alat Anda.',
                )}
            />
            <Container className="py-12 lg:py-20">
                <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
                    {services.map((s) => (
                        <article key={s.slug} className="group relative">
                            {s.image && (
                                <Img
                                    image={s.image}
                                    alt={s.title}
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    className="mb-5 aspect-[16/9] w-full"
                                />
                            )}
                            <h2 className="text-3xl font-semibold">
                                <Link
                                    href={lp(`/layanan/${s.slug}`)}
                                    className="group-hover:text-signal after:absolute after:inset-0"
                                >
                                    {s.title}
                                </Link>
                            </h2>
                            {s.excerpt && (
                                <p className="mt-2 max-w-prose text-steel">
                                    {s.excerpt}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </Container>
            <ContactBand />
        </>
    );
}
