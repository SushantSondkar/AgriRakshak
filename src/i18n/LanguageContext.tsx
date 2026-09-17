import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language, LanguageContextType } from './types';
import { en } from './en';
import { mr } from './mr';
import { hi } from './hi';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_LANG_KEY = 'agri_rakshak_lang';

const dictionaries: Record<Language, typeof en> = {
  en,
  mr,
  hi
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateProfile } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    if (stored === 'en' || stored === 'mr' || stored === 'hi') {
      return stored as Language;
    }
    return 'en';
  });

  // Sync with user's preferred_language from Supabase profile on login
  useEffect(() => {
    if (user && (user as any).preferred_language) {
      const userLang = (user as any).preferred_language;
      if (userLang === 'en' || userLang === 'mr' || userLang === 'hi') {
        setLanguageState(userLang as Language);
        localStorage.setItem(LOCAL_STORAGE_LANG_KEY, userLang);
      }
    }
  }, [user]);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, newLang);

    // Save to user profile in Supabase if logged in
    if (user) {
      try {
        await updateProfile({ preferred_language: newLang } as any);
        if (isSupabaseConfigured) {
          await supabase.from('profiles').update({ preferred_language: newLang }).eq('id', user.id);
        }
      } catch (err) {
        console.warn('Failed to persist preferred_language to profile:', err);
      }
    }
  };

  // Translation function: supports dot notation e.g. t('nav.dashboard')
  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let currentObj: any = dictionaries[language] || en;
    let fallbackObj: any = en;

    // Resolve primary dictionary key
    for (const k of keys) {
      if (currentObj && typeof currentObj === 'object' && k in currentObj) {
        currentObj = currentObj[k];
      } else {
        currentObj = undefined;
        break;
      }
    }

    if (typeof currentObj === 'string') {
      return currentObj;
    }

    // Resolve fallback English dictionary key
    for (const k of keys) {
      if (fallbackObj && typeof fallbackObj === 'object' && k in fallbackObj) {
        fallbackObj = fallbackObj[k];
      } else {
        fallbackObj = undefined;
        break;
      }
    }

    if (typeof fallbackObj === 'string') {
      return fallbackObj;
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
