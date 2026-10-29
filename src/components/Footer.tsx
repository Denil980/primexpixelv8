import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight, Linkedin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import Logo from './Logo';

const socials = [
  { Icon: Instagram, href: 'https://www.instagram.com/primexpixel/', label: 'PrimexPixel on Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/primexpixel/', label: 'PrimexPixel on LinkedIn' },
  { Icon: Facebook, href: 'https://www.facebook.com/primexpixel', label: 'PrimexPixel on Facebook' },
  { Icon: MessageCircle, href: '#', label: 'Chat with PrimexPixel on WhatsApp' },
];

const cols = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Works', to: '/work' },
      { label: 'Testimonials', to: '/testimonials' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Website Development', to: '/services' },
      { label: 'Ecommerce', to: '/services' },
      { label: 'UI/UX Design', to: '/services' },
      { label: 'Digital Marketing', to: '/services' },
      { label: 'Video Editing', to: '/services' },
      { label: 'Content Creation', to: '/services' },
      { label: 'Content Writing', to: '/services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'UI/UX Insights', to: '/blog' },
      { label: 'SEO Guides', to: '/blog' },
      { label: 'Growth Playbooks', to: '/blog' },
      { label: 'Case Studies', to: '/work' },
      { label: 'FAQ', to: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-app-2">
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              A premium digital growth agency in Mumbai. We design digital experiences
              that drive measurable growth for ambitious brands.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href, label }) => {
                const isReal = href !== '#';
                return (
                  <a
                    key={label}
                    href={href}
                    {...(isReal ? { target: '_blank', rel: 'noreferrer' } : {})}
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] card-surface text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-blue)] hover:text-app"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold tracking-wide text-app">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-app"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 border-t border-[var(--border)] pt-8 sm:grid-cols-3">
          <a href="tel:+919892369965" className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-app">
            <Phone className="h-4 w-4 text-[color:var(--color-brand-blue)]" /> +91 98923 69965
          </a>
          <a href="mailto:info@primexpixel.in" className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-app">
            <Mail className="h-4 w-4 text-[color:var(--color-brand-green)]" /> info@primexpixel.in
          </a>
          <span className="flex items-center gap-3 text-sm text-muted">
            <MapPin className="h-4 w-4 text-[color:var(--color-brand-blue)]" /> Kurla East, Mumbai 400024
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-dim sm:flex-row">
          <p>© 2026 PrimeXPixel • Designing Digital Success</p>
          <p>Website Development • UI/UX • Digital Marketing — Mumbai</p>
        </div>
      </div>
    </footer>
  );
}
