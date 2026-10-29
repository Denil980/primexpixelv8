import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  Cpu,
  Search,
  MousePointerClick,
  Headphones,
  Code2,
  ShoppingBag,
  PenTool,
  Palette,
  Clapperboard,
  Share2,
  Megaphone,
  HeartPulse,
  Landmark,
  Building2,
  GraduationCap,
  Store,
  Rocket,
  UtensilsCrossed,
  Briefcase,
  Target,
  Bot,
  Boxes,
  Camera,
  PenLine,
  ShieldCheck,
  Star,
  Award,
  Zap,
  Globe,
  Layers,
  Sparkles,
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  TrendingUp,
  Cpu,
  Search,
  MousePointerClick,
  Headphones,
  Code2,
  ShoppingBag,
  PenTool,
  Palette,
  Clapperboard,
  Share2,
  Megaphone,
  HeartPulse,
  Landmark,
  Building2,
  GraduationCap,
  Store,
  Rocket,
  UtensilsCrossed,
  Briefcase,
  Target,
  Bot,
  Boxes,
  Camera,
  PenLine,
  ShieldCheck,
  Star,
  Award,
  Zap,
  Globe,
  Layers,
  Sparkles,
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label = 'Select Icon',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const CurrentIcon = AVAILABLE_ICONS[value] || Code2;

  const filtered = Object.keys(AVAILABLE_ICONS).filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app hover:border-[var(--border-strong)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]">
              <CurrentIcon className="h-4 w-4" />
            </span>
            <span className="font-medium">{value || 'Choose an icon'}</span>
          </div>
          <span className="text-xs text-dim">{isOpen ? 'Close' : 'Change'}</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-app-2 p-3 shadow-2xl animate-fade-in">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search icon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-app px-3 py-1.5 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {filtered.map((name) => {
                const IconComponent = AVAILABLE_ICONS[name];
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
                      isSelected
                        ? 'border border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)]/15 text-[color:var(--color-brand-blue)]'
                        : 'border border-transparent hover:bg-white/5 text-muted hover:text-app'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="truncate w-full text-[10px]">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function renderLucideIcon(iconName: string, className = 'h-5 w-5') {
  const IconComponent = AVAILABLE_ICONS[iconName] || Code2;
  return <IconComponent className={className} />;
}
