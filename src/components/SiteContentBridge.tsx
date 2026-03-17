import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteContent } from '../contexts/SiteContentContext';

export function SiteContentBridge() {
  const { setContentLookup } = useLanguage();
  const { getContent } = useSiteContent();

  useEffect(() => {
    setContentLookup(getContent);
  }, [setContentLookup, getContent]);

  return null;
}
