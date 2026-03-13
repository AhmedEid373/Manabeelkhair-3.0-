import { Contact, DonationRequest, VolunteerRequest } from '../../lib/supabase';
import { MessageSquare, Heart, Users, Clock } from 'lucide-react';

interface Props {
  contacts: Contact[];
  donations: DonationRequest[];
  volunteers: VolunteerRequest[];
}

export function DashboardStats({ contacts, donations, volunteers }: Props) {
  const totalPending =
    contacts.filter((c) => c.status === 'pending').length +
    donations.filter((d) => d.status === 'pending').length +
    volunteers.filter((v) => v.status === 'pending').length;

  const stats = [
    {
      label: 'رسائل التواصل',
      value: contacts.length,
      icon: <MessageSquare className="w-6 h-6" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'طلبات التبرع',
      value: donations.length,
      icon: <Heart className="w-6 h-6" />,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconBg: 'bg-emerald-600',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'طلبات التطوع',
      value: volunteers.length,
      icon: <Users className="w-6 h-6" />,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-amber-600',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'بانتظار المراجعة',
      value: totalPending,
      icon: <Clock className="w-6 h-6" />,
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-600',
      text: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4`}
        >
          <div className={`${stat.iconBg} rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 text-white`}>
            {stat.icon}
          </div>
          <div>
            <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
