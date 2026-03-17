import { useLanguage } from '../contexts/LanguageContext';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

type ActivitiesProps = {
  navigate: (path: string) => void;
};

export function Activities({ navigate }: ActivitiesProps) {
  const { language, t } = useLanguage();

  const activities = [
    { num: 1, title: t('activities.activity1Title'), desc: t('activities.activity1Desc') },
    { num: 2, title: t('activities.activity2Title'), desc: t('activities.activity2Desc') },
    { num: 3, title: t('activities.activity3Title'), desc: t('activities.activity3Desc') },
    { num: 4, title: t('activities.activity4Title'), desc: t('activities.activity4Desc') },
    { num: 5, title: t('activities.activity5Title'), desc: t('activities.activity5Desc') },
    { num: 6, title: t('activities.activity6Title'), desc: t('activities.activity6Desc') },
    { num: 7, title: t('activities.activity7Title'), desc: t('activities.activity7Desc') },
    { num: 8, title: t('activities.activity8Title'), desc: t('activities.activity8Desc') },
    { num: 9, title: t('activities.activity9Title'), desc: t('activities.activity9Desc') },
    { num: 10, title: t('activities.activity10Title'), desc: t('activities.activity10Desc') },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('activities.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('activities.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-12 sm:mb-20">
          {activities.map((activity) => (
            <div
              key={activity.num}
              className="bg-gradient-to-br from-brand-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 sm:p-8 hover:shadow-lg transition-shadow duration-300 border border-brand-100 dark:border-gray-600"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-600 text-white font-bold text-lg">
                    {activity.num}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {activity.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {activity.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-brand-700 to-gray-900 rounded-lg p-6 sm:p-8 lg:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              {t('activities.contactUs')}
            </h2>
            <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8">
              {t('activities.contactDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-2">{t('activities.phone')}</p>
                <a href="tel:+201222142359" className="text-sm opacity-90 hover:opacity-100 transition-opacity" dir="ltr">+20 122 214 2359</a>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-2">{t('activities.email')}</p>
                <a href="mailto:manabeaalkhair@gmail.com" className="text-sm opacity-90 hover:opacity-100 transition-opacity break-all" dir="ltr">manabeaalkhair@gmail.com</a>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <MapPin className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold mb-2">{t('activities.location')}</p>
                <p className="text-sm opacity-90">{t('activities.locationValue')}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/contact')}
              className="mt-8 bg-white text-brand-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              {t('activities.sendMessage')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
