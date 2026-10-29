import { MessageCircle, CalendarCheck } from 'lucide-react';
import Button from './Button';

export default function CTASection() {
  return (
    <section className="px-6 py-24">
      <div className="reveal relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-[1.5px]">
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-app-2 px-8 py-16 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(5,130,213,0.35), transparent 70%)' }} />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(151,199,61,0.3), transparent 70%)' }} />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-app sm:text-4xl md:text-5xl">
              Ready To Scale Your <span className="gradient-text">Business Online?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Book a free consultation and get a tailored growth roadmap for your brand — no obligation, just clarity.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button to="/contact" icon={<CalendarCheck className="h-4 w-4" />}>Book Free Consultation</Button>
              <Button href="https://wa.me/919892369965?text=Hi%20PrimeXPixel%2C%20I%27d%20like%20a%20free%20consultation" variant="outline" icon={<MessageCircle className="h-4 w-4" />}>Chat on WhatsApp</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
