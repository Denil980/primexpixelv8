import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { AdminGuard } from './auth/AdminGuard';
import { ToastProvider } from './components/Toast';
import { AdminLayout } from './layout/AdminLayout';

import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlogsAdmin } from './pages/BlogsAdmin';
import { ReviewsAdmin } from './pages/ReviewsAdmin';
import { VideoReviewsAdmin } from './pages/VideoReviewsAdmin';
import { WorksAdmin } from './pages/WorksAdmin';
import { ServicesAdmin } from './pages/ServicesAdmin';
import { ProcessAdmin } from './pages/ProcessAdmin';
import { FAQAdmin } from './pages/FAQAdmin';
import { SiteNumbersAdmin } from './pages/SiteNumbersAdmin';
import { SettingsAdmin } from './pages/SettingsAdmin';

export const AdminApp: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Admin Route: Login */}
          <Route path="login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="video-reviews" element={<VideoReviewsAdmin />} />
            <Route path="works" element={<WorksAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="process" element={<ProcessAdmin />} />
            <Route path="faqs" element={<FAQAdmin />} />
            <Route path="site-numbers" element={<SiteNumbersAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AdminApp;
