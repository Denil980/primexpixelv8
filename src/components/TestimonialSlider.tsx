import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLiveReviews } from '../lib/useAdminData';

export default function TestimonialSlider() {
  const testimonials = useLiveReviews();
  const [idx, setIdx] = useState(0);
  const n = Math.max(testimonials.length, 1);
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n]);
  const prev = () => setIdx((i) => (i - 1 + n) % n);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const current = testimonials[idx] || testimonials[0];
  if (!current) return null;

  return (
    <div className="reveal relative mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-[1.75rem] card-surface p-8 shadow-premium md:p-12">
        <Quote className="absolute right-8 top-8 h-16 w-16 text-[color:var(--color-brand-blue)] opacity-10" />
        <div className="relative">
          <div className="flex gap-1">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[color:var(--color-brand-green)] text-[color:var(--color-brand-green)]" />
            ))}
          </div>
          <p className="mt-6 font-display text-xl leading-relaxed text-app md:text-2xl">
            “{current.quote}”
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full gradient-brand font-display text-lg font-semibold text-white">
              {current.initials}
            </span>
            <div>
              <div className="font-display font-semibold text-app">{current.name}</div>
              <div className="text-sm text-muted">{current.role}, {current.company}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button onClick={prev} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full card-surface text-app transition-all hover:border-[color:var(--color-brand-blue)] hover:-translate-y-0.5">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-8 gradient-brand' : 'w-2 bg-[var(--border-strong)]'}`} />
          ))}
        </div>
        <button onClick={next} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full card-surface text-app transition-all hover:border-[color:var(--color-brand-blue)] hover:-translate-y-0.5">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
