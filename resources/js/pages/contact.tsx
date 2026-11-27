import { usePage } from '@inertiajs/react';
import { Container, PageHeader } from '@/components/blocks';
import InquiryForm from '@/components/inquiry-form';
import Seo from '@/components/seo';
import { WhatsAppIcon } from '@/components/site-layout';
import { useT } from '@/lib/i18n';
import { waLink } from '@/lib/utils';
import type { Seo as SeoData } from '@/types';

type Props = {
    seo: SeoData;
    product: { id: number; name: string } | null;
    topic: string | null;
};

export default function Contact({ seo, product, topic }: Props) {
    const { site } = usePage().props;
    const { t } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Kontak')} />
            <PageHeader
                title={t('Hubungi kami')}
                intro={t(
                    'Kirim pesan dan kami balas pada jam kerja, atau langsung chat lewat WhatsApp.',
                )}
            />
            <Container className="grid gap-14 py-12 lg:grid-cols-12 lg:py-16">
                <div className="lg:col-span-7">
                    <InquiryForm product={product} topic={topic} />
                </div>

                <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
                    {site.whatsapp && (
                        <a
                            href={waLink(
                                site.whatsapp,
                                product
                                    ? `Halo, saya ingin menanyakan ${product.name}`
                                    : undefined,
                            )}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-3 rounded-sm bg-clinic px-5 py-4 font-semibold text-white hover:bg-[#256649]"
                        >
                            <WhatsAppIcon className="size-6" />
                            {t('Chat WhatsApp')}
                        </a>
                    )}
                    <dl className="space-y-6 border-t border-ink pt-6">
                        {site.address && (
                            <div>
                                <dt className="text-sm text-steel">
                                    {t('Alamat')}
                                </dt>
                                <dd className="mt-1 whitespace-pre-line">
                                    {site.address}
                                </dd>
                                {site.maps_url && (
                                    <dd className="mt-2">
                                        <a
                                            href={site.maps_url}
                                            target="_blank"
                                            rel="noopener"
                                            className="font-semibold text-signal underline underline-offset-4"
                                        >
                                            {t('Buka di Google Maps')}
                                        </a>
                                    </dd>
                                )}
                            </div>
                        )}
                        {site.office_hours && (
                            <div>
                                <dt className="text-sm text-steel">
                                    {t('Jam operasional')}
                                </dt>
                                <dd className="mt-1">{site.office_hours}</dd>
                            </div>
                        )}
                        {site.phone && (
                            <div>
                                <dt className="text-sm text-steel">
                                    {t('Telepon')}
                                </dt>
                                <dd className="mt-1">
                                    <a
                                        href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
                                        className="hover:text-signal"
                                    >
                                        {site.phone}
                                    </a>
                                </dd>
                            </div>
                        )}
                        {site.email && (
                            <div>
                                <dt className="text-sm text-steel">Email</dt>
                                <dd className="mt-1">
                                    <a
                                        href={`mailto:${site.email}`}
                                        className="hover:text-signal"
                                    >
                                        {site.email}
                                    </a>
                                </dd>
                            </div>
                        )}
                    </dl>
                </aside>
            </Container>
        </>
    );
}
