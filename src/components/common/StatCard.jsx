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
      bg: 'bg-charcoal-800 text-electric-400 border border-charcoal-700',
      border: 'hover:border-electric-500/60',
      activeRing: 'ring-2 ring-electric-500 border-electric-500'
    },
    purple: {
      bg: 'bg-charcoal-800 text-purple-400 border border-charcoal-700',
      border: 'hover:border-purple-500/60',
      activeRing: 'ring-2 ring-purple-500 border-purple-500'
    },
    orange: {
      bg: 'bg-charcoal-800 text-amber-400 border border-charcoal-700',
      border: 'hover:border-amber-500/60',
      activeRing: 'ring-2 ring-amber-500 border-amber-500'
    },
    emerald: {
      bg: 'bg-charcoal-800 text-emerald-400 border border-charcoal-700',
      border: 'hover:border-emerald-500/60',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    rose: {
      bg: 'bg-charcoal-800 text-rose-400 border border-charcoal-700',
      border: 'hover:border-rose-500/60',
      activeRing: 'ring-2 ring-rose-500 border-rose-500'
    },
    amber: {
      bg: 'bg-charcoal-800 text-sand-300 border border-charcoal-700',
      border: 'hover:border-sand-400/60',
      activeRing: 'ring-2 ring-sand-400 border-sand-400'
    },
    navy: {
      bg: 'bg-charcoal-800 text-sand-100 border border-charcoal-700',
      border: 'hover:border-sand-400/60',
      activeRing: 'ring-2 ring-sand-400 border-sand-400'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-charcoal-900 rounded-xl border border-charcoal-800 p-5 shadow-md text-sand-100 transition-all duration-200 ${
        scheme.border
      } ${active ? scheme.activeRing : ''} ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sand-400/80">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${scheme.bg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 pt-3 border-t border-charcoal-800 flex items-center justify-between text-xs text-sand-400/80">
          <span>{subtext}</span>
          {trend && (
            <span className="font-bold text-emerald-400">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
