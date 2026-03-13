import { Heart, ArrowRight, Award, Target, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

type HomeProps = {
  navigate: (path: string) => void;
};

export function Home({ navigate }: HomeProps) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <section className="relative bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 md:py-24 lg:py-32 transition-colors">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-brand-800/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              {t('home.title')}
              <span className="text-brand-600 dark:text-brand-400"> {t('home.titleHighlight')}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed">
              {t('home.subtitle')}
            </p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-2">
              {t('home.registrationInfo')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <button
                onClick={() => navigate('/contact')}
                className="bg-brand-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-brand-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{t('home.needHelp')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('home.mission')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.missionDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-brand-600 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('home.vision')}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {t('home.visionDesc')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-700/60 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-gray-800 dark:bg-gray-700 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('home.goal')}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {t('home.goalDesc')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="bg-brand-700 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('home.values')}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {t('home.valuesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('home.howItWorks')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{t('home.howItWorksDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('home.step1Title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('home.step1Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 dark:bg-gray-700 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('home.step2Title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('home.step2Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-100 dark:bg-brand-900/30 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('home.step3Title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('home.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-brand-700 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{t('home.ctaTitle')}</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed text-gray-200">
            {t('home.ctaDesc')}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-brand-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
          >
            <span>{t('home.getStarted')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
