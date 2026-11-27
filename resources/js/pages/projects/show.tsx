import { ContactBand, Container, PageHeader, Prose } from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import type { Project, Seo as SeoData } from '@/types';

export default function ProjectShow({
    seo,
    project,
}: {
    seo: SeoData;
    project: Project;
}) {
    const { t } = useT();
    const facts = [
        [t('Klien'), project.client],
        [t('Lokasi'), project.location],
        [t('Tahun'), project.year],
    ].filter(([, v]) => v);

    return (
        <>
            <Seo seo={seo} />
            <PageHeader title={project.title} intro={project.excerpt}>
                {facts.length > 0 && (
                    <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
                        {facts.map(([k, v]) => (
                            <div key={String(k)}>
                                <dt className="text-sm text-steel">{k}</dt>
                                <dd className="font-display text-xl font-semibold">
                                    {v}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </PageHeader>
            <Container className="py-12 lg:py-16">
                {project.images?.[0] && (
                    <Img
                        image={project.images[0]}
                        alt={project.title}
                        eager
                        className="aspect-[16/9] w-full"
                    />
                )}
                <Prose html={project.body} className="mt-12" />
                {(project.images?.length ?? 0) > 1 && (
                    <div className="mt-12 grid gap-4 sm:grid-cols-2">
                        {project.images!.slice(1).map((img) => (
                            <Img
                                key={img.thumb}
                                image={img}
                                alt={project.title}
                                sizes="(min-width: 640px) 50vw, 100vw"
                                className="aspect-[4/3] w-full"
                            />
                        ))}
                    </div>
                )}
            </Container>
            <ContactBand />
        </>
    );
}
