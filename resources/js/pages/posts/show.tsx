import { ContactBand, Container, Prose } from '@/components/blocks';
import Img from '@/components/img';
import Seo from '@/components/seo';
import { useT } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import type { Post, Seo as SeoData } from '@/types';

export default function PostShow({ seo, post }: { seo: SeoData; post: Post }) {
    const { locale } = useT();

    return (
        <>
            <Seo seo={seo} />
            <article>
                <Container className="max-w-3xl pt-12 lg:pt-20">
                    <time
                        dateTime={post.published_at ?? undefined}
                        className="text-sm text-steel"
                    >
                        {formatDate(post.published_at, locale)}
                    </time>
                    <h1 className="mt-2 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="mt-4 text-xl text-steel">
                            {post.excerpt}
                        </p>
                    )}
                </Container>
                {post.image && (
                    <Container className="mt-10 max-w-5xl">
                        <Img
                            image={post.image}
                            alt={post.title}
                            eager
                            className="aspect-[16/9] w-full"
                        />
                    </Container>
                )}
                <Container className="max-w-3xl py-12">
                    <Prose
                        html={post.body}
                        className="text-[1.125rem] leading-[1.7]"
                    />
                </Container>
            </article>
            <ContactBand />
        </>
    );
}
