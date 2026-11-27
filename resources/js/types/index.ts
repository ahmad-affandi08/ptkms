export type Locale = 'id' | 'en';

export type Image = { thumb: string; large: string; alt: string };

export type Seo = {
    title?: string | null;
    description?: string | null;
    image?: string | null;
};

export type Site = {
    name: string;
    short_name: string;
    url: string;
    logo: string | null;
    og_image: string | null;
    about_short: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    office_hours: string | null;
    maps_url: string | null;
    social: Partial<
        Record<
            | 'instagram'
            | 'facebook'
            | 'youtube'
            | 'linkedin'
            | 'tokopedia'
            | 'shopee',
            string
        >
    >;
    turnstile_key: string | null;
};

export type Service = {
    slug: string;
    title: string;
    excerpt: string | null;
    image: Image | null;
    body?: string | null;
    images?: Image[];
};

export type Category = { slug: string; name: string };

export type Product = {
    slug: string;
    name: string;
    model: string | null;
    excerpt: string | null;
    category: Category | null;
    brand: string | null;
    image: Image | null;
    id?: number;
    description?: string | null;
    akl_number?: string | null;
    specs?: { label: string; value: string }[];
    images?: Image[];
    tokopedia_url?: string | null;
    shopee_url?: string | null;
};

export type Project = {
    slug: string;
    title: string;
    client: string | null;
    location: string | null;
    year: number | null;
    excerpt: string | null;
    image: Image | null;
    body?: string | null;
    images?: Image[];
};

export type Post = {
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string | null;
    image: Image | null;
    body?: string | null;
};

export type Partner = { name: string; url: string | null; logo: Image | null };
export type Faq = { question: string; answer: string };
export type Testimonial = {
    name: string;
    position: string | null;
    institution: string | null;
    quote: string;
};
export type Certificate = {
    title: string;
    number: string | null;
    issuer: string | null;
    valid_until: string | null;
    file: string | null;
};
export type GalleryItem = { caption: string | null; image: Image | null };

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
