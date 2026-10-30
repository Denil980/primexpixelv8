import React, { useState, useRef } from 'react';
import {
  Lock,
  Clock,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { exportDatabaseJSON, importDatabaseJSON, resetDatabaseToDefaults } from '../db';
import { verifyAllContentModules, CrudModuleResult } from '../db/crudVerifier';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export const SettingsAdmin: React.FC = () => {
  const {
    user,
    sessionTimeoutMinutes,
    setSessionTimeoutMinutes,
    updatePassword,
  } = useAuth();
  const { showToast } = useToast();

  // Password change states
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Timeout state
  const [timeoutChoice, setTimeoutChoice] = useState(sessionTimeoutMinutes);

  // CRUD Diagnostics state
  const [testingCrud, setTestingCrud] = useState(false);
  const [crudResults, setCrudResults] = useState<Record<string, CrudModuleResult> | null>(null);

  const handleRunCrudDiagnostics = async () => {
    setTestingCrud(true);
    setCrudResults(null);
    try {
      const results = await verifyAllContentModules();
      setCrudResults(results);
      const allPassed = Object.values(results).every((r) => r.overall);
      if (allPassed) {
        showToast('All 8 content modules verified successfully with 100% PASS!');
      } else {
        showToast('Some module operations failed. Check diagnostic table below.', 'error');
      }
    } catch (err: any) {
      showToast('Diagnostic execution error: ' + (err?.message || String(err)), 'error');
    } finally {
      setTestingCrud(false);
    }
  };

  // Reset confirmation modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const importFileRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setUpdatingPassword(true);
    try {
      const result = await updatePassword(currentPass, newPass);
      if (result.success) {
        showToast('Password updated successfully');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        showToast(result.error || 'Failed to update password', 'error');
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleTimeoutSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await setSessionTimeoutMinutes(Number(timeoutChoice));
    showToast(`Session timeout set to ${timeoutChoice} minutes`);
  };

  const handleExport = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `primexpixel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully as JSON file');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const success = importDatabaseJSON(text);
        if (success) {
          showToast('Database successfully restored from JSON file');
        } else {
          showToast('Invalid backup file structure', 'error');
        }
      } catch {
        showToast('Failed to parse backup file', 'error');
      }
    };
    reader.readAsText(file);
    if (importFileRef.current) importFileRef.current.value = '';
  };

  const handleResetToDefaults = () => {
    resetDatabaseToDefaults();
    showToast('Database has been reset to original website defaults');
    setShowResetModal(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-app">
          Settings & Database Backups
        </h2>
        <p className="mt-1 text-xs text-muted">
          Configure security, owner credentials, session timeout and database import/export
        </p>
      </div>

      {/* Account & Session Security */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Change Password Card */}
        <div className="rounded-3xl border border-[var(--border)] card-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-app">Change Owner Password</h3>
              <p className="text-[11px] text-muted">Update your admin login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-muted">Current Password</label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="mt-2 w-full rounded-xl gradient-brand py-2 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50"
            >
              {updatingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Session Inactivity Timeout */}
        <div className="rounded-3xl border border-[var(--border)] card-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-app">Session Timeout</h3>
              <p className="text-[11px] text-muted">Auto-logout duration after inactivity</p>
            </div>
          </div>

          <form onSubmit={handleTimeoutSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-muted">
                Inactivity Expiry Duration
              </label>
              <select
                value={timeoutChoice}
                onChange={(e) => setTimeoutChoice(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2.5 text-xs text-app focus:outline-none"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes (Recommended)</option>
                <option value={120}>2 Hours</option>
              </select>
              <p className="mt-2 text-[11px] text-dim leading-relaxed">
                If the admin window remains idle for this period with no mouse or keyboard activity,
                you will be automatically signed out.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border border-[var(--border)] bg-app py-2 text-xs font-semibold text-app hover:bg-white/5 transition-all"
            >
              Save Timeout Setting
            </button>
          </form>

          <div className="border-t border-[var(--border)] pt-3 text-[11px] text-dim">
            Logged in as: <span className="font-mono text-app">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Live Database CRUD Diagnostics */}
      <div className="rounded-3xl border border-[var(--border)] card-surface p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-app">Live Database CRUD Diagnostics</h3>
              <p className="text-xs text-muted">
                Run an end-to-end automated verification across all 8 modules (Fetch → Create → Verify → Edit → Toggle → Delete → Verify Cleanup)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRunCrudDiagnostics}
            disabled={testingCrud}
            className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50 shrink-0"
          >
            {testingCrud ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Run CRUD Verification</span>
              </>
            )}
          </button>
        </div>

        {crudResults && (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-app-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] text-muted uppercase text-[10px] tracking-wider bg-app">
                <tr>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-3 py-3 text-center">Fetch</th>
                  <th className="px-3 py-3 text-center">Create</th>
                  <th className="px-3 py-3 text-center">Edit</th>
                  <th className="px-3 py-3 text-center">Toggle</th>
                  <th className="px-3 py-3 text-center">Delete</th>
                  <th className="px-3 py-3 text-center">Cleanup</th>
                  <th className="px-4 py-3 text-center">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {Object.values(crudResults).map((r) => (
                  <tr key={r.moduleName} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-app">{r.moduleName}</td>
                    <td className="px-3 py-3 text-center">
                      {r.fetch ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" /> PASS</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]"><XCircle className="h-3.5 w-3.5" /> FAIL</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {r.create ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" /> PASS</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]"><XCircle className="h-3.5 w-3.5" /> FAIL</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {r.edit ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" /> PASS</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]"><XCircle className="h-3.5 w-3.5" /> FAIL</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {r.toggleStatus ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" /> PASS</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]"><XCircle className="h-3.5 w-3.5" /> FAIL</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {r.delete ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" /> PASS</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]"><XCircle className="h-3.5 w-3.5" /> FAIL</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {r.verifyDeleted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" /> PASS</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[11px]"><XCircle className="h-3.5 w-3.5" /> FAIL</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        r.overall ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {r.overall ? '100% PASS' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Database Tools & Backup */}
      <div className="rounded-3xl border border-[var(--border)] card-surface p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-app">Database Backup & Recovery</h3>
            <p className="text-xs text-muted">
              Export all blogs, reviews, works, services, FAQs, and site statistics to a single JSON file
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Export JSON */}
          <div className="rounded-2xl border border-[var(--border)] bg-app-2 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-app">
                <Download className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
                <span>Export Backup</span>
              </div>
              <p className="mt-1 text-[11px] text-dim">
                Download a complete, offline JSON copy of your entire site data.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl gradient-brand py-2 text-xs font-semibold text-white shadow-md"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="rounded-2xl border border-[var(--border)] bg-app-2 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-app">
                <Upload className="h-4 w-4 text-emerald-400" />
                <span>Restore Backup</span>
              </div>
              <p className="mt-1 text-[11px] text-dim">
                Restore site data from a previously downloaded JSON backup file.
              </p>
            </div>
            <div>
              <input
                ref={importFileRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-app py-2 text-xs font-semibold text-app hover:bg-white/5 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Select JSON File</span>
              </button>
            </div>
          </div>

          {/* Reset to defaults */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Defaults</span>
              </div>
              <p className="mt-1 text-[11px] text-dim">
                Restore all original website content from the code repository.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Entire Database to Defaults?"
        message="This will overwrite all current changes in the admin panel and re-populate with the initial website data. Are you sure you want to proceed?"
        confirmLabel="Reset Everything"
        onConfirm={handleResetToDefaults}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
