import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor';
  themePreference?: 'dark' | 'light' | 'system';
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sessionTimeoutMinutes: number;
  setSessionTimeoutMinutes: (mins: number) => Promise<void>;
  remainingSeconds: number;
  updatePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_TIMEOUT_MINUTES = 60;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(DEFAULT_TIMEOUT_MINUTES);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_TIMEOUT_MINUTES * 60);

  const timerRef = useRef<any>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Helper to fetch and verify the administrator's database profile from public.admin_users
  const fetchAdminProfile = async (userId: string, authEmail: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, theme_preference')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Failed to query admin_users profile:', error.message);
        return null;
      }

      if (!data) {
        console.warn('[Auth] No profile found in admin_users for user ID:', userId);
        return null;
      }

      // Verify authorized role
      if (!['owner', 'admin', 'editor'].includes(data.role)) {
        console.warn('[Auth] User role is not authorized for admin access:', data.role);
        return null;
      }

      return {
        id: data.id,
        email: data.email || authEmail,
        name: data.full_name || 'Admin',
        role: data.role as 'owner' | 'admin' | 'editor',
        themePreference: data.theme_preference || 'system',
      };
    } catch (err) {
      console.error('[Auth] Unexpected error fetching admin profile:', err);
      return null;
    }
  };

  // Helper to fetch session timeout setting from public.admin_settings
  const fetchSessionTimeout = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'session_timeout_minutes')
        .maybeSingle();

      if (!error && data && data.value !== null && data.value !== undefined) {
        const val = Number(data.value);
        if (!isNaN(val) && val >= 5 && val <= 1440) {
          return val;
        }
      }
    } catch (err) {
      console.warn('[Auth] Could not load session_timeout_minutes from admin_settings:', err);
    }
    return DEFAULT_TIMEOUT_MINUTES;
  };

  // Sign out handler
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
    } finally {
      setUser(null);
      setRemainingSeconds(0);
    }
  }, []);

  // Initialize session from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[Auth] getSession warning:', error.message);
        }

        if (session && session.user) {
          const profile = await fetchAdminProfile(session.user.id, session.user.email || '');
          if (profile) {
            if (isMounted) {
              setUser(profile);
              const timeout = await fetchSessionTimeout();
              setTimeoutMinutes(timeout);
              lastActivityRef.current = Date.now();
              setRemainingSeconds(timeout * 60);
            }
          } else {
            console.warn('[Auth] Authenticated user has no valid admin profile. Signing out.');
            await supabase.auth.signOut();
            if (isMounted) setUser(null);
          }
        } else {
          if (isMounted) setUser(null);
        }
      } catch (err) {
        console.error('[Auth] Initialization error:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes from Supabase Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchAdminProfile(session.user.id, session.user.email || '');
          if (profile) {
            if (isMounted) {
              setUser(profile);
              const timeout = await fetchSessionTimeout();
              setTimeoutMinutes(timeout);
              lastActivityRef.current = Date.now();
              setRemainingSeconds(timeout * 60);
            }
          } else {
            await supabase.auth.signOut();
            if (isMounted) setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setRemainingSeconds(0);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Activity listeners to update countdown timer
  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemainingSeconds(timeoutMinutes * 60);
  }, [timeoutMinutes]);

  useEffect(() => {
    if (!user) return;

    let throttleTimeout: any = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          recordActivity();
          throttleTimeout = null;
        }, 5000); // Throttle activity updates to once every 5 seconds
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
  }, [user, recordActivity]);

  // Session timeout countdown timer
  useEffect(() => {
    if (!user) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = Math.max(0, timeoutMinutes * 60 - elapsed);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        console.warn('[Auth] Inactivity timeout expired. Terminating session.');
        logout();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user, timeoutMinutes, logout]);

  // Authenticate using Supabase Auth
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Invalid email or password. Please verify credentials.',
        };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed: No user record returned.' };
      }

      // Retrieve and verify administrator role in public.admin_users
      const profile = await fetchAdminProfile(data.user.id, data.user.email || cleanEmail);
      if (!profile) {
        // Authenticated in Auth, but not authorized in admin_users
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied: You do not have administrator permissions for this system.',
        };
      }

      setUser(profile);
      const timeout = await fetchSessionTimeout();
      setTimeoutMinutes(timeout);
      lastActivityRef.current = Date.now();
      setRemainingSeconds(timeout * 60);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'An unexpected error occurred during authentication.',
      };
    }
  };

  // Update password using Supabase Auth
  const updatePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    try {
      // 1. Re-authenticate with old password to verify current credentials
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPass,
      });

      if (verifyError) {
        return { success: false, error: 'Current password is incorrect.' };
      }

      // 2. Update to new password via Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPass,
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'An error occurred while updating the password.',
      };
    }
  };

  // Update session timeout setting in database and local state
  const handleSetTimeout = async (mins: number) => {
    if (mins < 5 || mins > 1440) return;
    setTimeoutMinutes(mins);
    lastActivityRef.current = Date.now();
    setRemainingSeconds(mins * 60);

    try {
      await supabase
        .from('admin_settings')
        .update({ value: mins })
        .eq('key', 'session_timeout_minutes');
    } catch (err) {
      console.warn('[Auth] Failed to persist session timeout to admin_settings:', err);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const profile = await fetchAdminProfile(user.id, user.email);
    if (profile) {
      setUser(profile);
    }
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
        refreshProfile,
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
