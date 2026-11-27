import { Link } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';
import {
    buttonOutline,
    ComingSoon,
    Container,
    PageHeader,
    Pagination,
} from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import type { Paginated, Post, Seo as SeoData } from '@/types';

export default function Posts({
    seo,
    posts,
}: {
    seo: SeoData;
    posts: Paginated<Post>;
}) {
    const { t, lp, locale } = useT();

    return (
        <>
            <Seo seo={seo} fallbackTitle={t('Artikel')} />
            <PageHeader title={t('Artikel')} />
            <Container className="py-12 lg:py-16">
                {posts.data.length === 0 && (
                    <ComingSoon
                        icon={Newspaper}
                        aspect="aspect-[3/2]"
                        title={t('Artikel pertama segera terbit')}
                        text={t(
                            'Kabar dan tulisan dari tim KMS akan muncul di sini.',
                        )}
                    >
                        <Link href={lp('/kontak')} className={buttonOutline}>
                            {t('Hubungi kami')}
                        </Link>
                    </ComingSoon>
                )}
                <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                    {posts.data.map((p) => (
                        <article key={p.slug} className="group relative">
                            <Img
                                image={p.image}
                                alt={p.title}
                                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                className="aspect-[3/2] w-full"
                            />
                            <time
                                dateTime={p.published_at ?? undefined}
                                className="mt-4 block text-sm text-steel"
                            >
                                {formatDate(p.published_at, locale)}
                            </time>
                            <h2 className="mt-1 text-2xl leading-snug font-semibold">
                                <Link
                                    href={lp(`/artikel/${p.slug}`)}
                                    className="group-hover:text-signal after:absolute after:inset-0"
                                >
                                    {p.title}
                                </Link>
                            </h2>
                            {p.excerpt && (
                                <p className="mt-2 text-steel">{p.excerpt}</p>
                            )}
                        </article>
                    ))}
                </div>
                <Pagination page={posts} />
            </Container>
        </>
    );
}
