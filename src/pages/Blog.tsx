import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import { useSEO, SITE } from '../lib/useSEO';
import PageHero from '../components/PageHero';
import CTASection from '../components/CTASection';
import { useLiveBlogs } from '../lib/useAdminData';

const categories = ['All', 'UI/UX', 'Web Design', 'SEO', 'Marketing', 'Content', 'Technology', 'Business Growth', 'Case Study'];

export default function Blog() {
  useReveal();
  const [cat, setCat] = useState('All');
  const blogPosts = useLiveBlogs();

  const posts = blogPosts.filter((p: any) => cat === 'All' || p.category === cat);
  const featured = blogPosts[0] || {
    slug: 'website-development-company-kurla-mumbai',
    title: 'Website Development in Mumbai',
    excerpt: 'High-performance digital engineering crafted to convert.',
    category: 'Web Design',
    date: 'Recent',
    read: '4 min',
    area: 'Kurla',
    image: '/brand/blog/kurla-web-dev.jpg',
    hue: '#0582D5',
    keywords: ['Mumbai', 'Web Design'],
  };

  useSEO({
    title: 'Blog — Website Design, SEO & Digital Marketing in Mumbai | PrimexPixel',
    description:
      'Insights on website development, UI/UX, SEO and digital marketing for businesses across Mumbai — Kurla, Chembur, Bandra, Mahim, Dadar, Andheri & more.',
    path: '/blog',
    keywords: [
      'digital marketing blog Mumbai',
      'website development Mumbai',
      'local SEO Mumbai',
      'web design agency Mumbai',
      'UI UX design Mumbai',
    ],
    type: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'PrimexPixel Journal',
        description: 'Website design, SEO and digital marketing insights for Mumbai businesses.',
        url: `${SITE}/blog`,
        publisher: { '@type': 'Organization', name: 'PrimexPixel', logo: `${SITE}/brand/mark-square.png` },
        blogPost: blogPosts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.excerpt,
          datePublished: p.iso,
          url: `${SITE}/blog/${p.slug}`,
          keywords: p.keywords.join(', '),
          articleSection: p.category,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        ],
      },
    ],
  });

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Blog' }]}
        eyebrow="The Journal"
        title="Digital growth insights for"
        highlight="Mumbai businesses"
        sub="Practical guides on website development, UI/UX, SEO and marketing — written for businesses across Kurla, Chembur, Bandra, Mahim, Dadar, Andheri, Powai and beyond."
      />

      {/* Featured */}
      <section className="px-6 pb-8">
        <Link to={`/blog/${featured.slug}`} className="reveal group mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-[1.75rem] card-surface lg:grid-cols-2">
          <div className="relative min-h-[280px] overflow-hidden">
            <img src={featured.image} alt={featured.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${featured.hue}cc, #07111Dcc)` }} />
            <div className="absolute inset-0 tech-grid opacity-30" />
            <span className="absolute left-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">Featured</span>
            <span className="absolute bottom-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3" /> {featured.area}, Mumbai
            </span>
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-brand-blue)]">{featured.category}</span>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-app md:text-3xl">{featured.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{featured.excerpt}</p>
            <div className="mt-6 flex items-center gap-4 text-xs text-dim">
              <span>{featured.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.read}</span>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-brand-blue)]">
              Read Article <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      </section>

      {/* Filters + grid */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="reveal flex flex-wrap justify-center gap-2.5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${cat === c ? 'gradient-brand text-white shadow-premium' : 'card-surface text-muted hover:text-app'}`}>{c}</button>
            ))}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="reveal group flex flex-col overflow-hidden rounded-2xl card-surface transition-all duration-500 hover:-translate-y-1.5">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${p.hue}55, #07111Ddd)` }} />
                  <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">{p.category}</span>
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    <MapPin className="h-3 w-3" /> {p.area}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs text-dim">
                    <span>{p.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-app transition-colors group-hover:gradient-text">{p.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-brand-blue)]">Read Article <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Areas we serve — internal linking for local SEO */}
      <section className="px-6 py-12">
        <div className="reveal mx-auto max-w-6xl rounded-[1.75rem] card-surface p-8 md:p-10">
          <h2 className="font-display text-xl font-semibold text-app">Areas we serve across Mumbai</h2>
          <p className="mt-2 text-sm text-muted">PrimexPixel partners with businesses right across the city and its suburbs.</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {['Kurla', 'Chembur', 'Bandra', 'Mahim', 'Dadar', 'Andheri', 'Powai', 'Ghatkopar', 'BKC', 'Wadala', 'Matunga', 'Sion', 'Vikhroli', 'Santacruz'].map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5 text-[color:var(--color-brand-green)]" /> {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-12">
        <div className="reveal mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] card-surface p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-semibold text-app md:text-3xl">Get Mumbai growth insights in your inbox</h2>
          <p className="mt-3 text-muted">Join 5,000+ founders and marketers. One thoughtful email a week, no spam.</p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="you@company.com" className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm text-app outline-none transition-colors focus:border-[color:var(--color-brand-blue)]" />
            <button className="rounded-full gradient-brand px-6 py-3 text-sm font-medium text-white shadow-premium transition-transform hover:-translate-y-0.5">Subscribe</button>
          </form>
        </div>
      </section>

      <CTASection />
    </>
  );
}
