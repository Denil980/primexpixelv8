import {
  ArrowUpRight, CheckCircle2,
  Gauge, Smartphone, Database, Search,
  ShoppingCart, CreditCard, RefreshCw, BarChart3,
  Users, Layers, MousePointer2, Accessibility,
  Shapes, BookOpen, Printer, Sparkles,
  Film, Wand2, Palette, Grid3x3,
  Calendar, Camera, MessageCircle, Megaphone,
  Target, Mail,
  Settings2, Bot, Workflow, GitBranch,
  Puzzle, Package, ShieldCheck, Plug,
  SlidersHorizontal, Share2, Clapperboard, FileEdit, Newspaper, Hash,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveServices } from '../../lib/useAdminData';
import { renderLucideIcon } from '../../admin/components/IconPicker';
import SectionHeading from '../SectionHeading';

const highlightIcons: Record<string, LucideIcon> = {
  'Sub-second load & 90+ Lighthouse': Gauge,
  'Fully responsive & accessible': Smartphone,
  'Headless CMS you control': Database,
  'SEO-ready architecture': Search,
  'Optimised 2-step checkout': ShoppingCart,
  'Payment & logistics integrations': CreditCard,
  'Inventory & CRM sync': RefreshCw,
  'Revenue analytics dashboards': BarChart3,
  'User research & usability testing': Users,
  'Scalable design systems': Layers,
  'Interactive prototypes': MousePointer2,
  'Accessibility built-in': Accessibility,
  'Logo & identity systems': Shapes,
  'Complete brand guidelines': BookOpen,
  'Marketing & print collateral': Printer,
  'Ready-to-use social templates': Sparkles,
  'Reels, shorts & long-form': Film,
  'Custom motion graphics': Wand2,
  'Professional colour grading': Palette,
  'Platform-native formats': Grid3x3,
  'Content strategy & calendar': Calendar,
  'Creative production': Camera,
  'Community management': MessageCircle,
  'Paid social campaigns': Megaphone,
  'SEO & content marketing': Search,
  'Paid search & social': Target,
  'Email & marketing automation': Mail,
  'Revenue attribution & reporting': BarChart3,
  'Custom CRM setup & integration': Settings2,
  'AI chatbots & lead capture': Bot,
  'Automated follow-ups & workflows': Workflow,
  'Smart pipeline & reporting': GitBranch,
  'Custom modules for your workflow': Puzzle,
  'Real-time inventory & finance': Package,
  'Role-based dashboards & access': ShieldCheck,
  'Third-party & API integrations': Plug,
  'Photo & video shoots': Camera,
  'Professional editing & retouching': SlidersHorizontal,
  'Reels & short-form content': Film,
  'Platform-ready exports': Share2,
  'Video & ad scripts': Clapperboard,
  'Website & landing page copy': FileEdit,
  'Blog & SEO content': Newspaper,
  'Social captions & campaigns': Hash,
};

export default function ServicesGrid() {
  const services = useLiveServices();

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What We Do"
          title="Full-stack services to"
          highlight="launch and scale"
          sub="From first pixel to compounding growth — every capability you need under one roof."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, i: number) => {
            const tint = i % 2 === 0 ? 'rgba(5,130,213,0.16)' : 'rgba(151,199,61,0.16)';
            return (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group reveal relative flex flex-col overflow-hidden rounded-2xl card-surface p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full transition-transform duration-700 group-hover:scale-125"
                  style={{ background: `radial-gradient(circle, ${tint}, transparent 70%)` }}
                />
                <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)]">
                  {typeof service.icon === 'string' ? (
                    renderLucideIcon(service.icon, 'h-5 w-5 text-[color:var(--color-brand-blue)]')
                  ) : service.icon ? (
                    <service.icon className="h-5 w-5 text-[color:var(--color-brand-blue)]" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-[color:var(--color-brand-blue)]" />
                  )}
                </span>
                <h3 className="relative mt-6 font-display text-xl font-semibold text-app">{service.title}</h3>
                <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{service.desc || service.shortDesc}</p>
                <ul className="relative mt-5 space-y-2.5">
                  {(service.highlights || []).slice(0, 4).map((highlight: string) => {
                    const HighlightIcon = highlightIcons[highlight] ?? CheckCircle2;
                    return (
                      <li key={highlight} className="flex items-center gap-2.5 text-sm text-muted">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[color:var(--color-brand-green)]/30 bg-[color:var(--color-brand-green)]/5">
                          <HighlightIcon className="h-3.5 w-3.5 text-[color:var(--color-brand-green)]" />
                        </span>
                        {highlight}
                      </li>
                    );
                  })}
                </ul>
                <span className="relative mt-6 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-sm font-medium gradient-text">
                  Learn More <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
