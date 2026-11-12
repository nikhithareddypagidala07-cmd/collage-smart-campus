import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Shield,
  KeyRound,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'student';
  const [activeRole, setActiveRole] = useState(initialTab);

  const [username, setUsername] = useState('student01');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  // Set default credentials whenever active role changes
  useEffect(() => {
    setError('');
    if (activeRole === 'student') {
      setUsername('student01');
      setPassword('student123');
    } else if (activeRole === 'staff') {
      setUsername('staff01');
      setPassword('staff123');
    } else if (activeRole === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    }
  }, [activeRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);
      if (result.success) {
        if (result.user.role === 'student') navigate('/student');
        else if (result.user.role === 'staff') navigate('/staff');
        else if (result.user.role === 'admin') navigate('/admin');
      } else {
        setError(result.message);
      }
    }, 300);
  };

  const handleInstantLogin = (role) => {
    quickLogin(role);
    if (role === 'student') navigate('/student');
    else if (role === 'staff') navigate('/staff');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-charcoal-900 text-sand-100 border border-sand-400/50 flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8 text-electric-400" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-charcoal-950 tracking-tight">
            Sanjay Ghodawat University
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-charcoal-700">
            Digital Grievance Redressal & Attendance Management System
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="bg-sand-200/70 border border-sand-300/80 p-1 rounded-xl flex items-center">
          <button
            type="button"
            onClick={() => setActiveRole('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeRole === 'student'
                ? 'bg-charcoal-900 text-sand-100 font-bold border border-sand-400/40 shadow-xs'
                : 'text-charcoal-700 hover:text-charcoal-950'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${activeRole === 'student' ? 'text-electric-400' : 'text-charcoal-500'}`} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('staff')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeRole === 'staff'
                ? 'bg-charcoal-900 text-sand-100 font-bold border border-sand-400/40 shadow-xs'
                : 'text-charcoal-700 hover:text-charcoal-950'
            }`}
          >
            <Briefcase className={`w-3.5 h-3.5 ${activeRole === 'staff' ? 'text-sand-300' : 'text-charcoal-500'}`} />
            <span>Staff</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('admin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeRole === 'admin'
                ? 'bg-charcoal-900 text-sand-100 font-bold border border-sand-400/40 shadow-xs'
                : 'text-charcoal-700 hover:text-charcoal-950'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${activeRole === 'admin' ? 'text-electric-400' : 'text-charcoal-500'}`} />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-sand-300 shadow-md p-6 sm:p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                {activeRole === 'student' ? 'Student ID or Username' : 'Username or Employee ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-sand-50/50 border border-sand-300 rounded-xl text-xs sm:text-sm text-charcoal-950 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:bg-white transition"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-sand-50/50 border border-sand-300 rounded-xl text-xs sm:text-sm text-charcoal-950 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:bg-white transition"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 font-bold text-xs sm:text-sm rounded-xl border border-sand-400/50 hover:border-electric-400 shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : `Sign in as ${activeRole}`}</span>
              <ArrowRight className="w-4 h-4 text-electric-400" />
            </button>
          </form>

          {/* Quick Institutional Account Selector for Demonstration / Testing */}
          <div className="pt-4 border-t border-sand-200">
            <details className="group">
              <summary className="flex items-center justify-between text-xs font-semibold text-charcoal-600 cursor-pointer hover:text-charcoal-950 transition list-none">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-electric-600" />
                  <span>Demonstration & Evaluation Accounts</span>
                </span>
                <span className="text-[10px] text-charcoal-900 bg-sand-200 border border-sand-300 px-2 py-0.5 rounded-full font-bold">
                  Click to fill
                </span>
              </summary>

              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantLogin('student')}
                    className="p-2.5 bg-sand-100 hover:bg-sand-200 border border-sand-300 rounded-xl text-center text-[11px] font-bold text-charcoal-900 transition"
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 text-electric-600" />
                    <span>Student Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantLogin('staff')}
                    className="p-2.5 bg-sand-100 hover:bg-sand-200 border border-sand-300 rounded-xl text-center text-[11px] font-bold text-charcoal-900 transition"
                  >
                    <Briefcase className="w-4 h-4 mx-auto mb-1 text-charcoal-700" />
                    <span>Staff Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantLogin('admin')}
                    className="p-2.5 bg-sand-100 hover:bg-sand-200 border border-sand-300 rounded-xl text-center text-[11px] font-bold text-charcoal-900 transition"
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1 text-electric-600" />
                    <span>Admin Login</span>
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Student: student01</span>
                    <span className="text-slate-400">Pass: student123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff: staff01</span>
                    <span className="text-slate-400">Pass: staff123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin: admin</span>
                    <span className="text-slate-400">Pass: admin123</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Return to Campus Home
          </Link>
        </div>
      </div>
    </div>
  );
};
