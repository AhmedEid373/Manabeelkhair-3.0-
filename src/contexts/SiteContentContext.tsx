import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { db, SiteContent } from '../lib/api';

type SiteContentContextType = {
  content: Record<string, SiteContent>;
  loading: boolean;
  getContent: (key: string, language: 'ar' | 'en') => string | null;
  refreshContent: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await db
        .from('site_content')
        .select('*');

      if (error) {
        console.warn('Failed to fetch site content:', error.message);
        return;
      }

      if (data) {
        const contentMap: Record<string, SiteContent> = {};
        for (const item of data) {
          contentMap[item.section_key] = item as SiteContent;
        }
        setContent(contentMap);
      }
    } catch {
      console.warn('Site content fetch failed, using fallback translations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getContent = useCallback(
    (key: string, language: 'ar' | 'en'): string | null => {
      const item = content[key];
      if (!item) return null;
      return language === 'ar' ? item.content_ar : item.content_en;
    },
    [content]
  );

  return (
    <SiteContentContext.Provider value={{ content, loading, getContent, refreshContent: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
