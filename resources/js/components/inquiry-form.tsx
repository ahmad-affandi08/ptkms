import { useForm, usePage } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect } from 'react';
import { useT } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TOPICS: [string, TranslationKey][] = [
    ['quotation', 'Permintaan penawaran'],
    ['service', 'Servis / perbaikan'],
    ['consultation', 'Konsultasi'],
    ['other', 'Lainnya'],
];

type Props = {
    product?: { id: number; name: string } | null;
    topic?: string | null;
};

export default function InquiryForm({ product, topic }: Props) {
    const { site, flash } = usePage().props;
    const { t } = useT();
    const form = useForm({
        name: '',
        institution: '',
        email: '',
        phone: '',
        topic: topic ?? 'quotation',
        product_id: product?.id ?? null,
        message: '',
        website: '',
    });

    useEffect(() => {
        if (
            !site.turnstile_key ||
            document.querySelector('script[data-turnstile]')
        ) {
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true;
        s.dataset.turnstile = '1';
        document.head.appendChild(s);
    }, [site.turnstile_key]);

    const err = form.errors as Record<string, string | undefined>;
    const a11y = (id: string) => ({
        id,
        'aria-invalid': !!err[id] || undefined,
        'aria-describedby': err[id] ? `${id}-error` : undefined,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = new FormData(e.currentTarget).get(
            'cf-turnstile-response',
        );
        form.transform((data) => ({ ...data, 'cf-turnstile-response': token }));
        form.post('/kontak', {
            preserveScroll: true,
            onSuccess: () => form.reset('message'),
        });
    };

    if (flash.success && form.wasSuccessful) {
        return (
            <div
                role="status"
                className="border-l-4 border-clinic bg-white px-6 py-8"
            >
                <p className="font-display text-2xl font-semibold">
                    {flash.success}
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={submit}
            noValidate
            className="grid gap-5 sm:grid-cols-2"
        >
            <Field
                id="name"
                label={t('Nama')}
                error={form.errors.name}
                required
            >
                <input
                    {...a11y('name')}
                    autoComplete="name"
                    required
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className={inputCls}
                />
            </Field>
            <Field
                id="institution"
                label={t('Instansi / rumah sakit')}
                error={form.errors.institution}
            >
                <input
                    {...a11y('institution')}
                    autoComplete="organization"
                    value={form.data.institution}
                    onChange={(e) =>
                        form.setData('institution', e.target.value)
                    }
                    className={inputCls}
                />
            </Field>
            <Field id="email" label="Email" error={form.errors.email} required>
                <input
                    {...a11y('email')}
                    type="email"
                    autoComplete="email"
                    required
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    className={inputCls}
                />
            </Field>
            <Field
                id="phone"
                label={t('Nomor HP / WhatsApp')}
                error={form.errors.phone}
            >
                <input
                    {...a11y('phone')}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.data.phone}
                    onChange={(e) => form.setData('phone', e.target.value)}
                    className={inputCls}
                />
            </Field>
            <Field
                id="topic"
                label={t('Keperluan')}
                error={form.errors.topic}
                required
            >
                <select
                    {...a11y('topic')}
                    value={form.data.topic}
                    onChange={(e) => form.setData('topic', e.target.value)}
                    className={inputCls}
                >
                    {TOPICS.map(([value, label]) => (
                        <option key={value} value={value}>
                            {t(label)}
                        </option>
                    ))}
                </select>
            </Field>
            {product && (
                <Field id="product" label={t('Produk yang ditanyakan')}>
                    <input
                        id="product"
                        readOnly
                        value={product.name}
                        className={cn(inputCls, 'bg-plate')}
                    />
                </Field>
            )}
            <Field
                id="message"
                label={t('Pesan')}
                error={form.errors.message}
                required
                className="sm:col-span-2"
            >
                <textarea
                    {...a11y('message')}
                    rows={6}
                    required
                    placeholder={t(
                        'Sebutkan merek, tipe alat, jumlah, atau kendala yang dialami.',
                    )}
                    value={form.data.message}
                    onChange={(e) => form.setData('message', e.target.value)}
                    className={inputCls}
                />
            </Field>

            {/* Honeypot: disembunyikan dari manusia, diisi oleh bot. */}
            <div aria-hidden className="absolute -left-[9999px]">
                <label>
                    Website
                    <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.data.website}
                        onChange={(e) =>
                            form.setData('website', e.target.value)
                        }
                    />
                </label>
            </div>

            {site.turnstile_key && (
                <div
                    className="cf-turnstile sm:col-span-2"
                    data-sitekey={site.turnstile_key}
                />
            )}

            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={form.processing}
                    className="rounded-sm bg-signal px-6 py-3 font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
                >
                    {form.processing ? t('Mengirim…') : t('Kirim pesan')}
                </button>
            </div>
        </form>
    );
}

const inputCls =
    'mt-1.5 block w-full rounded-sm border border-line bg-white px-3 py-2.5 text-ink placeholder:text-steel/70 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-signal-bright aria-[invalid=true]:border-signal';

function Field({
    id,
    label,
    error,
    required,
    className,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={className}>
            <label htmlFor={id} className="text-sm font-semibold">
                {label}
                {required && <span className="text-signal"> *</span>}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} className="mt-1 text-sm text-signal">
                    {error}
                </p>
            )}
        </div>
    );
}
