import type { Image } from '@/types';
import { cn } from '@/lib/utils';

type Props = {
    image: Image | null | undefined;
    alt?: string;
    sizes?: string;
    className?: string;
    eager?: boolean;
};

/** Gambar dari media library: versi thumb (800px) dan large (1920px), format WebP. */
export default function Img({
    image,
    alt,
    sizes = '100vw',
    className,
    eager,
}: Props) {
    if (!image) {
        return <div aria-hidden className={cn('bg-plate', className)} />;
    }

    return (
        <img
            src={image.large}
            srcSet={`${image.thumb} 800w, ${image.large} 1920w`}
            sizes={sizes}
            alt={image.alt || alt || ''}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={cn('bg-plate object-cover', className)}
        />
    );
}
