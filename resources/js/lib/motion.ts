/**
 * Animasi situs: GSAP (ScrollTrigger + SplitText) dan Lenis untuk smooth scroll.
 * Dimuat dinamis dari SiteLayout, jadi tidak ikut SSR. Pemilih di sini harus sama dengan
 * aturan `html.motion` di app.css yang menyembunyikan elemen sebelum JS jalan.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const ITEMS = ':is(h2 + p, li, article):not(:where(li, article) *)';
const MAGNETIC =
    'a.rounded-sm[class*="bg-signal"], button.rounded-sm[class*="bg-signal"], a.rounded-sm[class*="bg-clinic"], a.rounded-full[class*="bg-clinic"]';

let lenis: Lenis | null = null;
let firstPage = true;

function startLenis() {
    if (lenis) {
        return;
    }

    lenis = new Lenis({ anchors: true });
    lenis.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Gambar lazy dan font mengubah tinggi halaman; posisi trigger perlu dihitung ulang.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    void document.fonts.ready.then(refresh);
    document.addEventListener(
        'load',
        (e) => e.target instanceof HTMLImageElement && refresh(),
        true,
    );
}

/** Judul dipecah per baris lalu tiap baris naik dari balik mask. Dikembalikan utuh setelah selesai. */
function lineReveal(el: HTMLElement, vars: gsap.TweenVars) {
    gsap.set(el, { autoAlpha: 1 });
    const split = SplitText.create(el, { type: 'lines', mask: 'lines' });

    return gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.09,
        ease: 'expo.out',
        onComplete: () => split.revert(),
        ...vars,
    });
}

/** Angka [data-count] di hero (mis. "18+", "1.200") dihitung naik. */
function countUp(
    dd: HTMLElement,
    tl: gsap.core.Timeline,
    cleanups: (() => void)[],
) {
    const node = dd.firstChild;
    const m =
        node instanceof Text && node.nodeValue?.match(/^(\d[\d.]*)(\D*)$/);

    if (!m) {
        return;
    }

    const original = node.nodeValue;
    const end = Number(m[1].replace(/\./g, ''));
    const dotted = m[1].includes('.');
    const o = { v: 0 };

    // Teks node yang sama dipakai React, jadi hanya nilainya yang diubah, bukan node-nya.
    tl.to(
        o,
        {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
                const n = Math.round(o.v);
                node.nodeValue =
                    (dotted ? n.toLocaleString('id-ID') : n) + m[2];
            },
        },
        0.5,
    );
    cleanups.push(() => (node.nodeValue = original));
}

export function animatePage(main: HTMLElement): () => void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return () => {};
    }

    startLenis();
    const cleanups: (() => void)[] = [];
    // Pindah halaman lewat Inertia: tunggu tirai View Transition sebelum hero masuk.
    const delay = firstPage ? 0.1 : 0.45;
    firstPage = false;

    const ctx = gsap.context(() => {
        const [hero, ...rest] = [...main.children] as HTMLElement[];

        /* Hero: judul per baris, lalu teks, tombol dan kotak spesifikasi; foto terbuka dari bawah. */
        if (hero) {
            const tl = gsap.timeline({ delay });
            const h1 = hero.querySelector<HTMLElement>('h1');

            hero.querySelectorAll<HTMLElement>(':scope > figure').forEach(
                (fig) => {
                    const img = fig.querySelector('img');
                    // clip-path tidak memotong area scroll; foto yang diperbesar harus dipotong overflow.
                    gsap.set(fig, { autoAlpha: 1, overflow: 'hidden' });
                    tl.fromTo(
                        fig,
                        { clipPath: 'inset(100% 0% 0% 0%)' },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            duration: 1.5,
                            ease: 'expo.inOut',
                        },
                        0,
                    );

                    if (img) {
                        tl.fromTo(
                            img,
                            { scale: 1.4 },
                            { scale: 1.12, duration: 2, ease: 'expo.out' },
                            0.2,
                        );
                        // Parallax: foto bergerak lebih lambat dari halaman.
                        gsap.to(img, {
                            yPercent: 6,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: hero,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: true,
                            },
                        });
                    }
                },
            );

            if (h1) {
                tl.add(lineReveal(h1, {}), 0.15);
                const after = [...hero.querySelectorAll<HTMLElement>('h1 ~ *')];
                tl.fromTo(
                    after,
                    { y: 40, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 1.1,
                        stagger: 0.12,
                        ease: 'power3.out',
                    },
                    0.45,
                );
                hero.querySelectorAll<HTMLElement>('[data-count]').forEach(
                    (el) => countUp(el, tl, cleanups),
                );
            }
        }

        /* Bagian bawah: judul per baris, kartu dan paragraf naik bergantian, foto terbuka dari bawah. */
        rest.forEach((root) => {
            root.querySelectorAll<HTMLElement>('h2').forEach((h2) =>
                lineReveal(h2, {
                    scrollTrigger: {
                        trigger: h2,
                        start: 'top 88%',
                        once: true,
                    },
                }),
            );

            const items = [...root.querySelectorAll<HTMLElement>(ITEMS)];
            gsap.set(items, { y: 60, autoAlpha: 0 });
            ScrollTrigger.batch(items, {
                start: 'top 92%',
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 1.1,
                        stagger: 0.12,
                        ease: 'power3.out',
                        overwrite: true,
                    }),
            });

            root.querySelectorAll('img').forEach((img) => {
                const frame = img.parentElement;

                // Logo klien/merek kecil cukup ikut kartunya.
                if (!frame || img.getBoundingClientRect().height < 120) {
                    return;
                }

                // Bingkai khusus foto: bingkainya yang dibuka dan fotonya mengecil di dalam.
                // Foto langsung di dalam kartu: fotonya sendiri yang dibuka, kartunya tidak.
                const framed = frame.children.length === 1;
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: img,
                        start: 'top 90%',
                        once: true,
                    },
                });
                tl.fromTo(
                    framed ? frame : img,
                    { clipPath: 'inset(0% 0% 100% 0%)' },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        duration: 1.4,
                        ease: 'expo.inOut',
                    },
                );
                if (framed) {
                    gsap.set(frame, { overflow: 'hidden' });
                    tl.fromTo(
                        img,
                        { scale: 1.35 },
                        { scale: 1, duration: 1.8, ease: 'expo.out' },
                        0,
                    );
                }
            });
        });

        /* Tombol utama sedikit mengikuti kursor (hanya mouse). */
        if (matchMedia('(pointer: fine)').matches) {
            document.querySelectorAll<HTMLElement>(MAGNETIC).forEach((el) => {
                const x = gsap.quickTo(el, 'x', {
                    duration: 0.6,
                    ease: 'power3.out',
                });
                const y = gsap.quickTo(el, 'y', {
                    duration: 0.6,
                    ease: 'power3.out',
                });
                const move = (e: PointerEvent) => {
                    const r = el.getBoundingClientRect();
                    x((e.clientX - r.left - r.width / 2) * 0.3);
                    y((e.clientY - r.top - r.height / 2) * 0.4);
                };
                const leave = () => {
                    x(0);
                    y(0);
                };
                el.addEventListener('pointermove', move);
                el.addEventListener('pointerleave', leave);
                cleanups.push(() => {
                    el.removeEventListener('pointermove', move);
                    el.removeEventListener('pointerleave', leave);
                });
            });
        }
    }, main);

    lenis?.resize();
    ScrollTrigger.refresh();

    return () => {
        cleanups.forEach((fn) => fn());
        ctx.revert();
    };
}
