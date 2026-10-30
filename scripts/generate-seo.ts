/**
 * Post-build SEO generator.
 *
 * This is a Vite/React SPA — without this script, every route is served the
 * exact same static <head> (from index.html) until React mounts and the
 * useSEO() hook swaps in the real title/description client-side. Most
 * crawlers (Googlebot included, per Search Console timing) render JS fine,
 * but social-share bots, Bing, and Google's *initial* fast crawl often only
 * see the static HTML — which is why every page was showing the same
 * generic snippet in search results.
 *
 * This script runs after `vite build` and, for every real route in the app,
 * writes a `dist/<route>/index.html` file that's a copy of the built
 * index.html with the <title>, meta description, canonical link, OG/Twitter
 * tags and JSON-LD swapped for that page's real content — sourced directly
 * from src/lib/data.ts so it can never drift out of sync with the app.
 *
 * It also (re)generates dist/sitemap.xml from the same source of truth.
 *
 * The React app and its useSEO() hook are unchanged and still run exactly
 * as before for real visitors — this only affects what a crawler sees
 * before JavaScript executes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { services, workItems, blogPosts } from '../src/lib/data';

const SITE = 'https://primexpixel.in';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.resolve(ROOT, 'dist');

interface RouteMeta {
  url: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: object | object[];
  priority: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

const routes: RouteMeta[] = [];

// ---- Static top-level pages -------------------------------------------------
routes.push({
  url: '/',
  title: 'PrimeXPixel — Website Development & Digital Marketing Agency in Kurla, Mumbai',
  description: 'PrimeXPixel is a Mumbai-based website development, digital marketing, UI/UX design and branding agency serving Kurla, Bandra, Chembur, Andheri and all of Mumbai. Free consultation.',
  priority: '1.0',
  changefreq: 'weekly',
});

routes.push({
  url: '/about',
  title: 'About PrimeXPixel — Web Design & Marketing Agency in Kurla, Mumbai',
  description: 'PrimeXPixel is a Mumbai-based digital growth agency founded in 2019, serving Kurla, Bandra, Chembur and businesses across Mumbai with strategy-led websites, branding and marketing.',
  priority: '0.7',
  changefreq: 'monthly',
});

routes.push({
  url: '/services',
  title: 'Website Development, Digital Marketing & UI/UX Design Services | PrimeXPixel Mumbai',
  description: 'Website development, ecommerce, UI/UX design, branding, video editing and digital marketing services for businesses in Kurla, Mumbai and beyond. Free consultation.',
  priority: '0.9',
  changefreq: 'weekly',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Service', name: s.title, description: s.desc, url: `${SITE}/services/${s.slug}` },
    })),
  },
});

routes.push({
  url: '/work',
  title: 'Our Work — Website Design & Branding Portfolio | PrimeXPixel Mumbai',
  description: 'Explore case studies from PrimeXPixel — websites, branding and marketing engagements delivered for businesses across Kurla, Bandra, Chembur and Mumbai.',
  priority: '0.8',
  changefreq: 'weekly',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'PrimeXPixel Portfolio',
    url: `${SITE}/work`,
    hasPart: workItems.map((w) => ({ '@type': 'CreativeWork', name: w.title, url: `${SITE}/work/${w.slug}` })),
  },
});

routes.push({
  url: '/testimonials',
  title: 'Client Reviews & Testimonials — PrimeXPixel Mumbai',
  description: 'See what businesses across Mumbai, Kurla and Chembur say about working with PrimeXPixel on their website, branding and digital marketing projects.',
  priority: '0.6',
  changefreq: 'monthly',
});

routes.push({
  url: '/blog',
  title: 'Blog — Website Design, SEO & Digital Marketing in Mumbai | PrimexPixel',
  description: 'Insights on website development, UI/UX, SEO and digital marketing for businesses across Mumbai — Kurla, Chembur, Bandra, Mahim, Dadar, Andheri & more.',
  priority: '0.8',
  changefreq: 'weekly',
});

routes.push({
  url: '/contact',
  title: 'Contact PrimeXPixel — Website & Marketing Agency in Kurla, Mumbai',
  description: 'Get in touch with PrimeXPixel, Kurla East, Mumbai. Call, WhatsApp or email for a free consultation on website development, digital marketing, UI/UX design and branding.',
  priority: '0.7',
  changefreq: 'monthly',
  jsonLd: { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact PrimeXPixel', url: `${SITE}/contact` },
});

// ---- Service detail pages ---------------------------------------------------
for (const s of services) {
  routes.push({
    url: `/services/${s.slug}`,
    title: `${s.title} Company in Mumbai & Kurla | PrimeXPixel`,
    description: `${s.desc} Serving Kurla, Bandra, Chembur, Andheri and businesses across Mumbai.`,
    type: 'article',
    priority: '0.9',
    changefreq: 'weekly',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.title,
      description: s.desc,
      serviceType: s.title,
      provider: {
        '@type': 'ProfessionalService',
        name: 'PrimeXPixel',
        address: { '@type': 'PostalAddress', addressLocality: 'Kurla East', addressRegion: 'Maharashtra', addressCountry: 'IN' },
      },
      areaServed: [{ '@type': 'City', name: 'Mumbai' }, { '@type': 'Place', name: 'Kurla' }],
      url: `${SITE}/services/${s.slug}`,
    },
  });
}

// ---- Work / case study pages ------------------------------------------------
for (const w of workItems) {
  routes.push({
    url: `/work/${w.slug}`,
    title: `${w.title} — Case Study | PrimexPixel`,
    description: `${w.title}: ${w.outcome}`,
    image: w.detail?.cover,
    type: 'article',
    priority: '0.6',
    changefreq: 'monthly',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: w.title,
      about: w.detail?.subtitle || w.title,
      creator: { '@type': 'Organization', name: 'PrimexPixel' },
      url: `${SITE}/work/${w.slug}`,
    },
  });
}

// ---- Blog posts --------------------------------------------------------------
for (const p of blogPosts) {
  routes.push({
    url: `/blog/${p.slug}`,
    title: p.metaTitle,
    description: p.metaDescription,
    image: p.image,
    type: 'article',
    priority: '0.7',
    changefreq: 'weekly',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        datePublished: p.iso,
        dateModified: p.iso,
        articleSection: p.category,
        keywords: p.keywords.join(', '),
        inLanguage: 'en-IN',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${p.slug}` },
        author: { '@type': 'Organization', name: 'PrimexPixel' },
        publisher: {
          '@type': 'Organization',
          name: 'PrimexPixel',
          logo: { '@type': 'ImageObject', url: `${SITE}/brand/mark-square.png` },
        },
        about: { '@type': 'Place', name: `${p.area}, Mumbai` },
      },
    ],
  });
}

// ---- Write per-route static HTML for crawlers -------------------------------
function escapeAttr(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const templatePath = path.join(DIST, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('[generate-seo] dist/index.html not found — run `vite build` first.');
  process.exit(1);
}
const template = fs.readFileSync(templatePath, 'utf-8');

let written = 0;
for (const r of routes) {
  if (r.url === '/') continue; // homepage IS dist/index.html already

  const url = `${SITE}${r.url}`;
  const image = r.image ? (r.image.startsWith('http') ? r.image : `${SITE}${r.image}`) : `${SITE}/og-image.png`;
  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(r.title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${escapeAttr(r.description)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/>/s, `<link rel="canonical" href="${escapeAttr(url)}" />`);
  html = html.replace(/<meta property="og:type" content=".*?"\s*\/>/s, `<meta property="og:type" content="${r.type || 'website'}" />`);
  html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/s, `<meta property="og:title" content="${escapeAttr(r.title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/s, `<meta property="og:description" content="${escapeAttr(r.description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/s, `<meta property="og:url" content="${escapeAttr(url)}" />`);
  html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/s, `<meta property="og:image" content="${escapeAttr(image)}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/>/s, `<meta name="twitter:title" content="${escapeAttr(r.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${escapeAttr(r.description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?"\s*\/>/s, `<meta name="twitter:image" content="${escapeAttr(image)}" />`);

  if (r.jsonLd) {
    const ldJson = Array.isArray(r.jsonLd) ? r.jsonLd : [r.jsonLd];
    const scripts = ldJson.map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`).join('\n    ');
    html = html.replace('</head>', `    ${scripts}\n  </head>`);
  }

  const outDir = path.join(DIST, r.url.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  written++;
}

// ---- Static Admin Entry Points ------------------------------------------------
// Pre-generate physical entry files for /admin routes so Vercel and static web
// servers instantly serve index.html on direct URL navigation and refresh.
const adminRoutes = [
  'admin',
  'admin/login',
  'admin/blogs',
  'admin/reviews',
  'admin/video-reviews',
  'admin/works',
  'admin/services',
  'admin/process',
  'admin/faqs',
  'admin/site-numbers',
  'admin/media',
  'admin/settings',
];

const adminHtml = template
  .replace(/<title>.*?<\/title>/, '<title>Admin Panel — PrimeXPixel</title>')
  .replace(/<meta name="robots" content=".*?" \/>/, '<meta name="robots" content="noindex, nofollow" />');

for (const adminRoute of adminRoutes) {
  const dir = path.join(DIST, adminRoute);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), adminHtml, 'utf-8');
}

// ---- Sitemap ------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map((r) => `  <url>\n    <loc>${SITE}${r.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`)
  .join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf-8');

console.log(`[generate-seo] wrote ${written} prerendered route(s) + sitemap.xml (${routes.length} URLs) to dist/`);
