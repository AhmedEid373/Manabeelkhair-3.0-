import { Heart, Building2, MapPin, RefreshCw, UserCheck, Copy, CheckCircle, Phone, Mail, FileText, Shield } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DonationContactForm } from '../components/DonationContactForm';

export function Donate() {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankDetails = [
    { label: t('donate.beneficiaryName'), value: language === 'en' ? 'Manabea Al-Khair Association' : 'جمعية منابع الخير' },
    { label: t('donate.bank'), value: language === 'en' ? 'Al Baraka Bank – Egypt' : 'بنك البركة – مصر' },
    { label: t('donate.accountNumber'), value: '8130000113087114001' },
    { label: 'IBAN', value: 'EG380022011330000113087114001' },
  ];

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors" dir={dir}>
      <section className="bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('donate.title')}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('donate.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {t('donate.officialChannelsBadge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('donate.officialChannelsTitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('donate.officialChannelsDesc')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-brand-600 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{t('donate.bankTransferTitle')}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bankDetails.map((item) => (
                      <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm break-all">{item.value}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(item.value, item.label)}
                          className="flex-shrink-0 p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                          title={t('donate.copyBtn')}
                        >
                          {copied === item.label ? (
                            <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-gray-800 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{t('donate.cashCheckTitle')}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('donate.cashCheckDesc')}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {t('donate.cashCheckAddress')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-brand-700 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{t('donate.recurringTitle')}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('donate.recurringDesc')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full">{t('donate.recurringMonthly')}</span>
                    <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full">{t('donate.recurringQuarterly')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-gray-700 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{t('donate.fieldRepTitle')}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('donate.fieldRepDesc')}
                  </p>
                  <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-900 rounded-xl px-5 py-4">
                    <p className="text-brand-800 dark:text-brand-300 text-sm leading-relaxed">
                      {t('donate.fieldRepNote')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-center mb-8">
                <span className="inline-block bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  {t('donate.contactFormBadge')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('donate.contactFormTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
                  {t('donate.contactFormDesc')}
                </p>
              </div>
              <DonationContactForm />
            </div>

            <div className="mt-10 space-y-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-brand-600 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{t('donate.officialContactTitle')}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                    {t('donate.officialContactDesc')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900 rounded-xl p-4 flex items-center gap-4">
                      <div className="bg-brand-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('donate.associationPhone')}</p>
                        <a
                          href="tel:+201222142359"
                          className="font-bold text-brand-700 dark:text-brand-300 text-base hover:underline tracking-wide"
                          dir="ltr"
                        >
                          +20 122 214 2359
                        </a>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                      <div className="bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('donate.emailLabel')}</p>
                        <a
                          href="mailto:manabeaalkhair@gmail.com"
                          className="font-bold text-gray-800 dark:text-gray-200 text-sm hover:underline break-all"
                          dir="ltr"
                        >
                          manabeaalkhair@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700/40 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    {t('donate.coordinationNote')}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-gray-800 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{t('donate.receiptTitle')}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('donate.receiptDesc')}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 bg-gray-700 dark:bg-gray-600 px-6 py-4">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{t('donate.importantNotesTitle')}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-brand-600 flex-shrink-0"></span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {t('donate.importantNote1')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-brand-600 flex-shrink-0"></span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {t('donate.importantNote2')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-600 to-gray-900 rounded-2xl shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-white" fill="currentColor" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{t('donate.thankYouTitle')}</h3>
                <p className="text-brand-100 leading-relaxed text-base max-w-lg mx-auto">
                  {t('donate.thankYouDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
