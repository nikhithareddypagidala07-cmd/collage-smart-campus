import React from 'react';
import { AlertCircle, Flame, ArrowUp, ArrowDown } from 'lucide-react';

export const PriorityBadge = ({ priority, size = 'md' }) => {
  const norm = priority ? priority.toLowerCase() : 'medium';

  let config = {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: ArrowDown,
    label: priority || 'Medium'
  };

  switch (norm) {
    case 'urgent':
      config = {
        bg: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
        icon: Flame,
        label: 'Urgent'
      };
      break;
    case 'high':
      config = {
        bg: 'bg-orange-100 text-orange-800 border-orange-200 font-medium',
        icon: AlertCircle,
        label: 'High'
      };
      break;
    case 'medium':
      config = {
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: ArrowUp,
        label: 'Medium'
      };
      break;
    case 'low':
      config = {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: ArrowDown,
        label: 'Low'
      };
      break;
    default:
      break;
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border ${config.bg} ${sizeClasses}`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};
