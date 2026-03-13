import { Shield, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

export function Privacy() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const sections = [
    {
      icon: Shield,
      color: 'teal',
      title: t('privacy.section1Title'),
      badge: t('privacy.section1Badge'),
      content: [
        t('privacy.section1Content1'),
        t('privacy.section1Content2'),
        t('privacy.section1Content3'),
        t('privacy.section1Content4'),
      ],
      points: [
        t('privacy.section1Point1'),
        t('privacy.section1Point2'),
        t('privacy.section1Point3'),
        t('privacy.section1Point4'),
      ],
    },
    {
      icon: FileText,
      color: 'blue',
      title: t('privacy.section2Title'),
      badge: t('privacy.section2Badge'),
      content: [
        t('privacy.section2Content1'),
        t('privacy.section2Content2'),
        t('privacy.section2Content3'),
      ],
      points: [
        t('privacy.section2Point1'),
        t('privacy.section2Point2'),
        t('privacy.section2Point3'),
        t('privacy.section2Point4'),
      ],
    },
    {
      icon: BarChart3,
      color: 'green',
      title: t('privacy.section3Title'),
      badge: t('privacy.section3Badge'),
      content: [
        t('privacy.section3Content1'),
        t('privacy.section3Content2'),
        t('privacy.section3Content3'),
      ],
      points: [
        t('privacy.section3Point1'),
        t('privacy.section3Point2'),
        t('privacy.section3Point3'),
        t('privacy.section3Point4'),
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; iconBg: string; icon: string; badge: string; border: string; point: string; accentBg: string }> = {
    teal: {
      bg: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/10',
      iconBg: 'bg-teal-100 dark:bg-teal-900/40',
      icon: 'text-teal-600 dark:text-teal-400',
      badge: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
      point: 'text-teal-500 dark:text-teal-400',
      accentBg: 'bg-teal-600',
    },
    blue: {
      bg: 'from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/10',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      point: 'text-blue-500 dark:text-blue-400',
      accentBg: 'bg-blue-600',
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      point: 'text-green-500 dark:text-green-400',
      accentBg: 'bg-green-600',
    },
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors" dir={dir}>
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('privacy.subtitle')}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>{t('privacy.lastUpdated')}</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {sections.map((section, i) => {
            const Icon = section.icon;
            const c = colorMap[section.color];
            return (
              <div key={i} className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} overflow-hidden`}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`${c.iconBg} p-3 rounded-xl flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                    <div>
                      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${c.badge}`}>
                        {section.badge}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {section.content.map((paragraph, j) => (
                      <p key={j} className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className={`border-t ${c.border} pt-5`}>
                    <p className={`text-xs font-semibold ${c.icon} uppercase tracking-wide mb-3`}>{t('privacy.keyCommitmentsLabel')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {section.points.map((point, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.point}`} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('privacy.closingText')}{' '}
              <a href="mailto:manabeaalkhair@gmail.com" className="text-teal-400 hover:text-teal-300 transition-colors font-medium" dir="ltr">
                manabeaalkhair@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
