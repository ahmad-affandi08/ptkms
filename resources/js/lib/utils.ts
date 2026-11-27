import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Path untuk bahasa aktif: Indonesia di root, English di /en. */
export function localePath(locale: Locale, path: string): string {
    if (locale === 'id') {
        return path;
    }

    return path === '/' ? '/en' : `/en${path}`;
}

/** URL halaman yang sama dalam bahasa lain. */
export function switchLocalePath(currentUrl: string, to: Locale): string {
    const path = currentUrl.replace(/^\/en(?=\/|$|\?)/, '') || '/';

    return localePath(to, path.startsWith('/') ? path : `/${path}`);
}

export function waLink(number: string, text?: string): string {
    return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function formatDate(date: string | null, locale: string) {
    return date
        ? new Date(date).toLocaleDateString(
              locale === 'en' ? 'en-GB' : 'id-ID',
              { day: 'numeric', month: 'long', year: 'numeric' },
          )
        : '';
}
