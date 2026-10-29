import { useState } from 'react';
import { Star, Quote, Play, ShieldCheck, Award, TrendingUp } from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import PageHero from '../components/PageHero';
import TestimonialSlider from '../components/TestimonialSlider';
import SectionHeading from '../components/SectionHeading';
import CTASection from '../components/CTASection';
import { useLiveReviews, useLiveReviewVideos } from '../lib/useAdminData';
import { useSEO } from '../lib/useSEO';

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function VideoReviewCard({ v, delay }: { v: any; delay: number }) {
  const [playing, setPlaying] = useState(false);
  const id = getYouTubeId(v.videoUrl);
  const thumbnail = v.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '');

  return (
    <div
      className="reveal group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-[1.5rem] shadow-premium bg-app-2"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {playing && id ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={`${v.name} video testimonial`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => id && setPlaying(true)}
          className="absolute inset-0 block h-full w-full text-left"
          aria-label={`Play ${v.name} video testimonial`}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${v.name} video testimonial`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: `linear-gradient(160deg, ${v.hue || '#0582D5'}, #07111D)` }} />
              <div className="absolute inset-0 tech-grid opacity-30" />
            </>
          )}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="font-display text-lg font-semibold text-white">{v.name}</div>
            <div className="text-sm text-white/80">{v.company}</div>
            {v.metric && (
              <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {v.metric}
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  );
}

const badges = [
  { icon: ShieldCheck, label: 'Verified Reviews' },
  { icon: Award, label: 'Top Rated Agency' },
  { icon: Star, label: '4.9 Average Rating' },
  { icon: TrendingUp, label: '98% Satisfaction' },
];

export default function Testimonials() {
  useReveal();
  const testimonials = useLiveReviews();
  const videoReviews = useLiveReviewVideos();

  useSEO({
    title: 'Client Reviews & Testimonials — PrimeXPixel Mumbai',
    description: 'See what businesses across Mumbai, Kurla and Chembur say about working with PrimeXPixel on their website, branding and digital marketing projects.',
    path: '/testimonials',
  });

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Testimonials' }]}
        eyebrow="Client Love"
        title="Success stories from"
        highlight="brands we've grown"
        sub="Real results, real relationships. Here's what it's like to partner with PrimeXPixel."
      />

      {/* badges */}
      <section className="px-6 pb-8 pt-6 sm:pt-8">
        <div className="reveal mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {badges.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2.5 rounded-2xl card-surface p-6 text-center">
              <b.icon className="h-6 w-6 text-[color:var(--color-brand-green)]" />
              <span className="text-sm font-medium text-app">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured slider */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Featured" title="In their" highlight="own words" />
          <div className="mt-14"><TestimonialSlider /></div>
        </div>
      </section>

      {/* Video testimonials */}
      {videoReviews.length > 0 && (
        <section className="bg-app-2 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Video Reviews" title="Hear it" highlight="straight" sub="Short video stories from the founders and teams behind our favourite projects." />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {videoReviews.map((v: any, i: number) => (
                <VideoReviewCard key={v.id || `${v.name}-${i}`} v={v} delay={i * 50} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Review wall */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Review Wall" title="More" highlight="happy clients" />
          <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {testimonials.map((t, i) => (
              <div key={`${t.name}-${i}`} className="reveal mb-6 break-inside-avoid rounded-2xl card-surface p-6">
                <Quote className="h-6 w-6 text-[color:var(--color-brand-blue)] opacity-30" />
                <div className="mt-3 flex gap-1">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[color:var(--color-brand-green)] text-[color:var(--color-brand-green)]" />)}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-semibold text-white">{t.initials}</span>
                  <div>
                    <div className="text-sm font-semibold text-app">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
