import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@primexpixel.com');
  const [password, setPassword] = useState('primexpixel2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const destination = (location.state as any)?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const destination = (location.state as any)?.from?.pathname || '/admin';
        navigate(destination, { replace: true });
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setError('An unexpected error occurred during login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app px-4 py-12 selection:bg-[color:var(--color-brand-blue)] selection:text-white">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-40" />

      <div className="relative w-full max-w-md">
        {/* Logo and title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-solid)] border border-[var(--border)] shadow-xl">
            <img src="/brand/mark-square.png" alt="PrimeXPixel" className="h-8 w-8 object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-app sm:text-3xl">
            PrimeX<span className="gradient-text">Pixel</span> Admin
          </h1>
          <p className="mt-2 text-sm text-muted">
            Secure owner portal for managing website content
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] card-surface p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[color:var(--color-brand-blue)]/20 bg-[color:var(--color-brand-blue)]/10 p-3.5 text-xs text-[color:var(--color-brand-blue)]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Owner authentication required. Sessions auto-expire on inactivity.</span>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Admin Email
              </label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-dim">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@primexpixel.com"
                  className="w-full rounded-xl border border-[var(--border)] bg-app/80 py-2.5 pl-10 pr-4 text-sm text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Password
              </label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-dim">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-app/80 py-2.5 pl-10 pr-10 text-sm text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-dim hover:text-app"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Quick Default Credentials Hint */}
          <div className="mt-6 border-t border-[var(--border)] pt-4 text-center">
            <p className="text-[11px] text-dim">
              Default Owner: <span className="text-app font-mono">admin@primexpixel.com</span>
              <br />
              Default Password: <span className="text-app font-mono">primexpixel2026!</span>
            </p>
          </div>
        </div>

        {/* Back to public site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-muted hover:text-app transition-colors hover:underline"
          >
            ← Back to PrimeXPixel Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
