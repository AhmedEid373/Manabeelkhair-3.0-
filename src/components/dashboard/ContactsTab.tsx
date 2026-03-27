import { useState } from 'react';
import { db, Contact } from '../../lib/api';
import { StatusBadge, STATUS_OPTIONS } from './StatusBadge';
import { Search, Download, Trash2, CreditCard as Edit2, X, Save, User, Mail, Phone, MessageSquare, Calendar, StickyNote } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  donation: 'تبرع',
  volunteer: 'تطوع',
  inquiry: 'استفسار',
  partnership: 'شراكة',
  helper: 'مساعد',
  needer: 'محتاج',
};

interface Props {
  contacts: Contact[];
  onRefresh: () => void;
}

export function ContactsTab({ contacts, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: string; notes: string }>({ status: '', notes: '' });

  const filtered = contacts.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const startEdit = (c: Contact) => {
    setEditingId(c.id);
    setEditForm({ status: c.status, notes: c.notes || '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await db
      .from('contacts')
      .update({ status: editForm.status, notes: editForm.notes, updated_at: new Date().toISOString() })
      .eq('id', editingId);
    setEditingId(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    await db.from('contacts').delete().eq('id', id);
    onRefresh();
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'النوع', 'الرسالة', 'الحالة', 'ملاحظات', 'التاريخ'];
    const rows = filtered.map((c) => [
      c.name, c.email, c.phone, TYPE_LABELS[c.type] ?? c.type,
      c.message || '', c.status, c.notes || '',
      new Date(c.created_at).toLocaleDateString('ar-EG'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`; a.click();
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
        <div className="flex gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="all">كل الأنواع</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
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
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد رسائل مطابقة للبحث</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
            >
              {editingId === contact.id ? (
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
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        placeholder="أضف ملاحظة..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <X className="w-4 h-4" /> إلغاء
                    </button>
                    <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
                      <Save className="w-4 h-4" /> حفظ
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full">
                        {TYPE_LABELS[contact.type] ?? contact.type}
                      </span>
                      <StatusBadge status={contact.status} />
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => startEdit(contact)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="تعديل">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-semibold truncate">{contact.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${contact.email}`} className="hover:text-brand-600 dark:hover:text-brand-400 truncate" dir="ltr">{contact.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${contact.phone}`} className="hover:text-brand-600 dark:hover:text-brand-400" dir="ltr">{contact.phone}</a>
                    </div>
                  </div>

                  {contact.message && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-3">
                      <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                      <p className="leading-relaxed">{contact.message}</p>
                    </div>
                  )}

                  {contact.notes && (
                    <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-3">
                      <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>{contact.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(contact.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
