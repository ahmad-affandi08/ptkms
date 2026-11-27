import { createInertiaApp } from '@inertiajs/react';
import SiteLayout from '@/components/site-layout';

const appName = import.meta.env.VITE_APP_NAME || 'PT KMS Indonesia';

void createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
    layout: () => SiteLayout,
    strictMode: true,
    progress: { color: '#e06a1a' },
});
