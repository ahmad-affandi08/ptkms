import { Link } from '@inertiajs/react';
import { ContactBand, Container, PageHeader, Prose } from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import type { Seo as SeoData, Service } from '@/types';

export default function ServiceShow({
    seo,
    service,
    others,
}: {
    seo: SeoData;
    service: Service;
    others: Service[];
}) {
    const { t, lp } = useT();

    return (
        <>
            <Seo seo={seo} />
            <PageHeader title={service.title} intro={service.excerpt} />
            <Container className="grid gap-12 py-12 lg:grid-cols-12 lg:py-20">
                <div className="lg:col-span-8">
                    {service.images?.[0] && (
                        <Img
                            image={service.images[0]}
                            alt={service.title}
                            eager
                            className="mb-10 aspect-[16/9] w-full"
                            sizes="(min-width: 1024px) 66vw, 100vw"
                        />
                    )}
                    <Prose html={service.body} />
                    <Link
                        href={lp('/kontak')}
                        className="mt-10 inline-block rounded-sm bg-signal px-6 py-3 font-semibold text-white hover:bg-signal-dark"
                    >
                        {t('Hubungi kami')}
                    </Link>
                </div>
                {others.length > 0 && (
                    <aside className="lg:col-span-4">
                        <h2 className="text-lg font-semibold">
                            {t('Layanan lain')}
                        </h2>
                        <ul className="mt-3 border-t border-ink">
                            {others.map((o) => (
                                <li
                                    key={o.slug}
                                    className="border-b border-line"
                                >
                                    <Link
                                        href={lp(`/layanan/${o.slug}`)}
                                        className="block py-3 font-display text-xl font-semibold hover:text-signal"
                                    >
                                        {o.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}
            </Container>
            <ContactBand />
        </>
    );
}
