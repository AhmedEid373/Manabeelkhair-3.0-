import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
  pending: {
    label: 'قيد الانتظار',
    icon: <Clock className="w-4 h-4" />,
    classes: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  },
  in_progress: {
    label: 'جارٍ المعالجة',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    classes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  },
  completed: {
    label: 'مكتمل',
    icon: <CheckCircle className="w-4 h-4" />,
    classes: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  },
  cancelled: {
    label: 'ملغي',
    icon: <XCircle className="w-4 h-4" />,
    classes: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP['pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.classes}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'in_progress', label: 'جارٍ المعالجة' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغي' },
];
