import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface AuthUser {
  email: string;
  name: string;
  role: 'owner';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  sessionTimeoutMinutes: number;
  setSessionTimeoutMinutes: (mins: number) => void;
  remainingSeconds: number;
  updatePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
}

const SESSION_KEY = 'primexpixel_admin_session';
const SETTINGS_KEY = 'primexpixel_admin_auth_cfg';

const DEFAULT_CREDENTIALS = {
  email: 'admin@primexpixel.com',
  password: 'primexpixel2026!',
  name: 'PrimeXPixel Owner',
  timeoutMinutes: 60,
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(DEFAULT_CREDENTIALS.timeoutMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(3600);
  const timerRef = useRef<any>(null);

  // Load configured settings
  const getAuthSettings = () => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_CREDENTIALS;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  // Check existing session
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      const settings = getAuthSettings();
      setTimeoutMinutes(settings.timeoutMinutes || 60);

      if (rawSession) {
        const session = JSON.parse(rawSession);
        const now = Date.now();
        if (session && session.expiresAt > now) {
          setUser({
            email: session.email,
            name: settings.name || 'PrimeXPixel Owner',
            role: 'owner',
          });
          const remaining = Math.max(0, Math.floor((session.expiresAt - now) / 1000));
          setRemainingSeconds(remaining);
        } else {
          localStorage.removeItem(SESSION_KEY);
          setUser(null);
        }
      }
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update session expiry on user activity
  const refreshSession = useCallback(() => {
    if (!user) return;
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) {
        const session = JSON.parse(rawSession);
        const expiresAt = Date.now() + timeoutMinutes * 60 * 1000;
        session.expiresAt = expiresAt;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setRemainingSeconds(timeoutMinutes * 60);
      }
    } catch {}
  }, [user, timeoutMinutes]);

  // Activity listeners
  useEffect(() => {
    if (!user) return;

    let throttleTimeout: any = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          refreshSession();
          throttleTimeout = null;
        }, 10000); // Throttle activity updates to once every 10s
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(throttleTimeout);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [user, refreshSession]);

  // Expiration countdown
  useEffect(() => {
    if (!user) return;

    timerRef.current = setInterval(() => {
      try {
        const rawSession = localStorage.getItem(SESSION_KEY);
        if (rawSession) {
          const session = JSON.parse(rawSession);
          const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
          setRemainingSeconds(remaining);

          if (remaining <= 0) {
            logout();
          }
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user, logout]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for security feel
    await new Promise((r) => setTimeout(r, 400));

    const settings = getAuthSettings();
    if (
      email.trim().toLowerCase() === settings.email.toLowerCase() &&
      pass === settings.password
    ) {
      const expiresAt = Date.now() + (settings.timeoutMinutes || 60) * 60 * 1000;
      const session = {
        email: settings.email,
        token: `px_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        expiresAt,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser({
        email: settings.email,
        name: settings.name || 'PrimeXPixel Owner',
        role: 'owner',
      });
      setRemainingSeconds((settings.timeoutMinutes || 60) * 60);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Please verify credentials.' };
  };

  const updatePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    const settings = getAuthSettings();
    if (oldPass !== settings.password) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    settings.password = newPass;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return { success: true };
  };

  const handleSetTimeout = (mins: number) => {
    setTimeoutMinutes(mins);
    const settings = getAuthSettings();
    settings.timeoutMinutes = mins;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    refreshSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        sessionTimeoutMinutes: timeoutMinutes,
        setSessionTimeoutMinutes: handleSetTimeout,
        remainingSeconds,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
