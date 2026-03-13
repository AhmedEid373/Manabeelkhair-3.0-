import { Users, Lightbulb, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';
import { VolunteerForm } from '../components/VolunteerForm';

const colorMap: Record<string, string> = {
  brand: 'bg-brand-600',
  dark: 'bg-gray-800',
};

const bgMap: Record<string, string> = {
  brand: 'bg-brand-50 dark:bg-brand-900/20 border-brand-100 dark:border-brand-900',
  dark: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
};

export function Volunteer() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const VOLUNTEER_AREAS = [
    {
      icon: Users,
      color: 'brand',
      title: t('volunteer.area1Title'),
      desc: t('volunteer.area1Desc'),
    },
    {
      icon: ShieldCheck,
      color: 'dark',
      title: t('volunteer.area2Title'),
      desc: t('volunteer.area2Desc'),
    },
    {
      icon: Lightbulb,
      color: 'brand',
      title: t('volunteer.area3Title'),
      desc: t('volunteer.area3Desc'),
    },
    {
      icon: Award,
      color: 'dark',
      title: t('volunteer.area4Title'),
      desc: t('volunteer.area4Desc'),
    },
  ];

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors" dir={dir}>
      <section className="bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              {t('volunteer.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t('volunteer.title')}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('volunteer.desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-14">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('volunteer.areasTitle')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{t('volunteer.areasDesc')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {VOLUNTEER_AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.title}
                    className={`border rounded-2xl p-6 flex items-start gap-4 ${bgMap[area.color]}`}
                  >
                    <div className={`${colorMap[area.color]} rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{area.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-center mb-8">
              <span className="inline-block bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {t('volunteer.registerBadge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t('volunteer.registerTitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
                {t('volunteer.registerDesc')}
              </p>
            </div>
            <VolunteerForm />
          </div>

        </div>
      </section>
    </div>
  );
}
