import { useReveal } from '../lib/useReveal';
import Hero from '../components/home/Hero';
import Marquee from '../components/Marquee';
import AboutIntro from '../components/home/AboutIntro';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ServicesGrid from '../components/home/ServicesGrid';
import Process from '../components/home/Process';
import Results from '../components/home/Results';
import Industries from '../components/home/Industries';
import WorkGrid from '../components/WorkGrid';
import TestimonialSlider from '../components/TestimonialSlider';
import BlogGrid from '../components/BlogGrid';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import SectionHeading from '../components/SectionHeading';

export default function Home() {
  useReveal();
  return (
    <>
      <Hero />
      <Marquee />
      <AboutIntro />
      <WhyChooseUs />
      <ServicesGrid />
      <Process />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Featured Work"
            title="Results we're"
            highlight="proud of"
            sub="A selection of engagements where strategy, design and engineering compounded into real growth."
          />
          <div className="mt-14"><WorkGrid limit={6} /></div>
        </div>
      </section>

      <Results />
      <Industries />

      <section className="relative overflow-hidden bg-app-2 px-6 py-24">
        <div className="pointer-events-none absolute inset-0 mesh-glow opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by"
            highlight="ambitious brands"
            sub="Don't take our word for it — hear from the founders and teams we've grown alongside."
          />
          <div className="mt-14"><TestimonialSlider /></div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Insights"
            title="From the"
            highlight="PrimeXPixel journal"
            sub="Practical growth, design and technology thinking from our team."
          />
          <div className="mt-14"><BlogGrid limit={3} /></div>
        </div>
      </section>

      <section id="faq" className="relative overflow-hidden bg-app-2 px-6 py-24">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="FAQ"
            title="FAQ (Frequently Asked"
            highlight="Questions)"
            sub="Everything you need to know before starting your growth journey with us."
          />
          <div className="mt-14"><FAQ /></div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
