import { useState } from 'react';
import {
  Send, CheckCircle, AlertCircle, User, Mail, Phone,
  MapPin, Briefcase, Clock, Heart, MessageSquare, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

interface FormState {
  full_name: string;
  age: string;
  email: string;
  phone: string;
  region: string;
  skills: string;
  availability: string;
  volunteer_type: string;
  notes: string;
  terms_agreed: boolean;
}

const initialState: FormState = {
  full_name: '',
  age: '',
  email: '',
  phone: '',
  region: '',
  skills: '',
  availability: '',
  volunteer_type: '',
  notes: '',
  terms_agreed: false,
};

export function VolunteerForm() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const VOLUNTEER_TYPES = [
    { value: t('volunteerForm.typeField'), label: t('volunteerForm.typeField') },
    { value: t('volunteerForm.typeAdmin'), label: t('volunteerForm.typeAdmin') },
    { value: t('volunteerForm.typeMedia'), label: t('volunteerForm.typeMedia') },
    { value: t('volunteerForm.typeTraining'), label: t('volunteerForm.typeTraining') },
  ];

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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

    if (!form.terms_agreed) {
      setError(t('volunteerForm.termsError'));
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase.from('volunteer_requests').insert([{
        full_name: form.full_name,
        age: form.age,
        email: form.email,
        phone: form.phone,
        region: form.region,
        skills: form.skills,
        availability: form.availability,
        volunteer_type: form.volunteer_type,
        notes: form.notes,
        terms_agreed: form.terms_agreed,
      }]);

      if (dbError) throw dbError;

      setSubmitted(true);
      setForm(initialState);
    } catch {
      setError(t('volunteerForm.submitError'));
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
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('volunteerForm.successTitle')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-6">
          {t('volunteerForm.successDesc')}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Users className="w-4 h-4" />
          {t('volunteerForm.submitAnother')}
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors';

  const labelClass =
    'flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 bg-brand-700 px-6 py-5">
        <div className="bg-white/20 rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">{t('volunteerForm.headerTitle')}</h3>
          <p className="text-white/75 text-sm mt-0.5">{t('volunteerForm.headerDesc')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>
              <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('volunteerForm.fullName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder={t('volunteerForm.fullNamePlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('volunteerForm.age')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              placeholder={t('volunteerForm.agePlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('volunteerForm.email')} <span className="text-red-500">*</span>
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
              {t('volunteerForm.phone')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder={t('volunteerForm.phonePlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('volunteerForm.region')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              required
              placeholder={t('volunteerForm.regionPlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('volunteerForm.availability')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              required
              placeholder={t('volunteerForm.availabilityPlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>
              <Heart className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('volunteerForm.volunteerType')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VOLUNTEER_TYPES.map(type => (
                <label
                  key={type.value}
                  className={`flex items-center justify-center gap-2 border-2 rounded-xl px-4 py-3 cursor-pointer transition-all font-medium text-sm ${
                    form.volunteer_type === type.value
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-400 dark:hover:border-brand-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="volunteer_type"
                    value={type.value}
                    checked={form.volunteer_type === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>
            <Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            {t('volunteerForm.skills')}
            <span className="text-gray-400 dark:text-gray-500 font-normal text-xs">{t('volunteerForm.skillsOptional')}</span>
          </label>
          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            rows={3}
            placeholder={t('volunteerForm.skillsPlaceholder')}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>
            <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            {t('volunteerForm.notes')}
            <span className="text-gray-400 dark:text-gray-500 font-normal text-xs">{t('volunteerForm.notesOptional')}</span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder={t('volunteerForm.notesPlaceholder')}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                name="terms_agreed"
                checked={form.terms_agreed}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-500 rounded peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-colors flex items-center justify-center">
                {form.terms_agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('volunteerForm.termsConsent')}{' '}
              <span className="text-brand-600 dark:text-brand-400 font-semibold">{t('volunteerForm.termsLink')}</span>
              {' '}{t('volunteerForm.termsConsentSuffix')}
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
                {t('volunteerForm.submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('volunteerForm.submit')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
