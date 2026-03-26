import { useState } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';

interface Props {
  currentEmail: string;
  onEmailChange: (email: string) => void;
}

type Status = 'idle' | 'success' | 'error';

async function updateProfile(body: object): Promise<{ ok: boolean; email?: string; error?: string }> {
  const res = await fetch('/api/auth/profile', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function SettingsTab({ currentEmail, onEmailChange }: Props) {
  const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '' });
  const [emailStatus, setEmailStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState('');

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passStatus, setPassStatus] = useState<Status>('idle');
  const [passError, setPassError] = useState('');

  const handleEmailSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailStatus('idle');
    const result = await updateProfile({ newEmail: emailForm.newEmail, currentPassword: emailForm.currentPassword });
    if (result.ok && result.email) {
      onEmailChange(result.email);
      setEmailForm({ newEmail: '', currentPassword: '' });
      setEmailStatus('success');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } else {
      setEmailError(result.error || 'حدث خطأ.');
      setEmailStatus('error');
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassStatus('idle');
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('كلمتا المرور غير متطابقتين.');
      setPassStatus('error');
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      setPassStatus('error');
      return;
    }
    const result = await updateProfile({ newPassword: passForm.newPassword, currentPassword: passForm.currentPassword });
    if (result.ok) {
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPassStatus('success');
      setTimeout(() => setPassStatus('idle'), 3000);
    } else {
      setPassError(result.error || 'حدث خطأ.');
      setPassStatus('error');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  return (
    <div className="max-w-xl space-y-8" dir="rtl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">إعدادات الحساب</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">البريد الحالي: <span className="font-medium text-gray-700 dark:text-gray-300">{currentEmail}</span></p>
      </div>

      {/* Change Email */}
      <form onSubmit={handleEmailSave} className="bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-gray-800 dark:text-white">تغيير البريد الإلكتروني</h3>
        {emailStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm">
            <Check className="w-4 h-4" /> تم تحديث البريد الإلكتروني بنجاح
          </div>
        )}
        {emailStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" /> {emailError}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">البريد الإلكتروني الجديد</label>
          <input type="email" required value={emailForm.newEmail} onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })} className={inputClass} dir="ltr" placeholder="new@example.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">كلمة المرور الحالية</label>
          <input type="password" required value={emailForm.currentPassword} onChange={e => setEmailForm({ ...emailForm, currentPassword: e.target.value })} className={inputClass} dir="ltr" placeholder="••••••••" />
        </div>
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
          <Save className="w-4 h-4" /> حفظ البريد
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSave} className="bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-gray-800 dark:text-white">تغيير كلمة المرور</h3>
        {passStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm">
            <Check className="w-4 h-4" /> تم تحديث كلمة المرور بنجاح
          </div>
        )}
        {passStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" /> {passError}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">كلمة المرور الحالية</label>
          <input type="password" required value={passForm.currentPassword} onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} className={inputClass} dir="ltr" placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">كلمة المرور الجديدة</label>
          <input type="password" required value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} className={inputClass} dir="ltr" placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">تأكيد كلمة المرور</label>
          <input type="password" required value={passForm.confirmPassword} onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} className={inputClass} dir="ltr" placeholder="••••••••" />
        </div>
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
          <Save className="w-4 h-4" /> حفظ كلمة المرور
        </button>
      </form>
    </div>
  );
}
