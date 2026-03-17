import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin, Truck, Users, Building2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export function Contact() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'donation',
    message: '',
    privacyAccepted: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAccepted) return;
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            type: formData.type,
            message: formData.message || null,
          },
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', type: 'donation', message: '', privacyAccepted: false });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(t('contact.errorMsg'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const services = [
    {
      icon: Truck,
      color: 'brand',
      title: t('contact.service1Title'),
      desc: t('contact.service1Desc'),
    },
    {
      icon: Users,
      color: 'dark',
      title: t('contact.service2Title'),
      desc: t('contact.service2Desc'),
    },
    {
      icon: Building2,
      color: 'brand',
      title: t('contact.service3Title'),
      desc: t('contact.service3Desc'),
    },
    {
      icon: MessageCircle,
      color: 'dark',
      title: t('contact.service4Title'),
      desc: t('contact.service4Desc'),
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    brand: { bg: 'bg-brand-50 dark:bg-brand-900/20', icon: 'text-brand-600 dark:text-brand-400', border: 'border-brand-200 dark:border-brand-800' },
    dark: { bg: 'bg-gray-50 dark:bg-gray-800/50', icon: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' },
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors" dir={dir}>
      <section className="bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('contact.contactInfo')}</h2>
                <div className="w-16 h-1 bg-brand-600 rounded-full mb-6"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="bg-brand-100 dark:bg-brand-900/40 p-2.5 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-1">{t('contact.headOffice')}</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                      {t('contact.headOfficeAddress')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="bg-gray-200 dark:bg-gray-700 p-2.5 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">{t('contact.associationPhone')}</p>
                    <a href="tel:+201222142359" className="text-sm text-gray-800 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium" dir="ltr">
                      +20 122 214 2359
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="bg-brand-100 dark:bg-brand-900/40 p-2.5 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-1">{t('contact.officialEmail')}</p>
                    <a href="mailto:manabeaalkhair@gmail.com" className="text-sm text-gray-800 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors break-all" dir="ltr">
                      manabeaalkhair@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="bg-gray-200 dark:bg-gray-700 p-2.5 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">{t('contact.workingHours')}</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {t('contact.workingHoursValue')}<br />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('contact.workingHoursFriday')}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-brand-50 to-gray-50 dark:from-brand-900/20 dark:to-gray-800/20 rounded-xl border border-brand-100 dark:border-brand-900">
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-3">{t('contact.followOfficialPages')}</p>
                <div className="flex flex-col gap-2">
                  <a href="https://www.facebook.com/ManabeaAlkhair/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                      <Facebook className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Manabea Alkhair Association</span>
                  </a>
                  <a href="https://www.instagram.com/ManabeaAlkhair" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-pink-500 to-orange-400 p-1.5 rounded-lg">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">ManabeaAlkhair</span>
                  </a>
                  <a href="https://www.linkedin.com/company/manabeaalkhairassociation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="bg-blue-700 p-1.5 rounded-lg">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Manabea Alkhair Association</span>
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{t('contact.availableServices')}</p>
                <div className="space-y-3">
                  {services.map((service, i) => {
                    const Icon = service.icon;
                    const c = colorMap[service.color];
                    return (
                      <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${c.bg} ${c.border}`}>
                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${c.icon}`} />
                        <div>
                          <p className={`text-sm font-semibold mb-0.5 ${c.icon}`}>{service.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{service.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-gray-900 dark:bg-gray-800 rounded-xl border border-brand-800">
                <p className="text-gray-300 text-sm leading-relaxed text-center">
                  {t('contact.closingMessage')}
                </p>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg transition-colors sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('contact.submitRequest')}</h2>
                <div className="w-12 h-1 bg-brand-600 rounded-full mb-6"></div>

                {status === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300">{t('contact.successTitle')}</h4>
                      <p className="text-green-700 dark:text-green-400 text-sm">{t('contact.successMsg')}</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-800 dark:text-red-300">{t('contact.errorTitle')}</h4>
                      <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.fullName')} <span className="text-brand-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder={t('contact.fullName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.emailAddress')} <span className="text-brand-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.phoneNumber')} <span className="text-brand-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="+20 1XX XXX XXXX"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.reasonForContact')} <span className="text-brand-600">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    >
                      <option value="donation">{t('contact.optionDonation')}</option>
                      <option value="volunteer">{t('contact.optionVolunteer')}</option>
                      <option value="inquiry">{t('contact.optionInquiry')}</option>
                      <option value="partnership">{t('contact.optionPartnership')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 accent-brand-600 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                      {t('contact.privacyConsent')} <span className="text-brand-600 dark:text-brand-400 font-medium">{t('contact.privacyPolicy')}</span> {t('contact.privacyConsentSuffix')}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={status === 'submitting' || !formData.privacyAccepted}
                    className="w-full bg-brand-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-brand-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('contact.submitting')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t('contact.submit')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
