import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919892369965';
const WHATSAPP_MESSAGE =
  "Hi PrimeXPixel! I'm interested in your services and I'd like to know more.";

const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function WhatsAppFloat() {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with PrimeXPixel on WhatsApp"
      className="group fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-3.5 text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-300 hover:pr-5 hover:shadow-[0_10px_34px_rgba(37,211,102,0.55)] active:scale-95 sm:bottom-8 sm:right-8"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <MessageCircle className="h-6 w-6 shrink-0 text-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
