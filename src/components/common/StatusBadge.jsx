import React from 'react';
import {
  Clock,
  Search,
  Cog,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  RotateCcw
} from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = status ? status.toLowerCase() : 'submitted';

  let config = {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: Clock,
    label: status || 'Submitted'
  };

  switch (normalized) {
    case 'submitted':
      config = {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        dot: 'bg-blue-500',
        icon: Clock,
        label: 'Submitted'
      };
      break;
    case 'under review':
      config = {
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
        dot: 'bg-purple-500',
        icon: Search,
        label: 'Under Review'
      };
      break;
    case 'in progress':
      config = {
        bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
        dot: 'bg-orange-500',
        icon: Cog,
        label: 'In Progress'
      };
      break;
    case 'resolved':
      config = {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        icon: CheckCircle2,
        label: 'Resolved'
      };
      break;
    case 'rejected':
      config = {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
        icon: XCircle,
        label: 'Rejected'
      };
      break;
    case 'escalated':
      config = {
        bg: 'bg-red-900/10 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800 font-semibold',
        dot: 'bg-red-800 animate-ping',
        icon: AlertOctagon,
        label: 'Escalated'
      };
      break;
    case 'reopened':
      config = {
        bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
        icon: RotateCcw,
        label: 'Reopened'
      };
      break;
    default:
      break;
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${sizeClasses} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
