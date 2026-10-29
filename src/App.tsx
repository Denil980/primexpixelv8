import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { ThemeProvider } from './lib/ThemeContext';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Work from './pages/Work';
import WorkDetail from './pages/WorkDetail';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Panel Module
import AdminApp from './admin/AdminApp';

function SmoothScroll() {
  const { pathname, search } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable smooth-scroll wrapper on admin routes
    if (pathname.startsWith('/admin')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      return;
    }
    // Reset both Lenis's internal scroll state and the native scroll position
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

function AnimatedRoutes() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

  return (
    <main key={pathname} style={{ animation: 'char-in 0.6s ease' }}>
      <Routes location={{ pathname } as never}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Loader />}
      {!isAdmin && <Cursor />}
      {!isAdmin && <SmoothScroll />}
      {!isAdmin && <Navbar />}
      <AnimatedRoutes />
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  );
}
