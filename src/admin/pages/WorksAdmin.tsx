import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  ExternalLink,
  Layers,
  X,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Image as ImageIcon,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminWorkItem } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';
import { uploadMediaToStorage } from '../../lib/storageService';

const WORK_CATEGORIES = ['Website', 'UI/UX', 'Logo', 'Social Media', 'Video Editing'];

interface WorkCategoryTemplate {
  overview: string;
  description: string;
  challenge: string;
  approach: string;
  outcome: string;
  features: string[];
  highlights: string[];
  resultsList: string[];
  tech: string[];
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  coverImage: string;
  gallery: string[];
}

const WORK_CATEGORY_TEMPLATES: Record<string, WorkCategoryTemplate> = {
  Website: {
    overview:
      'A comprehensive digital web experience engineered to establish brand authority, streamline customer discovery, and deliver seamless responsive experiences across all viewports.',
    description:
      'High-performance, conversion-focused website with sub-second loading speeds, modern card layouts, and an intuitive customer journey.',
    challenge:
      "The client's previous digital presence was outdated, slow on mobile devices, and suffered from high bounce rates and low lead conversion.",
    approach:
      'Designed a modern visual architecture with mobile-first layouts, streamlined navigation, conversion-engineered CTA blocks, and optimized CDN asset performance.',
    outcome:
      'A modern, high-impact web presence that improves user engagement, strengthens brand trust, and simplifies the customer enquiry flow.',
    features: [
      'Premium Hero Section with Clear Value Proposition',
      'Mobile-First Responsive Navigation & Fluid Layouts',
      'Interactive Services & Product Showcase',
      'Customer Testimonials & Verified Social Proof',
      'Conversion-Focused Call-to-Action (CTA) Blocks',
      'Direct WhatsApp & Lead Capture Contact Flow',
    ],
    highlights: [
      'Clean Visual Hierarchy & Modular Design System',
      'Modern Card Layouts with Subtle Micro-Interactions',
      'Sub-Second Page Load Speed & 95+ Performance',
      'High-Contrast Typography Engineered for Readability',
      'Accessible, Cross-Browser Compatibility',
    ],
    resultsList: [
      'Improved User Experience Across Mobile & Desktop',
      'Stronger Brand Authority & Professional Positioning',
      'Streamlined Customer Journey from Discovery to Contact',
      'Fast-Loading Responsive Architecture',
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    metric1: { label: 'Performance', value: '98/100' },
    metric2: { label: 'Mobile Speed', value: 'Sub-second' },
    coverImage: '/brand/work/freshy-cover.jpg',
    gallery: ['/brand/work/freshy-hero.jpg', '/brand/work/freshy-full.jpg'],
  },
  'UI/UX': {
    overview:
      'End-to-end UX research and interface design system created to eliminate user friction, enhance onboarding, and deliver delightful daily user interactions.',
    description:
      'User-centered design architecture focused on intuitive navigation flows, frictionless task completion, and polished design systems that delight users.',
    challenge:
      'Complex user flows, fragmented layouts, and inconsistent design components caused user fatigue and high drop-off during onboarding.',
    approach:
      'Conducted competitor heuristics and user journey mapping, followed by high-fidelity wireframing, interactive prototyping, and design tokens in Figma.',
    outcome:
      'An intuitive, accessible interface system that simplifies complex workflows into seamless, high-confidence user interactions.',
    features: [
      'Intuitive Dashboard & Navigation Architecture',
      'Interactive High-Fidelity Design Prototypes',
      'Comprehensive Figma Design System & Tokens',
      'Accessible Component Library (WCAG 2.1 AA)',
      'Mobile & Tablet Adaptive Layout Specs',
      'Micro-Interactions & State Transition Feedback',
    ],
    highlights: [
      'User-First Wireframing & Clear Task Hierarchy',
      'Consistent Spacing, Elevation & Contrast Rules',
      'Scalable Typography & Iconography System',
      'Streamlined Form Fields & Action Triggers',
      'Developer-Ready Handoff Documentation',
    ],
    resultsList: [
      'Reduced User Friction and Faster Task Completion',
      'Consistent Visual Language Across All Screens',
      'Accelerated Engineering Handoff and Implementation',
      'Higher User Confidence and Satisfaction',
    ],
    tech: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    metric1: { label: 'Design System', value: '40+ Components' },
    metric2: { label: 'Task Flow', value: 'Streamlined' },
    coverImage: '/brand/work/primeheat-cover.jpg',
    gallery: ['/brand/work/primeheat-cover.jpg'],
  },
  Logo: {
    overview:
      'Strategic visual identity design establishing brand positioning, memorable vector iconography, refined typography, and adaptable color palettes.',
    description:
      'Distinctive brand identity and vector logo system designed to make a memorable first impression and maintain visual cohesion across touchpoints.',
    challenge:
      'Lack of a unified visual identity and unmemorable branding diluted brand recall across marketing channels and customer touchpoints.',
    approach:
      'Extensive brand discovery, moodboard exploration, geometric drafting, and real-world mockups across social, print, and digital mediums.',
    outcome:
      'A timeless, scalable brand mark that commands attention, builds immediate recall, and scales seamlessly across all brand assets.',
    features: [
      'Primary & Secondary Vector Logo Lockups',
      'Minimalist App Icon & Favicon Variations',
      'Custom Curated Color Palette & Hex Codes',
      'Complementary Brand Typography Pairings',
      'Comprehensive Brand Guidelines Document',
      'High-Resolution Vector Export Formats (SVG, EPS, PNG)',
    ],
    highlights: [
      'Geometric Balance & Golden Ratio Construction',
      'Multi-Surface Scalability (16px Favicon to Billboard)',
      'Monochrome & Inverted Dark Mode Adaptability',
      'Distinctive Iconography Rooted in Brand Values',
    ],
    resultsList: [
      'Memorable Brand Recognition Across All Platforms',
      'Cohesive Visual Consistency on Social & Web',
      'Ready-to-Use Vector Assets for Print and Screen',
      'Elevated Perceived Brand Value',
    ],
    tech: ['Adobe Illustrator', 'Vector Graphics', 'Brand Identity', 'Figma'],
    metric1: { label: 'Brand Assets', value: 'Full Suite' },
    metric2: { label: 'Formats', value: 'SVG/EPS/PNG' },
    coverImage: '/brand/blog/mahim-branding.jpg',
    gallery: ['/brand/blog/mahim-branding.jpg'],
  },
  'Social Media': {
    overview:
      'Strategic creative campaign combining visual stopping power, brand-consistent layouts, and conversion-focused copy frameworks for social channels.',
    description:
      'High-converting social media creatives and carousel systems engineered to capture feed attention, communicate value instantly, and drive engagement.',
    challenge:
      'Low engagement and inconsistent feed aesthetics made the brand blend in against aggressive competitor feeds.',
    approach:
      'Engineered scroll-stopping hook templates, branded carousel layouts, and high-contrast typography designed for rapid mobile scanning.',
    outcome:
      'A vibrant, cohesive social media content system that commands feed presence and elevates audience interaction.',
    features: [
      'High-Impact Hook Slides & Feed Banners',
      'Multi-Slide Educational & Showcase Carousels',
      'Branded Story & Reel Cover Layouts',
      'Consistent Grid Aesthetic & Visual Rhythm',
      'Engaging Call-To-Action Slide Frameworks',
    ],
    highlights: [
      'Bold Typography Hierarchy Optimized for Mobile Feeds',
      'Vibrant Gradient Accents & High-Contrast Elements',
      'Clean Visual Spacing with Focused Negative Space',
      'Custom Iconography & Infographic Assets',
    ],
    resultsList: [
      'Higher Feed Stopping Power and Audience Retention',
      'Consistent Branded Experience Across Every Post',
      'Clear Message Delivery Under 3 Seconds',
      'Reusable Template System for Fast Publishing',
    ],
    tech: ['Adobe Photoshop', 'Canva Pro', 'Content Strategy', 'Motion Graphics'],
    metric1: { label: 'Visual Grid', value: '100% Cohesive' },
    metric2: { label: 'Creative Suite', value: 'Turnkey' },
    coverImage: '/brand/blog/andheri-social.jpg',
    gallery: ['/brand/blog/andheri-social.jpg'],
  },
  'Video Editing': {
    overview:
      'Engaging short-form and long-form video production combining rhythm-driven cuts, dynamic captions, sound design, and cinematic color grading.',
    description:
      'Dynamic, fast-paced video editing with cinematic color grading, sound design, and motion graphics tailored for maximum viewer retention.',
    challenge:
      'Viewer drop-off in the first 3 seconds and flat audio/visual pacing hindered organic algorithmic reach and audience engagement.',
    approach:
      'Implemented pattern-interrupt hooks, kinetic typography, punch-ins, audio sweetening, and color grading for high visual energy.',
    outcome:
      'A polished, rhythmically tight video production that retains viewers and drives viewer action.',
    features: [
      'Pattern-Interrupt 3-Second Hook Editing',
      'Dynamic Kinetic Subtitles & Animated Text',
      'Multi-Track SFX & Immersive Sound Design',
      'Cinematic Color Grading & Exposure Balancing',
      'Custom Motion Graphic Overlays & Transitions',
    ],
    highlights: [
      'Pacing Synced to Audio Beats for High Retention',
      'High-Clarity Subtitles Optimized for Sound-Off Viewing',
      'Smooth Aspect Ratio Optimization (9:16 & 16:9)',
      'Clean Graphic Lower Thirds & End-Screen Cards',
    ],
    resultsList: [
      'Strong Hook Retention in Crucial First 3 Seconds',
      'Professional Audio-Visual Polish & Immersion',
      'Clear Message Delivery Across Sound-Off Platforms',
      'Optimized Export Specs for Social & Web',
    ],
    tech: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sound Design'],
    metric1: { label: 'Format', value: '4K / 60fps' },
    metric2: { label: 'Audio', value: 'Mastered SFX' },
    coverImage: '/brand/blog/powai-video.jpg',
    gallery: ['/brand/blog/powai-video.jpg'],
  },
};

export const WorksAdmin: React.FC = () => {
  const { items: works, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('works');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingWork, setEditingWork] = useState<AdminWorkItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminWorkItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Website');
  const [coverImage, setCoverImage] = useState('');
  const [galleryInput, setGalleryInput] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Narrative fields
  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [challenge, setChallenge] = useState('');
  const [approach, setApproach] = useState('');
  const [outcome, setOutcome] = useState('');
  const [liveLink, setLiveLink] = useState('https://primexpixel.com');
  const [techInput, setTechInput] = useState('');
  const [year, setYear] = useState('2026');
  const [show, setShow] = useState(true);

  // Dynamic content sections (Features, Highlights, Results)
  const [features, setFeatures] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [resultsList, setResultsList] = useState<string[]>([]);

  // Results quantitative metric badges
  const [metric1Label, setMetric1Label] = useState('Growth');
  const [metric1Value, setMetric1Value] = useState('+150%');
  const [metric2Label, setMetric2Label] = useState('Performance');
  const [metric2Value, setMetric2Value] = useState('99/100');

  const applyCategoryDefaults = (cat: string, force = false) => {
    const tpl = WORK_CATEGORY_TEMPLATES[cat] || WORK_CATEGORY_TEMPLATES['Website'];
    if (!tpl) return;

    if (force || !description) setDescription(tpl.description);
    if (force || !overview) setOverview(tpl.overview);
    if (force || !challenge) setChallenge(tpl.challenge);
    if (force || !approach) setApproach(tpl.approach);
    if (force || !outcome) setOutcome(tpl.outcome);
    if (force || features.length === 0) setFeatures([...tpl.features]);
    if (force || highlights.length === 0) setHighlights([...tpl.highlights]);
    if (force || resultsList.length === 0) setResultsList([...tpl.resultsList]);
    if (force || !techInput) setTechInput(tpl.tech.join(', '));
    if (force || !coverImage) setCoverImage(tpl.coverImage);
    if (force || galleryInput.length === 0) setGalleryInput([...tpl.gallery]);
    if (force || !metric1Label) {
      setMetric1Label(tpl.metric1.label);
      setMetric1Value(tpl.metric1.value);
    }
    if (force || !metric2Label) {
      setMetric2Label(tpl.metric2.label);
      setMetric2Value(tpl.metric2.value);
    }
  };

  const openCreateForm = () => {
    setEditingWork(null);
    setTitle('');
    setSlug('');
    setClient('');
    setCategory('Website');
    setLiveLink('https://primexpixel.com');
    setYear('2026');
    setShow(true);
    setNewGalleryUrl('');

    // Pre-fill rich defaults from the Website template
    const tpl = WORK_CATEGORY_TEMPLATES['Website'];
    setOverview(tpl.overview);
    setDescription(tpl.description);
    setChallenge(tpl.challenge);
    setApproach(tpl.approach);
    setOutcome(tpl.outcome);
    setFeatures([...tpl.features]);
    setHighlights([...tpl.highlights]);
    setResultsList([...tpl.resultsList]);
    setTechInput(tpl.tech.join(', '));
    setMetric1Label(tpl.metric1.label);
    setMetric1Value(tpl.metric1.value);
    setMetric2Label(tpl.metric2.label);
    setMetric2Value(tpl.metric2.value);
    setCoverImage(tpl.coverImage);
    setGalleryInput([...tpl.gallery]);

    setIsFormOpen(true);
  };

  const openEditForm = (work: AdminWorkItem) => {
    setEditingWork(work);
    setTitle(work.title);
    setSlug(work.slug);
    setClient(work.client);
    setCategory(work.category || 'Website');
    setCoverImage(work.coverImage || '');
    setGalleryInput(work.gallery || []);
    setNewGalleryUrl('');

    // Load saved narrative fields without overwriting
    const workAny = work as any;
    setOverview(work.overview || workAny.detail?.overview || work.description || '');
    setDescription(work.description || workAny.detail?.overview || work.outcome || '');
    setChallenge(work.challenge || workAny.detail?.challenge || '');
    setApproach(work.approach || workAny.detail?.approach || '');
    setOutcome(work.outcome || workAny.detail?.outcome || '');
    setLiveLink(work.liveLink || '');
    setTechInput((work.tech || []).join(', '));
    setYear(work.year || '2026');
    setShow(work.show);

    // Dynamic lists: load from work record or detail fallback
    const savedFeatures =
      work.features && work.features.length > 0
        ? work.features
        : workAny.detail?.features && workAny.detail.features.length > 0
        ? workAny.detail.features
        : [];
    const savedHighlights =
      work.highlights && work.highlights.length > 0
        ? work.highlights
        : workAny.detail?.highlights && workAny.detail.highlights.length > 0
        ? workAny.detail.highlights
        : [];
    const savedResultsList =
      work.resultsList && work.resultsList.length > 0
        ? work.resultsList
        : workAny.detail?.resultsList && workAny.detail.resultsList.length > 0
        ? workAny.detail.resultsList
        : [];

    setFeatures(savedFeatures);
    setHighlights(savedHighlights);
    setResultsList(savedResultsList);

    // Metric badges
    const r1 = work.results?.[0] || { label: 'Performance', value: '98/100' };
    const r2 = work.results?.[1] || { label: 'Mobile Speed', value: 'Sub-second' };
    setMetric1Label(r1.label);
    setMetric1Value(r1.value);
    setMetric2Label(r2.label);
    setMetric2Value(r2.value);

    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingWork) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    // When creating a new project, automatically refresh default templates
    if (!editingWork) {
      applyCategoryDefaults(newCat, true);
    }
  };

  const handleManualApplyDefaults = () => {
    applyCategoryDefaults(category, true);
    showToast(`Loaded "${category}" suggested defaults`);
  };

  // Gallery handlers
  const handleAddGalleryImage = (url: string) => {
    if (url.trim()) {
      setGalleryInput((prev) => [...prev, url.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryInput((prev) => prev.filter((_, i) => i !== idx));
  };

  // Dynamic Features Handlers
  const handleAddFeature = () => setFeatures((prev) => [...prev, '']);
  const handleUpdateFeature = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };
  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Highlights Handlers
  const handleAddHighlight = () => setHighlights((prev) => [...prev, '']);
  const handleUpdateHighlight = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };
  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Results Handlers
  const handleAddResult = () => setResultsList((prev) => [...prev, '']);
  const handleUpdateResult = (index: number, val: string) => {
    const updated = [...resultsList];
    updated[index] = val;
    setResultsList(updated);
  };
  const handleRemoveResult = (index: number) => {
    setResultsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      showToast('Project title and client name are required', 'error');
      return;
    }

    const tech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);
    const cleanHighlights = highlights.map((h) => h.trim()).filter(Boolean);
    const cleanResultsList = resultsList.map((r) => r.trim()).filter(Boolean);

    const metrics = [
      { label: metric1Label, value: metric1Value },
      { label: metric2Label, value: metric2Value },
    ].filter((r) => r.label && r.value);

    const data: Partial<AdminWorkItem> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client,
      category,
      coverImage,
      gallery: galleryInput,
      overview: overview || description,
      description: description || overview,
      challenge,
      approach,
      outcome,
      features: cleanFeatures,
      highlights: cleanHighlights,
      resultsList: cleanResultsList,
      liveLink,
      tech,
      year,
      results: metrics,
      show,
    };

    if (editingWork) {
      update(editingWork.id, data);
      showToast('Portfolio project updated successfully');
    } else {
      create(data);
      showToast('New portfolio project added successfully');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Deleted project "${deleteTarget.title}"`);
      setDeleteTarget(null);
    }
  };

  const filtered = works.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.client.toLowerCase().includes(search.toLowerCase()) ||
      w.category.toLowerCase().includes(search.toLowerCase()) ||
      (w.tech || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || w.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Our Works / Portfolio Management
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage all 6 sections: Identity & Gallery, Project Narrative, Key Features, Design Highlights, Results & Metrics, and Technologies.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Work Project</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-app-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, client or tech..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-2.5 py-1.5 text-xs text-muted">
            <Filter className="h-3.5 w-3.5 text-dim" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-app focus:outline-none"
            >
              <option value="all">All Categories</option>
              {WORK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-dim">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>

      {/* Sortable Works List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No portfolio projects found.</p>
        </div>
      ) : (
        <SortableList
          items={filtered}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Works portfolio order updated');
          }}
          renderItem={(w) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-app border border-[var(--border)]">
                  {w.coverImage ? (
                    <img
                      src={w.coverImage}
                      alt={w.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] text-dim">
                      No cover
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[color:var(--color-brand-blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-brand-blue)] border border-[color:var(--color-brand-blue)]/20">
                      {w.category}
                    </span>
                    <span className="text-xs text-dim">• Client: {w.client}</span>
                    <span className="text-xs text-dim">• {w.year}</span>
                  </div>

                  <h3 className="font-display text-sm font-semibold text-app mt-0.5">
                    {w.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-dim mt-0.5">
                    <span>{w.features?.length || 0} features</span>
                    <span>•</span>
                    <span>{w.highlights?.length || 0} highlights</span>
                    <span>•</span>
                    <span>{w.resultsList?.length || 0} results</span>
                    <span>•</span>
                    <span>{w.gallery?.length || 0} images</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(w.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    w.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {w.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{w.show ? 'Shown' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(w)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(w)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Project Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-4xl rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <div>
                <h3 className="font-display text-base font-bold text-app">
                  {editingWork ? `Edit Portfolio Project: ${editingWork.title}` : 'Add New Portfolio Project'}
                </h3>
                <p className="text-[11px] text-muted">
                  Standardised 6-part layout: Identity & Gallery, Narrative, Features, Highlights, Results & Technologies.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualApplyDefaults}
                  title="Reset form fields to suggested category defaults"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:text-app hover:border-[color:var(--color-brand-blue)] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
                  <span>Reload Category Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-dim hover:text-app rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SECTION 1: IDENTITY & HERO */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">1</span>
                  <h4 className="font-display text-sm font-semibold text-app">Project Identity & Hero</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Freshy Fruits"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="e.g. Freshy Fruits Co."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    >
                      {WORK_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="freshy-fruits"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs font-mono text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Year / Timeline
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2025 - 2026"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Live Project URL
                  </label>
                  <input
                    type="text"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app font-mono focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>

                {/* Cover image uploader */}
                <ImageUploader
                  label="Primary Cover Image (Auto-Compressed to WebP)"
                  value={coverImage}
                  onChange={setCoverImage}
                  folder="works"
                  helperText="Primary banner / thumbnail for portfolio grid & hero showcase"
                />

                {/* Gallery Images */}
                <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-app-2 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Project Showcase Gallery ({galleryInput.length})
                      </label>
                      <p className="text-[10px] text-dim">
                        Upload high-res case study screens or add direct image URLs
                      </p>
                    </div>
                    <label className="cursor-pointer text-xs font-semibold text-[color:var(--color-brand-blue)] hover:underline flex items-center gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            showToast('Uploading gallery image to cloud storage...');
                            const res = await uploadMediaToStorage(file, { folder: 'works' });
                            handleAddGalleryImage(res.url);
                            showToast('Gallery image uploaded successfully!');
                          } catch (err: any) {
                            showToast('Failed to upload image: ' + (err?.message || err), 'error');
                          } finally {
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Enter image URL or asset path..."
                      className="flex-1 rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs text-app focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddGalleryImage(newGalleryUrl)}
                      className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-app hover:bg-white/15"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add URL
                    </button>
                  </div>

                  {galleryInput.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {galleryInput.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-black/40"
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1.5 right-1.5 rounded-full bg-red-600/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: PROJECT NARRATIVE */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">2</span>
                  <h4 className="font-display text-sm font-semibold text-app">Project Narrative (Overview, Challenge & Solution)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Project Overview *
                    </label>
                    <textarea
                      rows={3}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      placeholder="Deep explanation of the project context, client background, and digital goals..."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Short Description (Grid Cards & Snippet)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief 1-2 sentence summary for case study cards and previews..."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      The Challenge
                    </label>
                    <textarea
                      rows={3}
                      value={challenge}
                      onChange={(e) => setChallenge(e.target.value)}
                      placeholder="What specific problem, obstacle or friction did the client face?"
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Our Approach & Solution
                    </label>
                    <textarea
                      rows={3}
                      value={approach}
                      onChange={(e) => setApproach(e.target.value)}
                      placeholder="How did PrimeXPixel solve it? Architecture, strategy, and design execution..."
                      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Project Outcome Summary
                  </label>
                  <textarea
                    rows={2}
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="High-level narrative outcome achieved for the client..."
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION 3: KEY FEATURES & DELIVERABLES */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">3</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-app">
                        Key Features & Deliverables ({features.length})
                      </h4>
                      <p className="text-[10px] text-dim">
                        Specific core functionality, modules, and deliverables included in this engagement.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs font-medium text-app hover:border-[color:var(--color-brand-blue)] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
                    <span>Add Feature</span>
                  </button>
                </div>

                {features.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center">
                    <p className="text-xs text-muted">No features added yet. Click "+ Add Feature" above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {features.map((feat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-app-2 p-2"
                      >
                        <span className="grid h-6 w-7 place-items-center rounded-lg bg-app text-[10px] font-bold text-[color:var(--color-brand-blue)]">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(index, e.target.value)}
                          placeholder="e.g. Premium Hero Section with Clear Value Proposition"
                          className="flex-1 rounded-lg border border-[var(--border)] bg-app px-3 py-1.5 text-xs text-app focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 4: DESIGN HIGHLIGHTS */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">4</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-app">
                        Design Highlights ({highlights.length})
                      </h4>
                      <p className="text-[10px] text-dim">
                        Visual architecture, typography, interactions and accessibility highlights.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs font-medium text-app hover:border-[color:var(--color-brand-blue)] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
                    <span>Add Highlight</span>
                  </button>
                </div>

                {highlights.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center">
                    <p className="text-xs text-muted">No design highlights added yet. Click "+ Add Highlight" above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {highlights.map((hl, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-app-2 p-2"
                      >
                        <span className="grid h-6 w-7 place-items-center rounded-lg bg-app text-[10px] font-bold text-emerald-400">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => handleUpdateHighlight(index, e.target.value)}
                          placeholder="e.g. Clean Visual Hierarchy & Modular Design System"
                          className="flex-1 rounded-lg border border-[var(--border)] bg-app px-3 py-1.5 text-xs text-app focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 5: RESULTS & OUTCOMES */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">5</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-app">
                        Project Results & Outcomes ({resultsList.length})
                      </h4>
                      <p className="text-[10px] text-dim">
                        Qualitative outcomes and client impact (starting suggestions — edit to reflect real deliverables).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddResult}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs font-medium text-app hover:border-[color:var(--color-brand-blue)] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
                    <span>Add Result</span>
                  </button>
                </div>

                {resultsList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center">
                    <p className="text-xs text-muted">No result items added yet. Click "+ Add Result" above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resultsList.map((res, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-app-2 p-2"
                      >
                        <span className="grid h-6 w-7 place-items-center rounded-lg bg-app text-[10px] font-bold text-amber-400">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={res}
                          onChange={(e) => handleUpdateResult(index, e.target.value)}
                          placeholder="e.g. Improved User Experience Across Mobile & Desktop"
                          className="flex-1 rounded-lg border border-[var(--border)] bg-app px-3 py-1.5 text-xs text-app focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(index)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantitative Metric Badges */}
                <div className="pt-2 border-t border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" /> Quantitative Metric Badges (Displayed in Hero Banner)
                    </span>
                    <span className="text-[10px] text-dim">e.g. Performance 98/100, Mobile Speed Sub-second</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={metric1Label}
                        onChange={(e) => setMetric1Label(e.target.value)}
                        placeholder="Metric 1 Label (e.g. Performance)"
                        className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-app focus:outline-none"
                      />
                      <input
                        type="text"
                        value={metric1Value}
                        onChange={(e) => setMetric1Value(e.target.value)}
                        placeholder="Metric 1 Value (e.g. 98/100)"
                        className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={metric2Label}
                        onChange={(e) => setMetric2Label(e.target.value)}
                        placeholder="Metric 2 Label (e.g. Mobile Speed)"
                        className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-app focus:outline-none"
                      />
                      <input
                        type="text"
                        value={metric2Value}
                        onChange={(e) => setMetric2Value(e.target.value)}
                        placeholder="Metric 2 Value (e.g. Sub-second)"
                        className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: TECHNOLOGIES & STATUS */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-lg gradient-brand text-white text-[10px] font-bold">6</span>
                  <h4 className="font-display text-sm font-semibold text-app">Technologies & Publication Status</h4>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Technologies / Tools Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, Vite"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:outline-none"
                  />
                  <span className="text-[10px] text-dim block mt-1">
                    Displayed as technology badges on the public project showcase page.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
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
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-medium text-muted hover:text-app transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl gradient-brand px-5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
                >
                  {editingWork ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Portfolio Project?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};