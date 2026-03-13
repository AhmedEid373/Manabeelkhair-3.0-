import { LogIn } from 'lucide-react';

interface Props {
  loginForm: { email: string; password: string };
  setLoginForm: (form: { email: string; password: string }) => void;
  loginError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function DashboardLogin({ loginForm, setLoginForm, loginError, onSubmit }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-100 dark:bg-brand-900/40 rounded-2xl w-16 h-16 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center">
          لوحة التحكم
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
          أدخل بيانات حسابك للمتابعة
        </p>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="admin@manabeaalkhair.org"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
