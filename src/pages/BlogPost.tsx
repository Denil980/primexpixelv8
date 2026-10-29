import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, MapPin, ArrowLeft, ArrowUpRight, Calendar, CheckCircle2, MessageCircle } from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import { useSEO, SITE } from '../lib/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import { useLiveBlogs } from '../lib/useAdminData';

export default function BlogPost() {
  useReveal();
  const { slug } = useParams();
  const liveBlogs = useLiveBlogs();
  const post = liveBlogs.find((p: any) => p.slug === slug);

  const related = liveBlogs.filter((p: any) => p.slug !== slug).slice(0, 3);

  useSEO({
    title: post ? post.metaTitle : 'Article — PrimexPixel',
    description: post ? post.metaDescription : '',
    path: `/blog/${slug}`,
    keywords: post?.keywords,
    image: post?.image,
    type: 'article',
    jsonLd: post
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.iso,
            dateModified: post.iso,
            articleSection: post.category,
            keywords: post.keywords.join(', '),
            inLanguage: 'en-IN',
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
            author: { '@type': 'Organization', name: 'PrimexPixel' },
            publisher: {
              '@type': 'Organization',
              name: 'PrimexPixel',
              logo: { '@type': 'ImageObject', url: `${SITE}/brand/mark-square.png` },
            },
            about: { '@type': 'Place', name: `${post.area}, Mumbai` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'PrimexPixel',
            image: `${SITE}/og-image.png`,
            url: SITE,
            telephone: '+91 98923 69965',
            priceRange: '$$$',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Shamim Tower, Jaguruti Nagar, Kurla East',
              addressLocality: 'Mumbai',
              addressRegion: 'MH',
              postalCode: '400024',
              addressCountry: 'IN',
            },
            areaServed: ['Kurla', 'Chembur', 'Bandra', 'Mahim', 'Dadar', 'Andheri', 'Powai', 'Ghatkopar', 'BKC', 'Mumbai'].map((n) => ({ '@type': 'Place', name: n })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
              { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
            ],
          },
        ]
      : undefined,
  });

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.area }]} />

      {/* Header */}
      <article className="px-6 pt-8">
        <div className="mx-auto max-w-3xl">
          <div className="reveal flex flex-wrap items-center gap-3">
            <span className="rounded-full gradient-brand px-3 py-1 text-xs font-medium text-white">{post.category}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-muted">
              <MapPin className="h-3 w-3 text-[color:var(--color-brand-green)]" /> {post.area}, Mumbai
            </span>
          </div>
          <h1 className="reveal mt-5 font-display text-3xl font-semibold leading-tight text-app md:text-5xl">{post.title}</h1>
          <div className="reveal mt-5 flex flex-wrap items-center gap-5 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.read} read</span>
            <span className="inline-flex items-center gap-1.5">By <span className="font-medium text-app">PrimexPixel</span></span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="reveal mx-auto mt-8 max-w-4xl">
          <div className="relative h-56 overflow-hidden rounded-[1.75rem] md:h-80">
            <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${post.hue}99, #07111Dcc)` }} />
            <div className="absolute inset-0 tech-grid opacity-25" />
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <MapPin className="h-4 w-4" /> Serving {post.area} & nearby Mumbai
            </div>
          </div>
        </div>
      </article>

      {/* Body */}
      <div className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="reveal font-display text-xl leading-relaxed text-app">{post.excerpt}</p>

          {Array.isArray(post.content) ? (
            post.content.map((section: any) => (
              <section key={section.heading} className="reveal mt-10">
                <h2 className="font-display text-2xl font-semibold text-app">{section.heading}</h2>
                {section.body.map((para: string, i: number) => (
                  <p key={i} className="mt-4 text-base leading-relaxed text-muted">{para}</p>
                ))}
              </section>
            ))
          ) : (
            <div
              className="reveal mt-10 prose prose-invert max-w-none text-muted leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Keyword / topic chips */}
          <div className="reveal mt-12 border-t border-[var(--border)] pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dim">Related topics</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(post.keywords || []).map((k: string) => (
                <span key={k} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-muted">{k}</span>
              ))}
            </div>
          </div>

          {/* In-article CTA */}
          <div className="reveal mt-10 overflow-hidden rounded-[1.5rem] card-surface p-8">
            <h3 className="font-display text-xl font-semibold text-app">
              Need help growing your {post.area} business online?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              PrimexPixel builds websites and marketing that rank locally and convert. Get a free, tailored consultation.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {['Local SEO & Google ranking', 'Fast, mobile-first websites', 'Conversion-focused design', 'Transparent reporting'].map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-app">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-brand-green)]" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/contact">Book Free Consultation</Button>
              <Button href="https://wa.me/919892369965?text=Hi%20PrimeXPixel%2C%20I%27d%20like%20a%20free%20consultation" variant="outline" icon={<MessageCircle className="h-4 w-4" />}>Chat on WhatsApp</Button>
            </div>
          </div>

          <Link to="/blog" className="reveal mt-10 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)]">
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>
        </div>
      </div>

      {/* Related */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="reveal font-display text-2xl font-semibold text-app">Keep reading</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="reveal group flex flex-col overflow-hidden rounded-2xl card-surface transition-all duration-500 hover:-translate-y-1.5">
                <div className="relative h-36 overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${p.hue}55, #07111Ddd)` }} />
                  <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">{p.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-base font-semibold leading-snug text-app transition-colors group-hover:gradient-text">{p.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-brand-blue)]">Read <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
