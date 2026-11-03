import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const DemoWorkflowGuide = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const { currentUser, quickLogin } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRoleJump = (role, path) => {
    quickLogin(role);
    navigate(path);
  };

  return (
    <aside 
      aria-label="Evaluation Workflow Helper"
      className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-blue-700/50 mb-6 transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Interactive 5-Step Evaluation Workflow</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-normal border border-emerald-500/30 hidden sm:inline">
                Live Prototype
              </span>
            </h3>
            <p className="text-[11px] text-blue-200">
              Demonstrating: Student Lodge → Staff Review & Remarks → Student Notification & Track → Admin Statistics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800/40 transition text-xs"
            title={minimized ? 'Expand guide' : 'Minimize guide'}
          >
            {minimized ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800/40 transition"
            title="Dismiss workflow banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="mt-4 pt-3 border-t border-blue-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Step 1: Student */}
          <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-800/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 1 & 4: Student</span>
                <span className="font-mono text-[10px] text-slate-400">student01</span>
              </div>
              <p className="text-slate-200 font-medium">Lodge complaint with image & receive Tracking ID.</p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => handleRoleJump('student', '/student/submit')}
                className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Submit as Student</span>
              </button>
            </div>
          </div>

          {/* Step 2: Staff */}
          <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Step 2 & 3: Staff</span>
                <span className="font-mono text-[10px] text-slate-400">staff01</span>
              </div>
              <p className="text-slate-200 font-medium">Assign technician, add remarks & mark Resolved.</p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => handleRoleJump('staff', '/staff/assigned')}
                className="w-full py-1.5 px-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Open Staff Queue</span>
              </button>
            </div>
          </div>

          {/* Step 3: Admin */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Step 5: Admin</span>
                <span className="font-mono text-[10px] text-slate-400">admin</span>
              </div>
              <p className="text-slate-200 font-medium">Audit Recharts statistics, SLAs & escalations.</p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => handleRoleJump('admin', '/admin/analytics')}
                className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>View Admin Charts</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
