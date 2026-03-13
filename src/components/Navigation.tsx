import { Menu, X, Sun, Moon, Languages, HandHeart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { getTranslation } from '../translations';

type NavigationProps = {
  currentPath: string;
  navigate: (path: string) => void;
};

export function Navigation({ currentPath, navigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const t = (key: string) => getTranslation(language, key);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/activities', label: t('nav.activities') },
    { path: '/donate', label: t('nav.donate') },
    { path: '/volunteer', label: t('nav.volunteer') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/privacy', label: t('nav.privacy') },
    ...(user ? [{ path: '/dashboard', label: t('nav.dashboard') }] : []),
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors border-b-2 border-brand-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">

          <div className="flex-shrink-0 pr-4 md:pr-10">
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-new-disgin.png"
                alt="جمعية منابع الخير"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              />
            </button>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`text-sm font-medium whitespace-nowrap px-3 py-2 transition-colors ${
                  currentPath === item.path
                    ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {t('nav.signOut')}
              </button>
            )}
          </div>

          <div className="hidden md:flex flex-shrink-0 items-center gap-1 pl-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center space-x-1"
              aria-label="Toggle language"
            >
              <Languages className="w-5 h-5" />
              <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              onClick={() => handleNavigate('/donate')}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-semibold px-4 py-1.5 rounded-xl shadow-md hover:shadow-lg border-2 border-white transition-all duration-200 whitespace-nowrap text-sm"
            >
              <HandHeart className="w-4 h-4" />
              <span>{t('nav.donateNowBtn')}</span>
            </button>
          </div>

          <div className="md:hidden flex flex-1 justify-end items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              onClick={() => handleNavigate('/donate')}
              className="flex items-center gap-1 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-semibold px-3 py-1.5 rounded-lg text-sm shadow transition-all duration-200"
            >
              <HandHeart className="w-4 h-4" />
              <span>{t('nav.donateMobileBtn')}</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 transition-colors">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`block w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                  currentPath === item.path
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t('nav.signOut')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
