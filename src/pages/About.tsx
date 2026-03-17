import { Heart, Users, TrendingUp, Globe, Award, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function About() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <section className="bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 sm:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {t('about.title')}
            </h1>
            <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">{t('about.ourStory')}</h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{t('about.ourStoryDesc')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 p-4 sm:p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl sm:text-4xl font-bold text-brand-600 dark:text-brand-400 mb-1 sm:mb-2">{language === 'ar' ? '٥٬٠٠٠+' : '5,000+'}</div>
                <div className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">{t('about.peopleHelped')}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-700/60 p-4 sm:p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">{language === 'ar' ? '١٬٢٠٠+' : '1,200+'}</div>
                <div className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">{t('about.activeVolunteers')}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-700/60 p-4 sm:p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">{language === 'ar' ? '٥٠+' : '50+'}</div>
                <div className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">{t('about.citiesReached')}</div>
              </div>
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 p-4 sm:p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl sm:text-4xl font-bold text-brand-600 dark:text-brand-400 mb-1 sm:mb-2">{language === 'ar' ? '٩٨٪' : '98%'}</div>
                <div className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">{t('about.satisfactionRate')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('about.whatWeDo')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{t('about.whatWeDoDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-brand-100 dark:bg-brand-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {t('about.medicineAssistance')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.medicineAssistanceDesc')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gray-100 dark:bg-gray-800 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {t('about.elderlySupport')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.elderlySupportDesc')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="bg-brand-100 dark:bg-brand-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {t('about.communityNetwork')}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.communityNetworkDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('about.ourValues')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{t('about.ourValuesDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-brand-100 dark:bg-brand-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 dark:text-brand-400" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('about.compassion')}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.compassionDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-gray-100 dark:bg-gray-800 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('about.integrity')}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.integrityDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-gray-100 dark:bg-gray-800 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('about.community')}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.communityDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-brand-100 dark:bg-brand-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('about.excellence')}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.excellenceDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-brand-700 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-brand-300" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('about.impactGrows')}</h2>
            <p className="text-base sm:text-xl leading-relaxed text-gray-200">
              {t('about.impactGrowsDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
