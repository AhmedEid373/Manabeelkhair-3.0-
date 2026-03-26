import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Contact, DonationRequest, VolunteerRequest } from '../lib/supabase';
import { DashboardLogin } from '../components/dashboard/DashboardLogin';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ContactsTab } from '../components/dashboard/ContactsTab';
import { DonationsTab } from '../components/dashboard/DonationsTab';
import { VolunteersTab } from '../components/dashboard/VolunteersTab';
import { SiteContentTab } from '../components/dashboard/SiteContentTab';
import { SettingsTab } from '../components/dashboard/SettingsTab';
import { MessageSquare, Heart, Users, Layout, Settings } from 'lucide-react';

type Tab = 'contacts' | 'donations' | 'volunteers' | 'site_content' | 'settings';

export function Dashboard() {
  const { user, signIn } = useAuth();
  const [adminEmail, setAdminEmail] = useState(user?.email || '');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [donations, setDonations] = useState<DonationRequest[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('contacts');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [contactsRes, donationsRes, volunteersRes] = await Promise.all([
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('donation_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('volunteer_requests').select('*').order('created_at', { ascending: false }),
      ]);
      setContacts((contactsRes.data || []) as Contact[]);
      setDonations((donationsRes.data || []) as DonationRequest[]);
      setVolunteers((volunteersRes.data || []) as VolunteerRequest[]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await signIn(loginForm.email, loginForm.password);
    if (error) setLoginError('بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.');
  };

  if (!user) {
    return (
      <DashboardLogin
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        loginError={loginError}
        onSubmit={handleLogin}
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'contacts', label: 'اتصل بنا', icon: <MessageSquare className="w-5 h-5" />, count: contacts.length },
    { id: 'donations', label: 'طلبات التبرع', icon: <Heart className="w-5 h-5" />, count: donations.length },
    { id: 'volunteers', label: 'طلبات التطوع', icon: <Users className="w-5 h-5" />, count: volunteers.length },
    { id: 'site_content', label: 'محتوى الموقع', icon: <Layout className="w-5 h-5" />, count: 0 },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" />, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">لوحة التحكم</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">إدارة الطلبات الواردة من الموقع</p>
        </div>

        <DashboardStats contacts={contacts} donations={donations} volunteers={volunteers} />

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors relative flex-1 justify-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400" />
                )}
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id !== 'site_content' && tab.id !== 'settings' && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === 'contacts' && <ContactsTab contacts={contacts} onRefresh={fetchAll} />}
                {activeTab === 'donations' && <DonationsTab donations={donations} onRefresh={fetchAll} />}
                {activeTab === 'volunteers' && <VolunteersTab volunteers={volunteers} onRefresh={fetchAll} />}
                {activeTab === 'site_content' && <SiteContentTab onRefresh={fetchAll} />}
                {activeTab === 'settings' && <SettingsTab currentEmail={adminEmail} onEmailChange={setAdminEmail} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
