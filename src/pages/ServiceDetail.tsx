import { useState, type ReactNode, type ElementType } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Wrench,
  Workflow,
  Star,
  Quote,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  Users,
  BookOpen,
  Briefcase,
  Plus,
  Minus,
  MessageSquare,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import { useSEO, SITE } from '../lib/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import { stats, industries, blogPosts } from '../lib/data';
import { useLiveServices, useLiveWorks, useLiveSiteNumbers, useLiveReviews } from '../lib/useAdminData';
import { renderLucideIcon } from '../admin/components/IconPicker';

const DEFAULT_HERO_IMAGES: Record<string, string> = {
  'website-development': '/brand/blog/kurla-web-dev.jpg',
  'ecommerce': '/brand/blog/dadar-ecommerce.jpg',
  'ui-ux-design': '/brand/blog/bandra-uiux.jpg',
  'graphic-design': '/brand/blog/mahim-branding.jpg',
  'video-editing': '/brand/blog/powai-video.jpg',
  'social-media': '/brand/blog/andheri-social.jpg',
  'digital-marketing': '/brand/blog/chembur-marketing.jpg',
  'crm-ai-automation': '/brand/blog/crm-automation-mumbai.jpg',
  'erp-system': '/brand/work/primeheat-cover.jpg',
  'content-creation': '/brand/monkbless/hero.jpg',
  'content-writing': '/brand/blog/content-writing-mumbai.jpg',
};

const SPECIFIC_DEFAULT_FAQS: Record<string, { q: string; a: string }[]> = {
  'website-development': [
    {
      q: 'How long does a custom website development project take?',
      a: 'Most website projects take 3 to 6 weeks from initial discovery and wireframes to final deployment, depending on custom integrations and scope. We agree on a firm milestone schedule before kickoff.',
    },
    {
      q: 'Will our website score 90+ on Google PageSpeed / Lighthouse?',
      a: 'Yes. We build using modern lightweight architectures, image WebP compression, server caching, and clean code to achieve sub-second load times and top Lighthouse scores.',
    },
    {
      q: 'Can our internal team update content, images, and blogs easily?',
      a: 'Absolutely. We configure an intuitive visual dashboard or headless CMS so your marketing team can publish new posts, edit copy, and manage pages without writing any code.',
    },
    {
      q: 'Do you handle domain configuration, hosting, and technical SEO?',
      a: 'Yes. We set up SSL encryption, DNS records, automated CDN caching, XML sitemaps, robots.txt, and Schema.org structured data to give you a head start on search engines.',
    },
    {
      q: 'What warranty or support is included post-launch?',
      a: 'Every custom website includes a 30-day post-launch warranty with bug fixes and training, plus optional monthly retainers for ongoing enhancements and security patches.',
    },
  ],
  'ecommerce': [
    {
      q: 'Which ecommerce platforms and frameworks do you build on?',
      a: 'We specialize in Shopify Plus, WooCommerce, and custom headless Next.js commerce architectures built for rapid page transitions and high checkout conversion.',
    },
    {
      q: 'How do you handle Indian and international payment gateways?',
      a: 'We integrate Razorpay, Stripe, Cashfree, and PayU with full support for UPI, Credit Cards, NetBanking, and EMI with automated error recovery to prevent drop-offs.',
    },
    {
      q: 'Can you migrate our existing catalogue, customers, and order history?',
      a: 'Yes. We execute seamless catalogue migrations without loss of SEO rankings, image quality, customer accounts, or historical order logs.',
    },
    {
      q: 'How do you optimize our online store for higher conversions?',
      a: 'We implement streamlined mobile-first checkout flows, automated abandoned-cart sequences, trust badges, instant search, and one-click upsells.',
    },
    {
      q: 'Do you integrate logistics partners like Shiprocket or Delhivery?',
      a: 'Yes. We configure real-time shipping rate calculators, automated airway bill (AWB) generation, and customer SMS/WhatsApp tracking notifications.',
    },
  ],
  'ui-ux-design': [
    {
      q: 'What is your typical UI/UX design process and timeline?',
      a: 'Our UI/UX design workflow spans 3 to 5 weeks across user research, wireframing, high-fidelity Figma visual design, and interactive click-through prototyping.',
    },
    {
      q: 'What design deliverables do we receive upon project completion?',
      a: 'You receive complete Figma source files, a reusable component design system, style guide tokens (colors, typography, spacing), and an annotated developer handoff kit.',
    },
    {
      q: 'Do you conduct usability testing with actual target users?',
      a: 'Yes. We validate wireframes and prototypes with real user journeys and heatmaps to eliminate friction before writing a single line of code.',
    },
    {
      q: 'Can our developers collaborate directly with your design team?',
      a: 'Yes. We run interactive design walkthroughs and deliver pixel-precise specs, assets, and responsive breakpoints ready for frontend implementation.',
    },
    {
      q: 'Can you redesign our existing application without rebuilding it from scratch?',
      a: 'Certainly. We can audit your existing product, address UX friction points, and deliver an incremental design refresh that fits your existing tech stack.',
    },
  ],
};

const RELATED_POSTS: Record<string, string[]> = {
  'website-development': ['website-development-company-mumbai', 'website-development-company-kurla-mumbai'],
  'ecommerce': ['ecommerce-website-development-dadar-mumbai'],
  'ui-ux-design': ['ui-ux-design-agency-bandra-mumbai'],
  'graphic-design': ['graphic-design-branding-mahim-mumbai'],
  'video-editing': ['video-editing-services-powai-mumbai'],
  'social-media': ['social-media-management-andheri-mumbai'],
  'digital-marketing': ['digital-marketing-agency-chembur-mumbai', 'local-seo-guide-mumbai-near-me'],
  'crm-ai-automation': ['crm-ai-automation-mumbai-businesses'],
  'content-writing': ['content-writing-services-mumbai'],
};

function SectionBlock({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: ElementType;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="reveal">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-premium shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold text-app">{title}</h2>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ServiceDetail() {
  useReveal();
  const { slug } = useParams();

  const liveServices = useLiveServices();
  const liveWorks = useLiveWorks();
  const liveStats = useLiveSiteNumbers('Results');
  const liveReviews = useLiveReviews();

  // Interactive accordion state for service FAQ (one open at a time, closed initially)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Find current service
  const serviceIndex = liveServices.findIndex((s: any) => s.slug === slug);
  const service = serviceIndex >= 0 ? (liveServices[serviceIndex] as any) : undefined;
  const relatedServices = liveServices.filter((s: any) => s.slug !== slug).slice(0, 4);

  // Find matching related works from Our Works module
  const relatedWorks = liveWorks
    .filter((w: any) => {
      if (service?.workCategories && service.workCategories.length > 0) {
        return service.workCategories.some(
          (cat: string) => cat.toLowerCase() === (w.category || '').toLowerCase()
        );
      }
      if (w.category && service?.title) {
        return (
          w.category.toLowerCase().includes(service.title.toLowerCase().split(' ')[0]) ||
          service.title.toLowerCase().includes(w.category.toLowerCase())
        );
      }
      return false;
    })
    .slice(0, 3);

  // Fallback to top works if no category match
  const displayedWorks = relatedWorks.length > 0 ? relatedWorks : liveWorks.slice(0, 3);

  const heroImageSrc =
    service?.heroImage ||
    DEFAULT_HERO_IMAGES[service?.slug || ''] ||
    '/brand/blog/kurla-web-dev.jpg';

  // 4 to 6 Service-specific FAQs (Admin managed or high-quality specific fallback, ZERO pricing)
  const faqsToDisplay: { q: string; a: string }[] =
    service?.faqs && service.faqs.length > 0
      ? service.faqs
      : SPECIFIC_DEFAULT_FAQS[service?.slug || ''] || [
          {
            q: `How long does a typical ${service?.title || 'digital'} engagement take?`,
            a: `Most engagements move through ${service?.process?.length || 5} structured stages — from initial audit and discovery to final delivery — with an agreed timeline confirmed during your free consultation.`,
          },
          {
            q: `How is project investment determined?`,
            a: `Pricing depends on your requirements, custom scope, and deliverables. Contact us for a custom quote.`,
          },
          {
            q: `What deliverables are included with this service?`,
            a: `You receive end-to-end production: ${(service?.highlights || service?.benefits || []).slice(0, 3).join(', ') || 'complete strategy, visual design, and engineered delivery'}, plus full source assets and handover support.`,
          },
          {
            q: `Can you customize ${service?.title || 'this service'} to integrate with our current tools?`,
            a: `Yes. We integrate seamlessly with your existing platforms, CMS, CRM, and analytics workflows to ensure frictionless operation without disruption.`,
          },
          {
            q: `What kind of support is provided after project completion?`,
            a: `Every engagement includes a dedicated warranty review period after launch, with optional monthly retainers for continuous maintenance and optimization.`,
          },
        ];

  useSEO({
    title:
      service?.metaTitle ||
      (service ? `${service.title} Services in Mumbai | PrimeXPixel` : 'Services | PrimeXPixel'),
    description:
      service?.metaDescription ||
      (service
        ? `${service.tagline || service.desc || service.shortDesc} Strategy-led digital execution in Mumbai.`
        : ''),
    path: `/services/${slug}`,
    type: 'article',
    jsonLd: service
      ? {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.desc || service.shortDesc,
          serviceType: service.title,
          provider: {
            '@type': 'ProfessionalService',
            name: 'PrimeXPixel',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Kurla East',
              addressRegion: 'Maharashtra',
              addressCountry: 'IN',
            },
          },
          areaServed: [
            { '@type': 'City', name: 'Mumbai' },
            { '@type': 'Place', name: 'Kurla' },
            { '@type': 'Place', name: 'Bandra' },
          ],
          url: `${SITE}/services/${service.slug}`,
        }
      : undefined,
  });

  if (!service) return <Navigate to="/services" replace />;

  const trustStats = liveStats.slice(0, 3);
  const testimonial = liveReviews[Math.abs(serviceIndex) % Math.max(liveReviews.length, 1)];
  const relatedPosts = (RELATED_POSTS[service.slug] ?? [])
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const ctaButtonText = service.ctaText || 'Get a Custom Quote';

  return (
    <>
      {/* =========================================================================
          1. HERO SECTION: Service name (H1), One-line value statement, Hero image, Main CTA
         ========================================================================= */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-60" />
        <div className="pointer-events-none absolute inset-0 mesh-glow opacity-60" />
        <Breadcrumbs
          compact
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: service.title },
          ]}
        />

        <div className="relative mx-auto mt-10 grid max-w-6xl gap-10 sm:mt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="reveal inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
              Service Capability
            </span>

            {/* Exactly ONE H1 per page */}
            <h1 className="reveal mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-app sm:text-5xl">
              {service.title}
            </h1>

            {/* One-line value statement */}
            <p className="reveal mt-4 text-lg font-medium text-app opacity-90 sm:text-xl">
              {service.tagline}
            </p>

            <p className="reveal mt-4 max-w-xl leading-relaxed text-muted">
              {service.shortDesc || service.overview || service.desc}
            </p>

            {/* Main CTA buttons */}
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Button to={`/contact?service=${service.slug}`} icon={<ArrowRight className="h-4 w-4" />}>
                {ctaButtonText}
              </Button>
              <Button to="/contact?type=call" variant="outline" icon={<PhoneCall className="h-4 w-4" />}>
                Book a Call
              </Button>
            </div>

            {/* Trust strip (Connected to Admin Site Numbers) */}
            <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-7">
              {trustStats.map((s: any) => (
                <div key={s.id || s.label}>
                  <div className="font-display text-2xl font-semibold gradient-text">
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual Card: Large Hero Image with capability branding & CTA badge */}
          <div className="reveal relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] card-surface p-2.5 shadow-2xl group">
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-app">
              <img
                src={heroImageSrc}
                alt={`${service.title} capability - PrimeXPixel`}
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white shrink-0">
                    {typeof service.icon === 'string' ? (
                      renderLucideIcon(service.icon, 'h-5 w-5 text-white')
                    ) : service.icon ? (
                      <service.icon className="h-5 w-5 text-white" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    )}
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80 block">
                      PrimeXPixel Mumbai
                    </span>
                    <span className="font-display text-sm font-bold text-white">
                      {service.title}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/contact?service=${service.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-zinc-950 px-3 py-1.5 text-xs font-semibold shadow-lg hover:bg-zinc-100 transition-colors"
                >
                  <span>Get a Custom Quote</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN BODY: Sections 2 to 7 (Overview, Inclusions, Benefits, Process, Works, FAQ)
         ========================================================================= */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-14">
            {/* 2. OVERVIEW: What the service is and who it is for */}
            <SectionBlock
              icon={CheckCircle2}
              title="Overview: What It Is & Who It Is For"
              subtitle="Clear breakdown of how this capability delivers tangible value."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--surface)] p-6 border border-[var(--border)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-brand-blue)] block">
                    What This Service Is
                  </span>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {service.overview || service.fullDesc || service.desc || service.shortDesc}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--surface)] p-6 border border-[var(--border)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-brand-green)] block">
                    Who This Service Is For
                  </span>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {service.whoItIsFor ||
                      'Ambitious businesses, founders, and growing enterprises looking to scale their digital presence with measurable results.'}
                  </p>
                </div>
              </div>

              {/* Problem vs Solution cards */}
              {(service.problem || service.solution) && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {service.problem && (
                    <div className="rounded-2xl card-surface p-5 border border-red-500/20">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">
                        The Challenge
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{service.problem}</p>
                    </div>
                  )}
                  {service.solution && (
                    <div className="rounded-2xl card-surface p-5 border border-emerald-500/20">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Our Solution
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{service.solution}</p>
                    </div>
                  )}
                </div>
              )}
            </SectionBlock>

            {/* 3. WHAT IS INCLUDED: List of features and deliverables */}
            <SectionBlock
              icon={Layers}
              title="What is Included: Features & Deliverables"
              subtitle="Everything delivered with zero hidden dependencies or surprises."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {(service.highlights && service.highlights.length > 0
                  ? service.highlights
                  : [
                      'High-performance custom architecture',
                      'Responsive layout across mobile, tablet & desktop',
                      'SEO and Core Web Vitals optimization',
                      'Full source code and digital asset handover',
                      'Rigorous cross-browser quality assurance',
                      'Dedicated post-launch warranty and training',
                    ]
                ).map((feature: string) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-sm text-app hover:border-[color:var(--color-brand-blue)] transition-colors"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-brand">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* 4. BENEFITS: What the client gets (Results, not just tasks) */}
            <SectionBlock
              icon={ShieldCheck}
              title="Benefits: Results & Value You Receive"
              subtitle="Measurable business outcomes designed to give you an unfair advantage."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {(service.benefits && service.benefits.length > 0
                  ? service.benefits
                  : [
                      'Accelerated customer conversion and engagement',
                      'Enterprise-grade code and pixel-perfect design',
                      'Clean headless architecture you control completely',
                      'Dedicated support and continuous performance monitoring',
                    ]
                ).map((benefit: string, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl card-surface p-5 border border-[var(--border)] hover:border-[color:var(--color-brand-green)] transition-all duration-300"
                  >
                    <div className="font-display text-sm font-semibold text-app flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full gradient-brand" />
                      Outcome 0{idx + 1}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{benefit}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* Built For Teams Like Yours */}
            <SectionBlock
              icon={Users}
              title="Built For Teams Like Yours"
              subtitle="Adapted to the operational realities of your specific industry."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {industries.map((ind) => (
                  <div
                    key={ind.name}
                    className="group flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 transition-colors duration-300 hover:border-[color:var(--color-brand-blue)]"
                  >
                    <ind.icon className="h-4 w-4 shrink-0 text-[color:var(--color-brand-green)]" />
                    <span className="text-xs font-medium text-app">{ind.name}</span>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* 6. RELATED WORK: Projects from Our Works that match this service */}
            <SectionBlock
              icon={Briefcase}
              title="Related Work: Case Studies & Results"
              subtitle="Selected portfolio projects demonstrating our execution for this capability."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {displayedWorks.map((work: any) => {
                  const cover = work.coverImage || work.image;
                  return (
                    <Link
                      key={work.slug}
                      to={`/work/${work.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] card-surface transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-brand-blue)] shadow-md"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-app">
                        {cover ? (
                          <img
                            src={cover}
                            alt={work.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                            }}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs text-dim">
                            {work.title}
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {work.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="text-[11px] text-dim">{work.client}</span>
                        <h3 className="mt-1 font-display text-sm font-semibold text-app group-hover:gradient-text transition-colors">
                          {work.title}
                        </h3>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-medium text-[color:var(--color-brand-blue)]">
                          View Case Study <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SectionBlock>

            {/* 7. FAQ: 4 to 6 Service-Specific Questions Accordion (Zero pricing mentions) */}
            <SectionBlock
              icon={HelpCircle}
              title="FAQ (Frequently Asked Questions)"
              subtitle="Everything you need to know about our scope, process, and deliverables."
            >
              <div className="space-y-3">
                {faqsToDisplay.map((f, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={f.q}
                      className={`overflow-hidden rounded-2xl border card-surface transition-all duration-300 ${
                        isOpen
                          ? 'border-[color:var(--color-brand-blue)] shadow-sm'
                          : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors"
                      >
                        <span className="font-display text-sm font-semibold text-app">
                          {f.q}
                        </span>
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full gradient-brand text-white transition-transform duration-300 ${
                            isOpen ? 'scale-105' : ''
                          }`}
                        >
                          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                      </button>

                      <div
                        className="grid transition-all duration-300 ease-in-out"
                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-[var(--border)] px-5 pb-5 pt-3">
                            <p className="text-sm leading-relaxed text-muted">{f.a}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionBlock>

            {/* Related reading from blog */}
            {relatedPosts.length > 0 && (
              <SectionBlock
                icon={BookOpen}
                title="Related Insights"
                subtitle="In-depth articles and guides related to this capability."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-blue)]"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-brand-blue)]">
                          {post.category}
                        </span>
                        <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-app">
                          {post.title}
                        </h3>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium text-muted">
                          Read article <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </SectionBlock>
            )}
          </div>

          {/* Right Sidebar Columns */}
          <div className="flex flex-col gap-8">
            {/* 5. HOW WE WORK: Short step-by-step for this service */}
            <div className="reveal rounded-[1.75rem] card-surface p-8 shadow-premium">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-premium">
                  <Workflow className="h-5 w-5 text-white" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-app">How We Work</h2>
                  <p className="text-xs text-muted">Step-by-step roadmap for this service</p>
                </div>
              </div>

              <div className="relative mt-6 space-y-5 pl-2">
                <span className="absolute bottom-4 left-[19px] top-4 w-px bg-[var(--border-strong)]" />
                {(service.process && service.process.length > 0
                  ? service.process
                  : [
                      'Discovery & Audit',
                      'Strategy Roadmap',
                      'Design & Prototype',
                      'Engineering & QA',
                      'Launch & Scale',
                    ]
                ).map((step: string, i: number) => (
                  <div key={step} className="relative flex items-center gap-4">
                    <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-solid)] font-display text-sm font-semibold gradient-text shadow-sm">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-app">{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2.5 rounded-xl bg-[var(--surface)] px-4 py-3 text-xs text-muted border border-[var(--border)]">
                <Clock className="h-4 w-4 shrink-0 text-[color:var(--color-brand-blue)]" />
                <span>Exact timeline confirmed after your free discovery session.</span>
              </div>
            </div>

            {/* Tools & Technologies */}
            {service.technologies && service.technologies.length > 0 && (
              <div className="reveal rounded-[1.75rem] card-surface p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-premium">
                    <Wrench className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-app">Tools & Technologies</h3>
                </div>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {service.technologies.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-app"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial spotlight */}
            <div className="reveal relative overflow-hidden rounded-[1.75rem] card-surface p-8 shadow-premium">
              <Quote className="absolute right-6 top-6 h-14 w-14 text-[color:var(--color-brand-blue)] opacity-10" />
              <div className="relative flex gap-1">
                {[...Array(testimonial?.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[color:var(--color-brand-green)] text-[color:var(--color-brand-green)]"
                  />
                ))}
              </div>
              <p className="relative mt-4 text-sm leading-relaxed text-app">
                “{testimonial?.quote}”
              </p>
              <div className="relative mt-5 flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-brand font-display text-sm font-semibold text-white">
                  {testimonial?.initials || 'PK'}
                </span>
                <div>
                  <div className="font-display text-sm font-semibold text-app">{testimonial?.name}</div>
                  <div className="text-xs text-muted">
                    {testimonial?.role}, {testimonial?.company}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick nav to other services */}
            <div className="reveal rounded-[1.75rem] card-surface p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-premium">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </span>
                <h3 className="font-display text-xl font-semibold text-app">Explore Other Services</h3>
              </div>
              <div className="mt-5 grid gap-2.5">
                {relatedServices.map((s: any) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-blue)]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface-solid)]">
                      {typeof s.icon === 'string' ? (
                        renderLucideIcon(s.icon, 'h-4 w-4 text-[color:var(--color-brand-blue)]')
                      ) : s.icon ? (
                        <s.icon className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-app">{s.title}</span>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CTA: "Get a free quote" or "Book a call" Block
         ========================================================================= */}
      <CTASection />
    </>
  );
}
