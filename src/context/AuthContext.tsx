import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'Farmer' | 'Agriculture Expert' | 'Admin';
  district: string;
  state: string;
  region?: string;
  avatar_url?: string;
}

interface SignUpMetadata {
  name: string;
  phone?: string;
  district?: string;
  state?: string;
  role?: 'Farmer' | 'Agriculture Expert';
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  rawUser: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  demoLogin: (role?: 'Farmer' | 'Agriculture Expert') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_FARMER_USER: UserProfile = {
  id: 'demo-farmer-id-123',
  email: 'ramesh.patil@agrirakshak.in',
  name: 'Ramesh Patil',
  phone: '9876543210',
  role: 'Farmer',
  district: 'Kopargaon',
  state: 'Maharashtra',
};

const DEMO_EXPERT_USER: UserProfile = {
  id: 'demo-expert-id-456',
  email: 'dr.sharma@agrirakshak.in',
  name: 'Dr. Anita Sharma',
  phone: '9812345678',
  role: 'Agriculture Expert',
  district: 'Pune',
  state: 'Maharashtra',
};

const LOCAL_STORAGE_USER_KEY = 'agri_rakshak_demo_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or build UserProfile from Supabase session & profiles table
  const fetchUserProfile = async (authUser: User) => {
    try {
      if (!isSupabaseConfigured) {
        return;
      }
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile from Supabase:', error.message);
      }

      const meta = authUser.user_metadata || {};
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        name: profileData?.name || meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Farmer',
        phone: profileData?.phone || meta.phone || '',
        role: profileData?.role || meta.role || 'Farmer',
        district: profileData?.district || meta.district || 'Kopargaon',
        state: profileData?.state || meta.state || 'Maharashtra',
        region: profileData?.district || meta.district || 'Kopargaon',
        avatar_url: profileData?.avatar_url,
      };

      setUser(userProfile);
    } catch (err) {
      console.error('Failed to resolve profile:', err);
    }
  };

  useEffect(() => {
    // 1. If Supabase is configured, use Supabase Auth session listener
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setRawUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        setRawUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Demo / Fallback Mode using local Storage
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(DEMO_FARMER_USER);
        }
      } else {
        // Default demo login for instant review
        setUser(DEMO_FARMER_USER);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      // Fallback demo sign in logic
      if (email.includes('expert')) {
        demoLogin('Agriculture Expert');
      } else {
        demoLogin('Farmer');
      }
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      await fetchUserProfile(data.user);
    }
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata): Promise<void> => {
    if (!isSupabaseConfigured) {
      const newUser: UserProfile = {
        id: `demo-${Date.now()}`,
        email,
        name: metadata.name,
        phone: metadata.phone || '',
        role: metadata.role || 'Farmer',
        district: metadata.district || 'Kopargaon',
        state: metadata.state || 'Maharashtra',
      };
      setUser(newUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.name,
          phone: metadata.phone || '',
          district: metadata.district || 'Kopargaon',
          state: metadata.state || 'Maharashtra',
          role: metadata.role || 'Farmer',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      // Also insert into profiles table directly for immediate consistency
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name: metadata.name,
        email,
        phone: metadata.phone || '',
        role: metadata.role || 'Farmer',
        district: metadata.district || 'Kopargaon',
        state: metadata.state || 'Maharashtra',
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.warn('Profile table insert warning:', profileError.message);
      }

      await fetchUserProfile(data.user);
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRawUser(null);
    setSession(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: true,
        message: 'Demo mode: Password reset email link simulated successfully for ' + email,
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Password reset link sent! Check your email inbox.',
    };
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: true,
        message: 'Demo mode: Password updated successfully!',
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Password updated successfully!' };
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) return;
    const updatedUser: UserProfile = { ...user, ...updates };
    setUser(updatedUser);

    if (!isSupabaseConfigured) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      district: updatedUser.district,
      state: updatedUser.state,
      avatar_url: updatedUser.avatar_url,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to update Supabase profile:', error.message);
    }
  };

  const demoLogin = (role: 'Farmer' | 'Agriculture Expert' = 'Farmer') => {
    const selectedUser = role === 'Agriculture Expert' ? DEMO_EXPERT_USER : DEMO_FARMER_USER;
    setUser(selectedUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(selectedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        rawUser,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
