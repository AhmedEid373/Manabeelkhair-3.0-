import { useState } from 'react';
import { db, VolunteerRequest } from '../../lib/api';
import { StatusBadge, STATUS_OPTIONS } from './StatusBadge';
import { Search, Download, Trash2, CreditCard as Edit2, X, Save, User, Mail, Phone, Calendar, Users, MapPin, Clock, Briefcase, StickyNote } from 'lucide-react';

const VOLUNTEER_TYPE_COLORS: Record<string, string> = {
  'ميداني': 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300',
  'إداري': 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  'إعلامي': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'تدريبي': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

interface Props {
  volunteers: VolunteerRequest[];
  onRefresh: () => void;
}

export function VolunteersTab({ volunteers, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: string; admin_notes: string }>({ status: '', admin_notes: '' });

  const filtered = volunteers.filter((v) => {
    const matchSearch =
      !search ||
      v.full_name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      v.region.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || v.volunteer_type === typeFilter;
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const startEdit = (v: VolunteerRequest) => {
    setEditingId(v.id);
    setEditForm({ status: v.status, admin_notes: v.admin_notes || '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await db
      .from('volunteer_requests')
      .update({ status: editForm.status, admin_notes: editForm.admin_notes })
      .eq('id', editingId);
    setEditingId(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    await db.from('volunteer_requests').delete().eq('id', id);
    onRefresh();
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'العمر', 'البريد', 'الهاتف', 'المنطقة', 'نوع التطوع', 'التوفر', 'المهارات', 'الحالة', 'ملاحظات', 'التاريخ'];
    const rows = filtered.map((v) => [
      v.full_name, v.age, v.email, v.phone, v.region,
      v.volunteer_type, v.availability, v.skills,
      v.status, v.admin_notes || '',
      new Date(v.created_at).toLocaleDateString('ar-EG'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `volunteers_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const volunteerTypes = ['ميداني', 'إداري', 'إعلامي', 'تدريبي'];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد أو المنطقة..."
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
            {volunteerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
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
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد طلبات تطوع مطابقة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((volunteer) => (
            <div
              key={volunteer.id}
              className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
            >
              {editingId === volunteer.id ? (
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
                    <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-colors">
                      <Save className="w-4 h-4" /> حفظ
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${VOLUNTEER_TYPE_COLORS[volunteer.volunteer_type] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                        {volunteer.volunteer_type || 'غير محدد'}
                      </span>
                      <StatusBadge status={volunteer.status} />
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => startEdit(volunteer)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="تعديل">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(volunteer.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-semibold truncate">{volunteer.full_name}</span>
                      {volunteer.age && <span className="text-xs text-gray-400">({volunteer.age})</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${volunteer.email}`} className="hover:text-brand-600 dark:hover:text-brand-400 truncate" dir="ltr">{volunteer.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${volunteer.phone}`} className="hover:text-brand-600 dark:hover:text-brand-400" dir="ltr">{volunteer.phone}</a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    {volunteer.region && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {volunteer.region}
                      </div>
                    )}
                    {volunteer.availability && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {volunteer.availability}
                      </div>
                    )}
                  </div>

                  {volunteer.skills && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-3">
                      <Briefcase className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                      <p className="leading-relaxed">{volunteer.skills}</p>
                    </div>
                  )}

                  {volunteer.notes && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-3">
                      <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                      <p className="leading-relaxed">{volunteer.notes}</p>
                    </div>
                  )}

                  {volunteer.admin_notes && (
                    <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-3">
                      <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>{volunteer.admin_notes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(volunteer.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
