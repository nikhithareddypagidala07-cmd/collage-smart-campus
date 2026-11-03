import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  subtext,
  onClick,
  active = false
}) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-300',
      activeRing: 'ring-2 ring-blue-500 border-blue-500'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-300',
      activeRing: 'ring-2 ring-purple-500 border-purple-500'
    },
    orange: {
      bg: 'bg-orange-50 text-orange-600',
      border: 'hover:border-orange-300',
      activeRing: 'ring-2 ring-orange-500 border-orange-500'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-300',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'hover:border-rose-300',
      activeRing: 'ring-2 ring-rose-500 border-rose-500'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-300',
      activeRing: 'ring-2 ring-amber-500 border-amber-500'
    },
    navy: {
      bg: 'bg-slate-800 text-white',
      border: 'hover:border-slate-600',
      activeRing: 'ring-2 ring-slate-800 border-slate-800'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all duration-200 ${
        scheme.border
      } ${active ? scheme.activeRing : ''} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtext}</span>
          {trend && (
            <span className="font-medium text-emerald-600">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
