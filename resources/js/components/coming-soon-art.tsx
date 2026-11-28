import type { CSSProperties, ReactNode } from 'react';

export type Art = 'monitor' | 'hospital' | 'article' | 'photo';

/*
 * Ilustrasi garis beranimasi untuk ComingSoon. Garis memakai currentColor; aksen memakai
 * --art-accent (merah) dan --art-glow (oranye) agar versi pudar di kartu bayangan bisa satu warna.
 * Animasinya kelas art-* di app.css; keadaan dasarnya sudah utuh, jadi tanpa animasi tetap terbaca.
 */
const accent = { stroke: 'var(--art-accent, var(--color-signal))' };
const glow = { fill: 'var(--art-glow, var(--color-flame))' };
const delay = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

const ART: Record<Art, ReactNode> = {
    // Monitor pasien: garis EKG tergambar berulang, lampu indikator berkedip.
    monitor: (
        <>
            <rect x="10" y="8" width="100" height="60" rx="4" />
            <path d="M50 68 46 80M70 68l4 12M38 80h44" />
            <polyline
                pathLength={1}
                className="art-draw"
                style={accent}
                points="16,40 34,40 39,40 43,28 49,56 54,32 58,40 74,40 79,40 83,33 87,46 91,40 104,40"
            />
            <path d="M16 60h22M44 60h14" opacity=".35" />
            <circle
                className="art-blink"
                cx="101"
                cy="17"
                r="2.5"
                style={glow}
                stroke="none"
            />
        </>
    ),
    // Gedung rumah sakit: salib berdenyut, jendela menyala bergantian.
    hospital: (
        <>
            <path d="M8 82h104M24 82V30h72v52" />
            <path d="M18 30h84" />
            <rect x="52" y="62" width="16" height="20" />
            <g className="art-pulse" style={accent} strokeWidth="3">
                <path d="M60 9v14M53 16h14" />
            </g>
            {[
                [32, 38],
                [32, 50],
                [78, 38],
                [78, 50],
                [55, 38],
                [55, 50],
            ].map(([x, y], i) => (
                <rect
                    key={i}
                    className="art-glow"
                    style={{ ...glow, ...delay(i * 0.45) }}
                    x={x}
                    y={y}
                    width="10"
                    height="7"
                />
            ))}
        </>
    ),
    // Artikel: judul lalu baris teks seperti sedang diketik.
    article: (
        <>
            <path d="M30 6h46l14 14v64H30z" />
            <path d="M76 6v14h14" />
            <path
                pathLength={1}
                className="art-draw"
                style={{ ...accent, ...delay(0) }}
                strokeWidth="4"
                d="M39 24h28"
            />
            <g opacity=".55">
                {[36, 45, 54, 63, 72].map((y, i) => (
                    <path
                        key={y}
                        pathLength={1}
                        className="art-draw"
                        style={delay(0.2 + i * 0.18)}
                        d={`M39 ${y}h${i === 4 ? 24 : i % 2 ? 34 : 42}`}
                    />
                ))}
            </g>
        </>
    ),
    // Kamera: lensa berdenyut, flash menyala.
    photo: (
        <>
            <path d="M14 30a6 6 0 0 1 6-6h18l6-10h32l6 10h18a6 6 0 0 1 6 6v44a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" />
            <circle cx="60" cy="51" r="17" />
            <circle
                className="art-pulse"
                style={accent}
                cx="60"
                cy="51"
                r="8"
            />
            <circle
                className="art-blink"
                cx="94"
                cy="34"
                r="3"
                style={glow}
                stroke="none"
            />
            <path
                className="art-flash"
                style={accent}
                d="M101 18l4-4M106 27h6M94 13V7"
            />
        </>
    ),
};

export default function ComingSoonArt({
    art,
    className,
}: {
    art: Art;
    className?: string;
}) {
    return (
        <svg
            aria-hidden
            viewBox="0 0 120 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {ART[art]}
        </svg>
    );
}
