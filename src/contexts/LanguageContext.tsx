import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getTranslation, Language } from '../translations';

type ContentLookup = (key: string, language: 'ar' | 'en') => string | null;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  setContentLookup: (fn: ContentLookup) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });
  const [contentLookup, setContentLookupState] = useState<ContentLookup | null>(null);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setContentLookup = useCallback((fn: ContentLookup) => {
    setContentLookupState(() => fn);
  }, []);

  const t = useCallback((key: string): string => {
    // Check dynamic DB content first
    if (contentLookup) {
      const dbValue = contentLookup(key, language);
      if (dbValue !== null && dbValue !== '') {
        return dbValue;
      }
    }
    // Fall back to hardcoded translations
    return getTranslation(language, key);
  }, [language, contentLookup]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, setContentLookup }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
