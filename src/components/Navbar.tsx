import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services' },
  { to: '/work', label: 'Our Works' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[900] flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-500 ${
          scrolled
            ? 'bg-[color:var(--surface-solid)] shadow-premium py-2.5 border border-[var(--border)]'
            : 'border border-transparent bg-transparent py-4'
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive ? 'text-app' : 'text-muted hover:text-app'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full gradient-brand" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden items-center gap-1.5 rounded-full gradient-brand px-4 py-2.5 text-sm font-medium text-white shadow-premium transition-transform duration-300 hover:-translate-y-0.5 md:inline-flex"
          >
            Get Free Consultation <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] card-surface lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-4 top-24 z-[899] origin-top rounded-2xl bg-[color:var(--surface-solid)] border border-[var(--border)] p-4 shadow-premium transition-all duration-300 lg:hidden ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive ? 'gradient-text' : 'text-muted hover:text-app'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl gradient-brand px-4 py-3 text-sm font-medium text-white"
          >
            Get Free Consultation <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
