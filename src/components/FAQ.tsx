import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLiveFAQs } from '../lib/useAdminData';

export default function FAQ() {
  // Show only questions initially (null = all closed)
  const [open, setOpen] = useState<number | null>(null);
  const faqs = useLiveFAQs();

  // Generate valid Schema.org JSON-LD structured data for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      {/* FAQ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="reveal mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.id || i}
              className={`overflow-hidden rounded-2xl card-surface transition-all duration-300 ${
                isOpen ? 'border-[color:var(--color-brand-blue)] shadow-md' : 'hover:border-[var(--border-strong)]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
              >
                <span className="font-display text-base font-medium text-app md:text-lg">
                  {f.question}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-brand text-white transition-transform duration-300 ${
                    isOpen ? 'scale-105' : ''
                  }`}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>

              <div
                className="grid transition-all duration-400 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-[var(--border)] px-6 pt-4 pb-6">
                    <p className="text-sm leading-relaxed text-muted">{f.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
