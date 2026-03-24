import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, DollarSign, Tag, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  amount: string;
  donation_method: string;
  allocation: string;
  privacy_agreed: boolean;
}

const initialState: FormState = {
  full_name: '',
  email: '',
  phone: '',
  amount: '',
  donation_method: '',
  allocation: '',
  privacy_agreed: false,
};

export function DonationContactForm() {
  const { t } = useLanguage();

  const DONATION_METHODS = [
    t('donationForm.methodBankTransfer'),
    t('donationForm.methodCash'),
    t('donationForm.methodRecurring'),
    t('donationForm.methodFieldRep'),
  ];

  const ALLOCATION_OPTIONS = [
    t('donationForm.allocFamily'),
    t('donationForm.allocMedical'),
    t('donationForm.allocEducation'),
    t('donationForm.allocOrg'),
    t('donationForm.allocOther'),
  ];

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.privacy_agreed) {
      setError(t('donationForm.privacyError'));
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase.from('donation_requests').insert([{
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        amount: form.amount,
        donation_method: form.donation_method,
        allocation: form.allocation,
        privacy_agreed: form.privacy_agreed,
      }]);

      if (dbError) throw dbError;

      setSubmitted(true);
      setForm(initialState);
    } catch {
      setError(t('donationForm.submitError'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-10 text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-brand-100 dark:bg-brand-900/40 rounded-full w-20 h-20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-brand-600 dark:text-brand-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('donationForm.successTitle')}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-6">
          {t('donationForm.successDesc')}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Heart className="w-4 h-4" />
          {t('donationForm.submitAnother')}
        </button>
      </div>
    );
  }

  const inputClass = "w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors";
  const labelClass = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 bg-brand-700 px-6 py-5">
        <div className="bg-white/20 rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">{t('donationForm.headerTitle')}</h3>
          <p className="text-white/75 text-sm mt-0.5">{t('donationForm.headerDesc')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>
              <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('donationForm.fullName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder={t('donationForm.fullNamePlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('donationForm.email')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              dir="ltr"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('donationForm.phone')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder={t('donationForm.phonePlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <DollarSign className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('donationForm.amount')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              placeholder={t('donationForm.amountPlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Heart className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('donationForm.donationMethod')} <span className="text-red-500">*</span>
            </label>
            <select
              name="donation_method"
              value={form.donation_method}
              onChange={handleChange}
              required
              className={inputClass + ' appearance-none cursor-pointer'}
            >
              <option value="">{t('donationForm.donationMethodPlaceholder')}</option>
              {DONATION_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Tag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('donationForm.allocation')}
              <span className="text-gray-400 dark:text-gray-500 font-normal text-xs">{t('donationForm.allocationOptional')}</span>
            </label>
            <select
              name="allocation"
              value={form.allocation}
              onChange={handleChange}
              className={inputClass + ' appearance-none cursor-pointer'}
            >
              <option value="">{t('donationForm.allocationPlaceholder')}</option>
              {ALLOCATION_OPTIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                name="privacy_agreed"
                checked={form.privacy_agreed}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-500 rounded peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-colors flex items-center justify-center">
                {form.privacy_agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('donationForm.privacyConsent')}{' '}
              <span className="text-brand-600 dark:text-brand-400 font-semibold">{t('donationForm.privacyPolicy')}</span>
              {' '}{t('donationForm.privacyConsentMid')}{' '}
              <span className="text-brand-600 dark:text-brand-400 font-semibold">{t('donationForm.termsLink')}</span>
              {' '}{t('donationForm.termsConsentSuffix')}
              <span className="text-red-500"> *</span>
            </span>
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-5 py-4">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('donationForm.submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('donationForm.submit')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
