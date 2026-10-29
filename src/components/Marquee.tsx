const items = ['Website Development', 'UI/UX Design', 'Branding', 'Digital Marketing', 'Social Media Management', 'Video Editing', 'Ecommerce', 'Graphic Design', 'Content Creation', 'Content Writing'];

export default function Marquee() { return <section className="overflow-hidden border-y border-[var(--border)] bg-app-2 py-5"><div className="marquee-track flex w-max gap-10 px-5">{[...items, ...items].map((item, index) => <span key={`${item}-${index}`} className="font-display text-lg font-semibold text-app">{item}<span className="ml-10 gradient-text">✦</span></span>)}</div></section>; }
