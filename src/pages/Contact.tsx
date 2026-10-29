import { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Send, Check, Clock } from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import PageHero from '../components/PageHero';
import FAQ from '../components/FAQ';
import SectionHeading from '../components/SectionHeading';
import Select from '../components/Select';
import { services } from '../lib/data';
import { useSEO } from '../lib/useSEO';

export default function Contact() {
  useReveal();
  useSEO({
    title: 'Contact PrimeXPixel — Website & Marketing Agency in Kurla, Mumbai',
    description: 'Get in touch with PrimeXPixel, Kurla East, Mumbai. Call, WhatsApp or email for a free consultation on website development, digital marketing, UI/UX design and branding.',
    path: '/contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact PrimeXPixel',
      url: 'https://primexpixel.in/contact',
    },
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '', website: '' });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service) {
      setErrorMsg('Please select a service.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    try {
      // send-mail.php lives in /public, so it's deployed alongside the built
      // site automatically and reachable at /send-mail.php on your own domain.
      const res = await fetch('/send-mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({ ok: false }));

      if (res.ok && data.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', service: '', message: '', website: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try WhatsApp instead.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Could not reach the server. Please try WhatsApp instead.');
      setStatus('error');
    }
  };

  const whatsappHref = `https://wa.me/919892369965?text=${encodeURIComponent(
    `Hi PrimeXPixel! I'm ${form.name || '[name]'}. I'm interested in ${form.service || 'your services'}. ${form.message}`
  )}`;

  const inputCls = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-app outline-none transition-colors focus:border-[color:var(--color-brand-blue)]';

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Get In Touch"
        title="Let's design your"
        highlight="digital success"
        sub="Tell us about your project and get a free, tailored growth consultation within 24 hours. No pressure, just clarity."
      />

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left — contact info */}
          <div className="reveal flex flex-col gap-4">
            {[
              { icon: Phone, label: 'Call us', value: '+91 98923 69965', href: 'tel:+919892369965', hue: '#0582D5' },
              { icon: Mail, label: 'Email us', value: 'info@primexpixel.in', href: 'mailto:info@primexpixel.in', hue: '#97C73D' },
              { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us instantly', href: whatsappHref, hue: '#0582D5' },
            ].map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-2xl card-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-blue)]">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand shadow-premium"><c.icon className="h-5 w-5 text-white" /></span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-dim">{c.label}</div>
                  <div className="mt-0.5 font-medium text-app">{c.value}</div>
                </div>
              </a>
            ))}

            <div className="flex items-start gap-4 rounded-2xl card-surface p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]"><MapPin className="h-5 w-5 text-[color:var(--color-brand-green)]" /></span>
              <div>
                <div className="text-xs uppercase tracking-wider text-dim">Visit us</div>
                <div className="mt-0.5 font-medium text-app">Shamim Tower, Jaguruti Nagar</div>
                <div className="text-sm text-muted">Kurla East, Mumbai 400024</div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl card-surface p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]"><Clock className="h-5 w-5 text-[color:var(--color-brand-blue)]" /></span>
              <div>
                <div className="text-xs uppercase tracking-wider text-dim">Response time</div>
                <div className="mt-0.5 font-medium text-app">Within 24 hours, guaranteed</div>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
              <iframe
                title="PrimeXPixel location"
                src="https://www.google.com/maps?q=Jaguruti+Nagar+Kurla+East+Mumbai+400024&output=embed"
                className="h-56 w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right — form */}
          <div className="reveal rounded-[1.75rem] card-surface p-8 shadow-premium md:p-10">
            <h2 className="font-display text-2xl font-semibold text-app">Start your project</h2>
            <p className="mt-2 text-sm text-muted">Fill in the details and we'll be in touch shortly.</p>
            <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Name</label>
                  <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" className={inputCls} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Phone</label>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 ..." className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Service</label>
                  <Select
                    required
                    value={form.service}
                    onChange={(v) => update('service', v)}
                    placeholder="Select a service"
                    options={services.map((s) => ({ value: s.title, label: s.title }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Message</label>
                <textarea required value={form.message} onChange={(e) => update('message', e.target.value)} rows={4} placeholder="Tell us about your project and goals..." className={inputCls} />
              </div>
              {/* Honeypot — hidden from real visitors, catches spam bots */}
              <input
                type="text"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={status === 'sending'} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-medium text-white shadow-premium transition-transform hover:-translate-y-0.5 disabled:opacity-70">
                  {status === 'sending' && <>Sending…</>}
                  {status === 'sent' && <><Check className="h-4 w-4" /> Message sent</>}
                  {(status === 'idle' || status === 'error') && <>Send Message <Send className="h-4 w-4" /></>}
                </button>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3.5 text-sm font-medium text-app transition-colors hover:border-[color:var(--color-brand-green)]">
                  <MessageCircle className="h-4 w-4 text-[color:var(--color-brand-green)]" /> WhatsApp
                </a>
              </div>
              {status === 'sent' && <p className="text-center text-sm text-[color:var(--color-brand-green)]">Thanks! Your message has been sent — we'll be in touch shortly.</p>}
              {status === 'error' && <p className="text-center text-sm text-red-500">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-app-2 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="FAQ"
            title="FAQ (Frequently Asked"
            highlight="Questions)"
            sub="Clear answers to common questions before reaching out to our team."
          />
          <div className="mt-14"><FAQ /></div>
        </div>
      </section>
    </>
  );
}
