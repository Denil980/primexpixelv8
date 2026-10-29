import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type Option = { value: string; label: string };

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm outline-none transition-colors ${
          open ? 'border-[color:var(--color-brand-blue)]' : 'border-[var(--border)]'
        } bg-[var(--surface)] text-app`}
      >
        <span className={selected ? 'text-app' : 'text-dim'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[var(--border-strong)] bg-[color:var(--surface-solid)] p-1.5 shadow-premium"
        >
          {options.map((o) => {
            const isSelected = o.value === value;
            return (
              <button
                type="button"
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isSelected ? 'gradient-brand text-white' : 'text-app hover:bg-[var(--surface)]'
                }`}
              >
                {o.label}
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
