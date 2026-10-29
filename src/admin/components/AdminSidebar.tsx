import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Video,
  Briefcase,
  Layers,
  GitCommit,
  HelpCircle,
  Hash,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminCollection } from '../db';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { items: blogs } = useAdminCollection('blogs');
  const { items: reviews } = useAdminCollection('reviews');
  const { items: videoReviews } = useAdminCollection('videoReviews');
  const { items: works } = useAdminCollection('works');
  const { items: services } = useAdminCollection('services');
  const { items: processSteps } = useAdminCollection('process');
  const { items: faqs } = useAdminCollection('faqs');
  const { items: siteNumbers } = useAdminCollection('siteNumbers');

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/blogs', label: 'Blogs', icon: FileText, count: blogs.length },
    { to: '/admin/reviews', label: 'Text Reviews', icon: MessageSquare, count: reviews.length },
    { to: '/admin/video-reviews', label: 'Video Testimonials', icon: Video, count: videoReviews.length },
    { to: '/admin/works', label: 'Our Works', icon: Briefcase, count: works.length },
    { to: '/admin/services', label: 'Services', icon: Layers, count: services.length },
    { to: '/admin/process', label: 'Our Process', icon: GitCommit, count: processSteps.length },
    { to: '/admin/faqs', label: 'FAQ', icon: HelpCircle, count: faqs.length },
    { to: '/admin/site-numbers', label: 'Site Numbers', icon: Hash, count: siteNumbers.length },
    { to: '/admin/settings', label: 'Settings & Backups', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-[var(--border)] bg-app-2 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
          <NavLink to="/admin" className="flex items-center gap-3">
            <img src="/brand/mark-square.png" alt="PrimeXPixel" className="h-8 w-8 object-contain" />
            <div>
              <span className="font-display text-sm font-bold tracking-tight text-app">
                PrimeX<span className="gradient-text">Pixel</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand-blue)]">
                Admin Panel
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-dim hover:text-app lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-dim">
            Content Management
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'gradient-brand text-white shadow-md shadow-[color:var(--color-brand-blue)]/20'
                    : 'text-muted hover:bg-white/5 hover:text-app'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <link.icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-white' : 'text-dim group-hover:text-[color:var(--color-brand-blue)]'
                      }`}
                    />
                    <span>{link.label}</span>
                  </div>
                  {link.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--surface)] text-dim border border-[var(--border)]'
                      }`}
                    >
                      {link.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info in sidebar */}
        <div className="border-t border-[var(--border)] p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-app/50 py-2.5 text-xs font-medium text-muted hover:border-[var(--border-strong)] hover:text-app transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
            <span>Open Live Website</span>
          </a>
          <p className="mt-3 text-center text-[10px] text-dim">
            PrimeXPixel Admin v2.0 • Secured
          </p>
        </div>
      </aside>
    </>
  );
};
