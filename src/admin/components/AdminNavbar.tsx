import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { LogOut, ExternalLink, Menu, Clock, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  title: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, title }) => {
  const { user, logout, remainingSeconds } = useAuth();
  const { theme, toggle } = useTheme();

  const formatRemainingTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLowTime = remainingSeconds < 300; // less than 5 min

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-app/80 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl border border-[var(--border)] p-2 text-muted hover:bg-white/5 hover:text-app lg:hidden"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-base font-semibold text-app sm:text-lg">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Session timer badge */}
        <div
          className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium md:flex ${
            isLowTime
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 animate-pulse'
              : 'border-[var(--border)] bg-[var(--surface)] text-muted'
          }`}
          title="Session automatically logs out after prolonged inactivity"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Session: {formatRemainingTime(remainingSeconds)}</span>
        </div>

        {/* View live site button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-muted hover:border-[var(--border-strong)] hover:text-app transition-colors sm:flex"
        >
          <ExternalLink className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
          <span>Live Site</span>
        </a>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          className="rounded-xl border border-[var(--border)] p-2 text-muted hover:text-app hover:bg-white/5 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User profile & logout */}
        <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3 sm:gap-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <div className="flex items-center gap-1 text-xs font-semibold text-app">
              <span>{user?.name || (user?.role === 'owner' ? 'PrimeXPixel Owner' : 'Admin')}</span>
              <span title={user?.role ? `${user.role.toUpperCase()} (Verified)` : 'ADMIN'}>
                <ShieldCheck
                  className={`h-3.5 w-3.5 ${
                    user?.role === 'owner' ? 'text-emerald-400' : 'text-blue-400'
                  }`}
                />
              </span>
            </div>
            <div className="text-[10px] text-dim">{user?.email}</div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            title="Log out of admin session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
