import { Container, Empty, PageHeader } from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import type { GalleryItem, Seo as SeoData } from '@/types';

export default function Gallery({
    seo,
    items,
}: {
    seo: SeoData;
    items: GalleryItem[];
}) {
    const { t } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Galeri')} />
            <PageHeader title={t('Galeri')} />
            <Container className="py-12 lg:py-16">
                {items.length === 0 && <Empty>{t('Belum ada foto.')}</Empty>}
                <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {items.map((item, i) => (
                        <li key={i} className="mb-4 break-inside-avoid">
                            <figure>
                                <a
                                    href={item.image?.large}
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Img
                                        image={item.image}
                                        alt={item.caption ?? ''}
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        className="w-full"
                                    />
                                </a>
                                {item.caption && (
                                    <figcaption className="mt-2 text-sm text-steel">
                                        {item.caption}
                                    </figcaption>
                                )}
                            </figure>
                        </li>
                    ))}
                </ul>
            </Container>
        </>
    );
}
