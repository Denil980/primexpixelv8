interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  gradient?: boolean;
}

export default function SplitText({ text, className = '', delay = 0, stagger = 0.03, gradient = false }: Props) {
  const words = text.split(' ');
  let charIndex = 0;
  const charCls = `split-char${gradient ? ' gradient-text' : ''}`;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, ci) => {
            const d = delay + charIndex * stagger;
            charIndex++;
            return (
              <span key={ci} className={charCls} style={{ animationDelay: `${d}s` }} aria-hidden>
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && (
            <span className="split-char" style={{ animationDelay: `${delay + charIndex * stagger}s` }}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
