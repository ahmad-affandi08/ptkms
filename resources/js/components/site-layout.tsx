import { Link, usePage } from '@inertiajs/react';
import { Check, ChevronDown, Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { SOCIAL_ICONS, SocialIcon } from '@/components/brand-icons';
import { useT } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';
import type { Locale } from '@/types';
import { cn, switchLocalePath, waLink } from '@/lib/utils';

const NAV: [string, TranslationKey][] = [
    ['/layanan', 'Layanan'],
    ['/produk', 'Produk'],
    ['/proyek', 'Proyek'],
    ['/tentang', 'Tentang'],
    ['/artikel', 'Artikel'],
    ['/kontak', 'Kontak'],
];

export default function SiteLayout({ children }: { children: ReactNode }) {
    const page = usePage();
    const { site } = page.props;
    const { t, lp, locale } = useT();
    const [open, setOpen] = useState(false);
    const path = page.url.split('?')[0];

    useEffect(() => setOpen(false), [path]);

    const isActive = (href: string) =>
        path === lp(href) || path.startsWith(lp(href) + '/');

    return (
        <div className="flex min-h-dvh flex-col">
            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
            >
                {t('Langsung ke konten')}
            </a>

            <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur [view-transition-name:site-header] supports-[backdrop-filter]:bg-paper/85">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:h-20">
                    <Link
                        href={lp('/')}
                        className="flex shrink-0 items-center gap-2.5"
                        aria-label={site.short_name}
                    >
                        {site.logo && (
                            <img
                                src={site.logo}
                                alt=""
                                width={36}
                                height={38}
                                className="h-9 w-auto lg:h-11"
                            />
                        )}
                        <span className="font-display text-lg leading-none font-semibold tracking-tight">
                            {site.short_name}
                        </span>
                    </Link>

                    <nav aria-label="Utama" className="ml-auto hidden lg:block">
                        <ul className="flex items-center gap-1">
                            {NAV.map(([href, label]) => (
                                <li key={href}>
                                    <Link
                                        href={lp(href)}
                                        aria-current={
                                            isActive(href) ? 'page' : undefined
                                        }
                                        className={cn(
                                            // Garis oranye tumbuh dari kiri saat hover, keluar ke kanan saat kursor pergi.
                                            'relative block px-3 py-2 text-[0.95rem] font-medium text-ink-soft hover:text-ink',
                                            'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-right after:scale-x-0 after:rounded-full after:bg-signal-bright after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100',
                                            isActive(href) &&
                                                'text-ink after:scale-x-100',
                                        )}
                                    >
                                        {t(label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <LanguageSwitch url={page.url} current={locale} />
                        <Link
                            href={lp('/kontak?perlu=quotation')}
                            className="hidden h-10 items-center rounded-sm bg-signal px-4 text-sm font-semibold text-white hover:bg-signal-dark sm:inline-flex"
                        >
                            {t('Minta penawaran')}
                        </Link>
                        <button
                            type="button"
                            className="grid size-10 place-items-center lg:hidden"
                            aria-expanded={open}
                            aria-controls="menu-mobile"
                            aria-label={open ? t('Tutup menu') : t('Menu')}
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? (
                                <X className="size-6" />
                            ) : (
                                <Menu className="size-6" />
                            )}
                        </button>
                    </div>
                </div>

                <nav
                    id="menu-mobile"
                    aria-label="Mobile"
                    hidden={!open}
                    className="border-t border-line lg:hidden"
                >
                    <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
                        {NAV.map(([href, label]) => (
                            <li key={href}>
                                <Link
                                    href={lp(href)}
                                    aria-current={
                                        isActive(href) ? 'page' : undefined
                                    }
                                    className={cn(
                                        'block border-b border-line py-3 font-display text-xl font-semibold',
                                        isActive(href) && 'text-signal',
                                    )}
                                >
                                    {t(label)}
                                </Link>
                            </li>
                        ))}
                        <li className="py-4 sm:hidden">
                            <Link
                                href={lp('/kontak?perlu=quotation')}
                                className="block rounded-sm bg-signal px-4 py-3 text-center font-semibold text-white"
                            >
                                {t('Minta penawaran')}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main id="konten" className="flex-1">
                {children}
            </main>

            <SiteFooter />

            {site.whatsapp && (
                <a
                    href={waLink(site.whatsapp)}
                    target="_blank"
                    rel="noopener"
                    aria-label={t('Chat WhatsApp')}
                    className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-clinic text-white shadow-lg shadow-ink/20 hover:bg-clinic-dark sm:right-6 sm:bottom-6"
                >
                    <WhatsAppIcon className="size-7" />
                </a>
            )}
        </div>
    );
}

function SiteFooter() {
    const { site } = usePage().props;
    const { t, lp } = useT();
    const social = Object.entries(site.social).filter(
        ([k]) => !['tokopedia', 'shopee'].includes(k),
    );
    const shops = Object.entries(site.social).filter(([k]) =>
        ['tokopedia', 'shopee'].includes(k),
    );
    const shopName = (k: string) => (k === 'shopee' ? 'Shopee' : 'Tokopedia');

    return (
        <footer className="bg-flame text-ink [--color-signal-bright:var(--color-ink)]">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
                <div className="md:col-span-5">
                    <p className="font-display text-2xl font-semibold">
                        {site.name}
                    </p>
                    {site.about_short && (
                        <p className="mt-3 max-w-md text-[0.95rem]">
                            {site.about_short}
                        </p>
                    )}
                </div>

                <address className="text-[0.95rem] not-italic md:col-span-4">
                    {site.address && (
                        <p className="whitespace-pre-line">{site.address}</p>
                    )}
                    <p className="mt-3 space-y-1">
                        {site.phone && (
                            <a
                                className="block hover:underline"
                                href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
                            >
                                {site.phone}
                            </a>
                        )}
                        {site.email && (
                            <a
                                className="block hover:underline"
                                href={`mailto:${site.email}`}
                            >
                                {site.email}
                            </a>
                        )}
                    </p>
                    {site.office_hours && (
                        <p className="mt-3">{site.office_hours}</p>
                    )}
                </address>

                <div className="grid grid-cols-2 gap-6 text-[0.95rem] md:col-span-3 md:grid-cols-1">
                    {social.length > 0 && (
                        <div>
                            <p className="font-semibold">{t('Ikuti kami')}</p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {social.map(([k, href]) => {
                                    const icon = SOCIAL_ICONS[k];

                                    return (
                                        <li key={k}>
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener"
                                                aria-label={icon?.name ?? k}
                                                title={icon?.name ?? k}
                                                className="grid size-11 place-items-center rounded-sm border border-ink/30 hover:border-white hover:bg-white"
                                            >
                                                {icon ? (
                                                    <SocialIcon
                                                        path={icon.path}
                                                        className="size-5"
                                                    />
                                                ) : (
                                                    k.charAt(0).toUpperCase()
                                                )}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    {shops.length > 0 && (
                        <div>
                            <p className="font-semibold">
                                {t('Belanja online')}
                            </p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {shops.map(([k, href]) => (
                                    <li key={k}>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener"
                                            className="flex h-11 items-center rounded-sm bg-white px-3.5 outline-offset-2 hover:ring-2 hover:ring-ink/40"
                                        >
                                            <img
                                                src={`/images/brands/${k}.svg`}
                                                alt={shopName(k)}
                                                loading="lazy"
                                                className={cn(
                                                    'w-auto',
                                                    k === 'shopee'
                                                        ? 'h-6'
                                                        : 'h-[18px]',
                                                )}
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="border-t border-ink/15">
                <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 py-5 pr-20 pl-4 text-sm sm:pr-24 sm:pl-6">
                    <p>
                        © {new Date().getFullYear()} {site.name}.{' '}
                        {t('Semua hak dilindungi.')}
                    </p>
                    <Link href={lp('/galeri')} className="hover:underline">
                        {t('Galeri')}
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className={className}
        >
            <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.43-9.43 2.52 0 4.88.98 6.66 2.77a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42zm8.02-17.45A11.27 11.27 0 0 0 12.05.72C5.8.72.72 5.8.72 12.05c0 2 .52 3.95 1.52 5.66L.62 23.6l6.03-1.58a11.3 11.3 0 0 0 5.4 1.38h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01z" />
        </svg>
    );
}

const LANGUAGES: { locale: Locale; code: string; name: string }[] = [
    { locale: 'id', code: 'ID', name: 'Bahasa Indonesia' },
    { locale: 'en', code: 'EN', name: 'English' },
];

/** Dropdown pilihan bahasa dengan bendera negara. */
function LanguageSwitch({ url, current }: { url: string; current: Locale }) {
    const { t } = useT();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const active = LANGUAGES.find((l) => l.locale === current) ?? LANGUAGES[0];

    useEffect(() => setOpen(false), [url]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                ref.current?.querySelector('button')?.focus();
            }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={`${t('Bahasa')}: ${active.name}`}
                onClick={() => setOpen((v) => !v)}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-sm border border-line bg-white px-3 text-sm font-semibold hover:border-ink/40"
            >
                <Flag locale={active.locale} />
                <span>{active.code}</span>
                <ChevronDown
                    aria-hidden
                    className={cn(
                        'size-3.5 text-steel transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>
            {open && (
                <ul
                    id={menuId}
                    className="absolute right-0 z-50 mt-1 min-w-44 rounded-sm border border-line bg-white py-1 shadow-lg shadow-ink/10"
                >
                    {LANGUAGES.map(({ locale, name }) => (
                        <li key={locale}>
                            <Link
                                href={switchLocalePath(url, locale)}
                                hrefLang={locale}
                                lang={locale}
                                aria-current={
                                    locale === current ? 'true' : undefined
                                }
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-2.5 text-sm whitespace-nowrap hover:bg-paper',
                                    locale === current &&
                                        'font-semibold text-signal',
                                )}
                            >
                                <Flag locale={locale} />
                                {name}
                                {locale === current && (
                                    <Check
                                        aria-hidden
                                        className="ml-auto size-4"
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Flag({ locale }: { locale: Locale }) {
    const id = 'flag' + useId().replace(/[^a-zA-Z0-9]/g, '');
    const box = 'size-5 shrink-0 rounded-full ring-1 ring-ink/15';

    if (locale === 'id') {
        return (
            <svg
                viewBox="0 0 3 2"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
                className={box}
            >
                <rect width="3" height="1" fill="#CE1126" />
                <rect y="1" width="3" height="1" fill="#fff" />
            </svg>
        );
    }

    // Union Jack (Inggris)
    return (
        <svg
            viewBox="0 0 60 30"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
            className={box}
        >
            <clipPath id={`${id}t`}>
                <path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z" />
            </clipPath>
            <path d="M0,0v30h60v-30z" fill="#012169" />
            <path d="M0,0L60,30M60,0L0,30" stroke="#fff" strokeWidth="6" />
            <path
                d="M0,0L60,30M60,0L0,30"
                clipPath={`url(#${id}t)`}
                stroke="#C8102E"
                strokeWidth="4"
            />
            <path d="M30,0v30M0,15h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0v30M0,15h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
    );
}
