import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { SiteContentBridge } from './components/SiteContentBridge';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <SiteContentProvider>
          <SiteContentBridge />
          <AuthProvider>
            <App />
          </AuthProvider>
        </SiteContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
