import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Code2,
  HelpCircle,
  Image as ImageIcon,
  Workflow,
  ShieldCheck,
  PlusCircle,
  MessageSquare,
} from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminService, ServiceFAQItem } from '../types';
import { IconPicker, renderLucideIcon } from '../components/IconPicker';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

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

function getDefaultServiceFaqs(title: string, processCount = 5, highlights: string[] = []): ServiceFAQItem[] {
  return [
    {
      q: `How long does a ${title} project typically take?`,
      a: `Most ${title.toLowerCase()} engagements move through ${processCount} structured stages — from initial audit to final launch — with an exact timeline confirmed during your free discovery session.`,
    },
    {
      q: `How is a ${title} project scoped and priced?`,
      a: `Pricing depends on your requirements, custom scope, and deliverables. Contact us for a custom quote.`,
    },
    {
      q: `What deliverables are included with this service?`,
      a: `You receive complete end-to-end production: ${highlights.slice(0, 3).join(', ') || 'strategy, design, build and QA'}, plus full source assets and dedicated post-launch support.`,
    },
    {
      q: `Can you customize ${title} to integrate with our existing tools?`,
      a: `Yes. We integrate seamlessly with your existing platforms, CMS, analytics, and CRM workflows to ensure frictionless operation without disruption.`,
    },
    {
      q: `What kind of support is provided after launch?`,
      a: `Every engagement includes a dedicated warranty review period after delivery, plus optional continuous maintenance and performance optimisation.`,
    },
  ];
}

export const ServicesAdmin: React.FC = () => {
  const { items: services, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('services');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('Code2');
  const [tagline, setTagline] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [overview, setOverview] = useState('');
  const [whoItIsFor, setWhoItIsFor] = useState('');
  const [ctaText, setCtaText] = useState('Get a Custom Quote');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [processInput, setProcessInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [workCategoriesInput, setWorkCategoriesInput] = useState('');
  const [faqs, setFaqs] = useState<ServiceFAQItem[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [show, setShow] = useState(true);

  const openCreateForm = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setIcon('Code2');
    setTagline('High-performance digital engineering crafted to convert.');
    setHeroImage('/brand/blog/kurla-web-dev.jpg');
    setShortDesc('');
    setFullDesc('');
    setOverview('Comprehensive digital solutions engineered for conversion and brand authority.');
    setWhoItIsFor('Ambitious founders, enterprise teams, and growing brands looking for high-performance execution.');
    setCtaText('Get a Custom Quote');
    setProblem('Outdated digital assets hurt conversion and brand reputation.');
    setSolution('Custom architecture built for speed, conversion and scalability.');
    setHighlightsInput('Sub-second load & 90+ Lighthouse\nFully responsive & accessible\nConversion-first UX');
    setBenefitsInput('Accelerated customer conversion and engagement\nEnterprise-grade quality and pixel-perfect design\nClean architecture you control completely\nDedicated support and performance monitoring');
    setProcessInput('Discovery & Audit\nStrategy & Architecture\nDesign & Prototype\nEngineering & QA\nLaunch & Optimise');
    setTechInput('React, TypeScript, Tailwind CSS');
    setWorkCategoriesInput('Website');
    setFaqs(getDefaultServiceFaqs('New Service'));
    setMetaTitle('');
    setMetaDescription('');
    setShow(true);
    setIsFormOpen(true);
  };

  const openEditForm = (svc: AdminService) => {
    setEditingService(svc);
    setTitle(svc.title);
    setSlug(svc.slug);
    setIcon(svc.icon || 'Code2');
    setTagline(svc.tagline || '');
    setHeroImage(svc.heroImage || DEFAULT_HERO_IMAGES[svc.slug] || '/brand/work/freshy-hero.jpg');
    setShortDesc(svc.shortDesc || '');
    setFullDesc(svc.fullDesc || '');
    setOverview(svc.overview || svc.shortDesc || '');
    setWhoItIsFor(
      svc.whoItIsFor ||
        'Ambitious businesses, founders, and growing enterprises looking to scale their digital presence with measurable results.'
    );
    setCtaText(svc.ctaText || 'Get a Custom Quote');
    setProblem(svc.problem || '');
    setSolution(svc.solution || '');
    setHighlightsInput((svc.highlights || []).join('\n'));
    setBenefitsInput((svc.benefits || []).join('\n'));
    setProcessInput((svc.process || []).join('\n'));
    setTechInput((svc.technologies || []).join(', '));
    setWorkCategoriesInput((svc.workCategories || []).join(', '));
    setFaqs(
      svc.faqs && svc.faqs.length > 0
        ? svc.faqs
        : getDefaultServiceFaqs(svc.title, svc.process?.length || 5, svc.highlights || [])
    );
    setMetaTitle(svc.metaTitle || `${svc.title} Services in Mumbai | PrimeXPixel`);
    setMetaDescription(svc.metaDescription || svc.shortDesc);
    setShow(svc.show);
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingService) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setMetaTitle(`${val} Services in Mumbai | PrimeXPixel`);
      if (DEFAULT_HERO_IMAGES[generatedSlug]) {
        setHeroImage(DEFAULT_HERO_IMAGES[generatedSlug]);
      }
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Service name is required', 'error');
      return;
    }

    const highlights = highlightsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefits = benefitsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const process = processInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const technologies = techInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const workCategories = workCategoriesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const cleanFaqs = faqs.filter((f) => f.q.trim() && f.a.trim());

    const data: Partial<AdminService> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon,
      tagline,
      heroImage: heroImage || DEFAULT_HERO_IMAGES[slug] || '/brand/work/freshy-hero.jpg',
      shortDesc,
      fullDesc,
      overview: overview || shortDesc,
      whoItIsFor:
        whoItIsFor ||
        'Ambitious businesses, founders, and growing enterprises looking to scale their digital presence with measurable results.',
      ctaText: ctaText || 'Get a Custom Quote',
      problem,
      solution,
      highlights,
      benefits,
      process,
      technologies,
      workCategories,
      faqs: cleanFaqs.length > 0 ? cleanFaqs : getDefaultServiceFaqs(title, process.length, highlights),
      gallery: editingService?.gallery || [],
      metaTitle: metaTitle || `${title} Services in Mumbai | PrimeXPixel`,
      metaDescription: metaDescription || shortDesc,
      show,
    };

    if (editingService) {
      update(editingService.id, data);
      showToast('Service updated successfully');
    } else {
      create(data);
      showToast('New service created successfully');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Deleted service "${deleteTarget.title}"`);
      setDeleteTarget(null);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Services Management
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage all 8 sections for every service: Hero, Overview, Features, Benefits, How We Work, Related Work, FAQs & CTA.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-app-2 p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title or description..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-dim">
          {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
        </span>
      </div>

      {/* Sortable Services List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No services found.</p>
        </div>
      ) : (
        <SortableList
          items={filtered}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Services display order updated');
          }}
          renderItem={(svc) => {
            const previewHero = svc.heroImage || DEFAULT_HERO_IMAGES[svc.slug] || '/brand/work/freshy-hero.jpg';
            return (
              <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-app border border-[var(--border)]">
                    <img
                      src={previewHero}
                      alt={svc.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white backdrop-blur-sm">
                        {renderLucideIcon(svc.icon, 'h-4 w-4')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-semibold text-app">{svc.title}</h3>
                      <span className="font-mono text-[10px] text-dim bg-app px-2 py-0.5 rounded border border-[var(--border)]">
                        /{svc.slug}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-muted line-clamp-1">
                      {svc.tagline || svc.shortDesc}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-dim mt-0.5">
                      <span>{svc.highlights?.length || 0} features</span>
                      <span>•</span>
                      <span>{svc.process?.length || 0} steps</span>
                      <span>•</span>
                      <span>{svc.faqs?.length || 5} FAQs</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => toggleStatus(svc.id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                      svc.show
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                    }`}
                  >
                    {svc.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{svc.show ? 'Shown' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(svc)}
                    className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(svc)}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          }}
        />
      )}

      {/* Add / Edit Service Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-4xl rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <div>
                <h3 className="font-display text-base font-bold text-app">
                  {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
                </h3>
                <p className="text-[11px] text-muted">
                  Standardised 8-part layout: Hero, Overview, Inclusions, Benefits, Process, Works, FAQs & CTA.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-dim hover:text-app rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SECTION 1: HERO */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">1</span>
                  <h4 className="font-display text-sm font-semibold text-app">Hero Section (Title, Value Statement, Hero Image, CTA)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Service Name (H1) *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Website Development"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="website-development"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs font-mono text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Icon Picker */}
                <IconPicker value={icon} onChange={setIcon} label="Service Icon" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      One-line Value Statement / Tagline *
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Blazing-fast, scalable websites engineered to convert."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="e.g. Get a Custom Quote or Book a Call"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hero Image */}
                <ImageUploader
                  label="Hero Image (Displayed in Hero Section)"
                  value={heroImage}
                  onChange={setHeroImage}
                  folder="services"
                  helperText="High-resolution hero visual representing this service (auto-compressed to WebP)"
                />
              </div>

              {/* SECTION 2: OVERVIEW */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">2</span>
                  <h4 className="font-display text-sm font-semibold text-app">Overview (What It Is & Who It Is For)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      What This Service Is
                    </label>
                    <textarea
                      rows={3}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      placeholder="Deep explanation of what this service delivers..."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Who This Service Is For
                    </label>
                    <textarea
                      rows={3}
                      value={whoItIsFor}
                      onChange={(e) => setWhoItIsFor(e.target.value)}
                      placeholder="e.g. Ambitious founders, enterprise teams, and growing brands looking for high-performance execution..."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      The Challenge / Problem
                    </label>
                    <textarea
                      rows={2}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="e.g. Outdated digital assets hurt conversion and leave revenue on the table."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2 text-xs text-app focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Our Solution
                    </label>
                    <textarea
                      rows={2}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="e.g. Custom architecture engineered for speed, conversion, and scalability."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2 text-xs text-app focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Short Description (Used in Grid Cards)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Brief 1-2 sentence summary for cards..."
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTIONS 3 & 4: INCLUSIONS & BENEFITS */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">3 & 4</span>
                  <h4 className="font-display text-sm font-semibold text-app">What is Included & Client Benefits</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      What is Included: Features & Deliverables (1 per line)
                    </label>
                    <textarea
                      rows={4}
                      value={highlightsInput}
                      onChange={(e) => setHighlightsInput(e.target.value)}
                      placeholder="Sub-second load times&#10;Custom design architecture&#10;SEO & speed optimization&#10;Full source code ownership"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Benefits: What The Client Gets (Results, not just tasks - 1 per line)
                    </label>
                    <textarea
                      rows={4}
                      value={benefitsInput}
                      onChange={(e) => setBenefitsInput(e.target.value)}
                      placeholder="Accelerated customer conversion and engagement&#10;Enterprise-grade quality and pixel-perfect design&#10;Clean architecture you control completely&#10;Dedicated support and performance monitoring"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTIONS 5 & 6: HOW WE WORK & RELATED WORK */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">5 & 6</span>
                  <h4 className="font-display text-sm font-semibold text-app">How We Work (Process) & Related Portfolio Work</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      How We Work: Step-by-Step for this service (1 per line)
                    </label>
                    <textarea
                      rows={4}
                      value={processInput}
                      onChange={(e) => setProcessInput(e.target.value)}
                      placeholder="Discovery & Audit&#10;Strategy & Information Architecture&#10;Design & Prototyping&#10;Engineering & Rigorous QA&#10;Launch & Scale"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Related Portfolio Categories (comma separated)
                      </label>
                      <input
                        type="text"
                        value={workCategoriesInput}
                        onChange={(e) => setWorkCategoriesInput(e.target.value)}
                        placeholder="Website, UI/UX, Logo, Social Media, Video Editing"
                        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:outline-none"
                      />
                      <span className="text-[10px] text-dim block mt-1">
                        Matches projects from Our Works module to display in "Related Work" on this page.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Technologies / Tools (comma separated)
                      </label>
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="React, Next.js, TypeScript, Tailwind CSS"
                        className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: SERVICE-SPECIFIC FAQs (4 to 6 Questions) */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">7</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-app">
                        Service FAQs (4 to 6 Questions Specific to {title || 'Service'})
                      </h4>
                      <p className="text-[10px] text-dim">
                        Note: No pricing amounts are included in service FAQs per client instructions.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs font-medium text-app hover:border-[color:var(--color-brand-blue)] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[var(--border)] bg-app-2 p-3 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[color:var(--color-brand-blue)]">
                          Question #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleUpdateFaq(index, 'q', e.target.value)}
                        placeholder="e.g. How long does a typical project take?"
                        className="w-full rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs text-app focus:outline-none"
                      />

                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => handleUpdateFaq(index, 'a', e.target.value)}
                        placeholder="Provide clear, reassuring answer..."
                        className="w-full rounded-xl border border-[var(--border)] bg-app p-2 text-xs text-app focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO & Status */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-3">
                <span className="text-xs font-semibold text-[color:var(--color-brand-blue)] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> SEO Metadata & Display Status
                </span>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Meta Title (e.g. Website Development Company Mumbai | PrimeXPixel)"
                  className="w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-app focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Meta Description"
                  className="w-full rounded-xl border border-[var(--border)] bg-app-2 p-2 text-xs text-app focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">Visibility:</span>
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                      show
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                    }`}
                  >
                    {show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{show ? 'Visible on Website' : 'Hidden as Draft'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-medium text-muted hover:text-app"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl gradient-brand px-5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
                  >
                    {editingService ? 'Save Service' : 'Create Service'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Service?"
        message={`Are you sure you want to permanently delete the "${deleteTarget?.title}" service?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
