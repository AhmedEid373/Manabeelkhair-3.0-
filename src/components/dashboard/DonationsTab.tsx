import { useState } from 'react';
import { db, DonationRequest } from '../../lib/api';
import { StatusBadge, STATUS_OPTIONS } from './StatusBadge';
import { Search, Download, Trash2, CreditCard as Edit2, X, Save, User, Mail, Phone, Calendar, Heart, Tag, CreditCard, StickyNote } from 'lucide-react';

interface Props {
  donations: DonationRequest[];
  onRefresh: () => void;
}

export function DonationsTab({ donations, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: string; admin_notes: string }>({ status: '', admin_notes: '' });

  const filtered = donations.filter((d) => {
    const matchSearch =
      !search ||
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const startEdit = (d: DonationRequest) => {
    setEditingId(d.id);
    setEditForm({ status: d.status, admin_notes: d.admin_notes || '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await db
      .from('donation_requests')
      .update({ status: editForm.status, admin_notes: editForm.admin_notes })
      .eq('id', editingId);
    setEditingId(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    await db.from('donation_requests').delete().eq('id', id);
    onRefresh();
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'البريد', 'الهاتف', 'المبلغ', 'طريقة التبرع', 'التخصيص', 'الحالة', 'ملاحظات', 'التاريخ'];
    const rows = filtered.map((d) => [
      d.full_name, d.email, d.phone, d.amount, d.donation_method,
      d.allocation || '', d.status, d.admin_notes || '',
      new Date(d.created_at).toLocaleDateString('ar-EG'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد أو الهاتف..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="all">كل الحالات</option>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد طلبات تبرع مطابقة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((donation) => (
            <div
              key={donation.id}
              className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              {editingId === donation.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">الحالة</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">ملاحظات الإدارة</label>
                      <input
                        value={editForm.admin_notes}
                        onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                        placeholder="أضف ملاحظة..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <X className="w-4 h-4" /> إلغاء
                    </button>
                    <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
                      <Save className="w-4 h-4" /> حفظ
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {donation.amount}
                      </span>
                      <StatusBadge status={donation.status} />
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => startEdit(donation)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="تعديل">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(donation.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-semibold truncate">{donation.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${donation.email}`} className="hover:text-brand-600 dark:hover:text-brand-400 truncate" dir="ltr">{donation.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${donation.phone}`} className="hover:text-brand-600 dark:hover:text-brand-400" dir="ltr">{donation.phone}</a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                      {donation.donation_method}
                    </div>
                    {donation.allocation && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        {donation.allocation}
                      </div>
                    )}
                  </div>

                  {donation.admin_notes && (
                    <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-3">
                      <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>{donation.admin_notes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(donation.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
