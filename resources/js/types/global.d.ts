import type { Locale, Site } from '@/types';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            locale: Locale;
            site: Site;
            flash: { success?: string | null };
            [key: string]: unknown;
        };
    }
}
