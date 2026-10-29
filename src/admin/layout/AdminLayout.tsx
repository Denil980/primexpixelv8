import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminNavbar } from '../components/AdminNavbar';
import { AdminSidebar } from '../components/AdminSidebar';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/blogs': 'Blogs Management',
  '/admin/reviews': 'Client Reviews Management',
  '/admin/video-reviews': 'Video Testimonials Management',
  '/admin/works': 'Our Works / Portfolio Management',
  '/admin/services': 'Services Management',
  '/admin/process': 'Our Process Management',
  '/admin/faqs': 'FAQ Management',
  '/admin/site-numbers': 'Site Numbers & Statistics Management',
  '/admin/settings': 'Admin Settings & Database Backups',
};

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] || 'Admin Panel';

  return (
    <div className="flex min-h-screen bg-app text-app antialiased selection:bg-[color:var(--color-brand-blue)] selection:text-white">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={title}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
