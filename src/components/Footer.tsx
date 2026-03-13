import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

type FooterProps = {
  navigate: (path: string) => void;
};

export function Footer({ navigate }: FooterProps) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/activities', label: t('nav.activities') },
    { path: '/donate', label: t('nav.donate') },
    { path: '/volunteer', label: t('nav.volunteer') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/privacy', label: t('nav.privacy') },
  ];

  return (
    <footer className="bg-gray-900 text-white transition-colors">
      <div className="border-t-4 border-brand-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo-new-disgin.png"
                alt="جمعية منابع الخير"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-400">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-300 hover:text-brand-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-400">{t('footer.contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:manabeaalkhair@gmail.com"
                  className="text-gray-300 hover:text-brand-400 transition-colors break-all"
                  dir="ltr"
                >
                  manabeaalkhair@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+201222142359"
                  className="text-gray-300 hover:text-brand-400 transition-colors"
                  dir="ltr"
                >
                  +20 122 214 2359
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{t('footer.address')}</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-3">{t('footer.followUs')}</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/ManabeaAlkhair/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/ManabeaAlkhair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-pink-500 to-orange-400 p-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/manabeaalkhairassociation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 p-2 rounded-lg text-white hover:bg-blue-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {t('brand.name')}.{' '}
            {t('footer.allRightsReserved')}
          </p>
          <p className="mt-2">
            Made by{' '}
            <a
              href="https://hostinking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-brand-400 transition-colors"
            >
              HostinKing.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
