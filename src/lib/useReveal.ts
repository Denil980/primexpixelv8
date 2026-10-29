import { useEffect } from 'react';

// Adds `.in` to any `.reveal` element when it scrolls into view.
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}
