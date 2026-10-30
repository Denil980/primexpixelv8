import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) ||
  '';

const supabaseAnonKey: string =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing or invalid configuration. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env.local.'
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export interface ConnectionCheckResult {
  success: boolean;
  status: 'connected' | 'unconfigured' | 'network_error' | 'auth_error' | 'error';
  message: string;
  details?: string;
}

/**
 * Safe, non-destructive check to verify that the Supabase endpoint is reachable
 * and the publishable key is valid without modifying data or requiring tables.
 */
export async function checkSupabaseConnection(): Promise<ConnectionCheckResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      status: 'unconfigured',
      message: 'Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.',
    };
  }

  try {
    // 1. Verify endpoint reachability via Auth health endpoint
    const healthUrl = `${supabaseUrl.replace(/\/+$/, '')}/auth/v1/health`;
    const healthRes = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    if (!healthRes.ok && healthRes.status !== 200) {
      if (healthRes.status === 401 || healthRes.status === 403) {
        return {
          success: false,
          status: 'auth_error',
          message: 'Supabase returned an authentication error. Please verify VITE_SUPABASE_PUBLISHABLE_KEY.',
        };
      }
      return {
        success: false,
        status: 'error',
        message: `Supabase health endpoint returned status ${healthRes.status} (${healthRes.statusText}).`,
      };
    }

    // 2. Verify PostgREST / Database API key validity with a non-destructive schema probe
    const { error } = await supabase.from('_probe_connection_').select('*').limit(0);

    if (error) {
      // PGRST205 or 42P01 means the request reached the database and authenticated properly,
      // but the table doesn't exist (which is expected before schema creation).
      if (error.code === 'PGRST205' || error.code === '42P01') {
        return {
          success: true,
          status: 'connected',
          message: 'Successfully connected and authenticated with Supabase endpoint.',
        };
      }

      // Check if it's an API key error
      if (error.message && error.message.toLowerCase().includes('invalid api key')) {
        return {
          success: false,
          status: 'auth_error',
          message: 'Invalid API key provided for Supabase.',
          details: error.message,
        };
      }

      // Any other response from PostgREST with valid connection
      return {
        success: true,
        status: 'connected',
        message: 'Successfully reached Supabase endpoint.',
        details: error.message,
      };
    }

    return {
      success: true,
      status: 'connected',
      message: 'Successfully connected to Supabase.',
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'network_error',
      message: 'Network error: Unable to reach the Supabase endpoint.',
      details: err?.message || String(err),
    };
  }
}
