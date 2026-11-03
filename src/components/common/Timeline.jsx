import React from 'react';
import { formatDate } from '../../utils/helpers';
import { StatusBadge } from './StatusBadge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const Timeline = ({ history = [], currentStatus = 'Submitted' }) => {
  const steps = [
    { label: 'Submitted', key: 'Submitted' },
    { label: 'Under Review', key: 'Under Review' },
    { label: 'In Progress', key: 'In Progress' },
    { label: 'Resolved', key: 'Resolved' }
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'Submitted': return 0;
      case 'Under Review': return 1;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      case 'Reopened': return 2; // back in action
      case 'Escalated': return 2; // urgent in progress
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'Rejected';
  const isEscalated = currentStatus === 'Escalated';
  const isReopened = currentStatus === 'Reopened';

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Lifecycle Progression
        </h4>

        {isRejected ? (
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <span className="font-semibold">Complaint Rejected:</span> This complaint was reviewed and closed as rejected. See remarks below.
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="hidden sm:flex justify-between items-center relative z-10">
              {steps.map((step, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-105'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center font-medium ${
                        isCurrent
                          ? 'text-blue-700 font-bold'
                          : isPassed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Connecting line */}
            <div className="hidden sm:block absolute top-4 left-10 right-10 h-0.5 bg-slate-200 z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentIndex / (steps.length - 1)) * 100))}%`
                }}
              />
            </div>

            {/* Special status callouts */}
            {(isEscalated || isReopened) && (
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Lifecycle State:</span>
                <StatusBadge status={currentStatus} size="sm" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Activity Trail */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Audit Trail & Resolution History
        </h4>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {history.map((item, index) => (
            <div key={index} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-slate-100 shadow-sm" />

              <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs transition hover:border-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-xs font-medium text-slate-800">
                      {item.performer}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {item.remarks || 'No detailed remarks recorded.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
