import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Video,
  Briefcase,
  Layers,
  HelpCircle,
  Hash,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Database,
  Download,
  Clock,
} from 'lucide-react';
import { useAdminCollection, exportDatabaseJSON } from '../db';
import { useToast } from '../components/Toast';

export const AdminDashboard: React.FC = () => {
  const { items: blogs } = useAdminCollection('blogs');
  const { items: reviews } = useAdminCollection('reviews');
  const { items: videoReviews } = useAdminCollection('videoReviews');
  const { items: works } = useAdminCollection('works');
  const { items: services } = useAdminCollection('services');
  const { items: faqs } = useAdminCollection('faqs');
  const { items: siteNumbers } = useAdminCollection('siteNumbers');
  const { showToast } = useToast();

  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;
  const draftBlogs = blogs.length - publishedBlogs;
  const activeWorks = works.filter((w) => w.show).length;
  const activeServices = services.filter((s) => s.show).length;

  const handleExportBackup = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `primexpixel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully as JSON backup.');
  };

  const statCards = [
    {
      title: 'Blogs',
      count: blogs.length,
      detail: `${publishedBlogs} published, ${draftBlogs} draft`,
      icon: FileText,
      to: '/admin/blogs',
      color: 'from-blue-500/20 to-blue-500/5 text-blue-400',
    },
    {
      title: 'Our Works',
      count: works.length,
      detail: `${activeWorks} visible in portfolio`,
      icon: Briefcase,
      to: '/admin/works',
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    },
    {
      title: 'Services',
      count: services.length,
      detail: `${activeServices} active service pages`,
      icon: Layers,
      to: '/admin/services',
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400',
    },
    {
      title: 'Text Reviews',
      count: reviews.length,
      detail: `${reviews.filter((r) => r.show).length} visible testimonials`,
      icon: MessageSquare,
      to: '/admin/reviews',
      color: 'from-amber-500/20 to-amber-500/5 text-amber-400',
    },
    {
      title: 'Video Reviews',
      count: videoReviews.length,
      detail: `${videoReviews.filter((v) => v.show).length} active video cards`,
      icon: Video,
      to: '/admin/video-reviews',
      color: 'from-rose-500/20 to-rose-500/5 text-rose-400',
    },
    {
      title: 'Site Numbers',
      count: siteNumbers.length,
      detail: 'Hero, About & Trust stats',
      icon: Hash,
      to: '/admin/site-numbers',
      color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400',
    },
    {
      title: 'FAQ Items',
      count: faqs.length,
      detail: `${faqs.filter((f) => f.show).length} live questions`,
      icon: HelpCircle,
      to: '/admin/faqs',
      color: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] card-surface p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--color-brand-blue)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[color:var(--color-brand-green)]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-app sm:text-3xl">
              Welcome back to <span className="gradient-text">PrimeXPixel</span> Admin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Manage your blogs, client testimonials, video reviews, portfolio projects, services,
              process steps, FAQs, and site numbers without touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-app/60 px-4 py-2.5 text-xs font-medium text-app hover:border-[var(--border-strong)] hover:bg-white/5 transition-all shadow-sm"
            >
              <Download className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
              <span>Download JSON Backup</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
            >
              <span>View Live Website</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-app-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-xl"
          >
            <div className={`mb-4 inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold text-app">{card.count}</span>
              <span className="text-xs text-dim group-hover:text-app flex items-center transition-colors">
                Manage <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
              </span>
            </div>
            <h3 className="mt-1 font-display text-sm font-semibold text-app">{card.title}</h3>
            <p className="mt-1 text-xs text-muted">{card.detail}</p>
          </Link>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-3xl border border-[var(--border)] card-surface p-6">
        <h3 className="font-display text-base font-semibold text-app">Quick Actions</h3>
        <p className="text-xs text-muted mt-0.5">Instant shortcuts to create or update content</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to="/admin/blogs?action=new"
            className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-app p-3 text-xs font-medium text-app hover:border-[color:var(--color-brand-blue)] hover:bg-white/5 transition-all"
          >
            <Plus className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
            <span>Write New Blog</span>
          </Link>

          <Link
            to="/admin/works?action=new"
            className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-app p-3 text-xs font-medium text-app hover:border-[color:var(--color-brand-green)] hover:bg-white/5 transition-all"
          >
            <Plus className="h-4 w-4 text-[color:var(--color-brand-green)]" />
            <span>Add Work Item</span>
          </Link>

          <Link
            to="/admin/reviews?action=new"
            className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-app p-3 text-xs font-medium text-app hover:border-amber-400 hover:bg-white/5 transition-all"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Add Client Review</span>
          </Link>

          <Link
            to="/admin/site-numbers"
            className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-app p-3 text-xs font-medium text-app hover:border-cyan-400 hover:bg-white/5 transition-all"
          >
            <Hash className="h-4 w-4 text-cyan-400" />
            <span>Update Site Numbers</span>
          </Link>
        </div>
      </div>

      {/* System & Storage overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Storage status */}
        <div className="rounded-3xl border border-[var(--border)] bg-app-2 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-app">Database Engine</h4>
              <p className="text-xs text-muted">Reactive Persistent Browser Storage</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-xs text-muted">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span>Status</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Active & Synced
              </span>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span>Storage Driver</span>
              <span className="text-app font-mono">LocalStorage + IndexedDB</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span>Automatic Compression</span>
              <span className="text-app font-semibold">WebP Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Instant Live Updates</span>
              <span className="text-[color:var(--color-brand-blue)] font-medium">Without Redeploy</span>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="rounded-3xl border border-[var(--border)] bg-app-2 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-app">Security & Access</h4>
              <p className="text-xs text-muted">Owner Session & Route Guard Protection</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-xs text-muted">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span>Route Guard</span>
              <span className="font-semibold text-emerald-400">Protected (/admin/*)</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span>Session Inactivity Lock</span>
              <span className="text-app">60 Minutes auto-expiry</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span>Delete Protection</span>
              <span className="text-amber-400">Confirmation Required</span>
            </div>
            <div className="flex justify-between">
              <span>Owner Account</span>
              <span className="text-app font-mono">admin@primexpixel.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
