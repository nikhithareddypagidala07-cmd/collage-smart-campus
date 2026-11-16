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
  Info,
  UserPlus,
  LogIn,
  BookOpen,
  Hash
} from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'student';
  const [activeRole, setActiveRole] = useState(initialTab);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [username, setUsername] = useState('student01@smartcampus.edu');
  const [password, setPassword] = useState('student123');

  // Student registration form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    course: 'B.Tech Computer Science',
    semester: '1st Semester'
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, registerStudent, quickLogin, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  // Set default credentials whenever active role changes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    if (activeRole === 'student') {
      setUsername('student01@smartcampus.edu');
      setPassword('student123');
    } else if (activeRole === 'staff') {
      setAuthMode('login'); // Only students can self-register
      setUsername('staff01@smartcampus.edu');
      setPassword('staff123');
    } else if (activeRole === 'admin') {
      setAuthMode('login'); // Only students can self-register
      setUsername('admin@smartcampus.edu');
      setPassword('admin123');
    }
  }, [activeRole]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      setIsLoading(false);
      if (result.success) {
        if (result.user.role === 'student') navigate('/student');
        else if (result.user.role === 'staff') navigate('/staff');
        else if (result.user.role === 'admin') navigate('/admin');
      } else {
        setError(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An unexpected error occurred during login.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await registerStudent(regData);
      setIsLoading(false);
      if (result.success) {
        setSuccessMsg('Account created successfully in Firebase! Redirecting to Student Portal...');
        setTimeout(() => {
          navigate('/student');
        }, 1000);
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An unexpected error occurred during registration.');
    }
  };

  const handleInstantDemoLogin = (role) => {
    quickLogin(role);
    if (role === 'student') navigate('/student');
    else if (role === 'staff') navigate('/staff');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-charcoal-900 text-sand-100 border border-sand-400/50 flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8 text-electric-400" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-sand-100 tracking-tight">
            Sanjay Ghodawat University
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-sand-300">
            Digital Grievance Redressal & Attendance Management System
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="bg-charcoal-900 border border-charcoal-800 p-1 rounded-xl flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => { setActiveRole('student'); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeRole === 'student'
                ? 'bg-charcoal-800 text-sand-100 font-bold border border-sand-400/40 shadow-xs'
                : 'text-sand-300 hover:text-sand-100'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${activeRole === 'student' ? 'text-electric-400' : 'text-sand-400'}`} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveRole('staff'); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeRole === 'staff'
                ? 'bg-charcoal-800 text-sand-100 font-bold border border-sand-400/40 shadow-xs'
                : 'text-sand-300 hover:text-sand-100'
            }`}
          >
            <Briefcase className={`w-3.5 h-3.5 ${activeRole === 'staff' ? 'text-sand-200' : 'text-sand-400'}`} />
            <span>Staff</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveRole('admin'); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeRole === 'admin'
                ? 'bg-charcoal-800 text-sand-100 font-bold border border-sand-400/40 shadow-xs'
                : 'text-sand-300 hover:text-sand-100'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${activeRole === 'admin' ? 'text-electric-400' : 'text-sand-400'}`} />
            <span>Admin</span>
          </button>
        </div>

        {/* Student Auth Mode Switcher (Sign In vs Register) */}
        {activeRole === 'student' && (
          <div className="flex border-b border-charcoal-800 pb-2 gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
              className={`pb-1 flex items-center gap-1.5 transition ${
                authMode === 'login'
                  ? 'border-b-2 border-electric-400 text-sand-100 font-bold'
                  : 'text-sand-400 hover:text-sand-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-electric-400" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
              className={`pb-1 flex items-center gap-1.5 transition ${
                authMode === 'register'
                  ? 'border-b-2 border-electric-400 text-sand-100 font-bold'
                  : 'text-sand-400 hover:text-sand-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-sand-200" />
              <span>Register New Student</span>
            </button>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xl p-6 sm:p-8 space-y-6 text-sand-100">
          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  {activeRole === 'student' ? 'Student Email or Username' : `${activeRole} Email or Username`}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs sm:text-sm text-sand-100 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-electric-400 focus:border-electric-400 transition"
                    placeholder={activeRole === 'student' ? 'student01@smartcampus.edu' : `${activeRole}01@smartcampus.edu`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs sm:text-sm text-sand-100 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-electric-400 focus:border-electric-400 transition"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-charcoal-800 hover:bg-charcoal-700 text-sand-100 font-bold text-xs sm:text-sm rounded-xl border border-sand-400/40 hover:border-electric-400 shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying with Firebase...' : `Sign in as ${activeRole}`}</span>
                <ArrowRight className="w-4 h-4 text-electric-400" />
              </button>
            </form>
          ) : (
            /* MODE 2: STUDENT REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs sm:text-sm text-sand-100 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-electric-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="e.g. rahul.sharma@smartcampus.edu"
                  className="w-full px-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs sm:text-sm text-sand-100 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-electric-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  placeholder="Choose a strong password"
                  className="w-full px-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs sm:text-sm text-sand-100 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-electric-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                    Student Roll No
                  </label>
                  <input
                    type="text"
                    value={regData.studentId}
                    onChange={(e) => setRegData({ ...regData, studentId: e.target.value })}
                    placeholder="e.g. ST2024-055"
                    className="w-full px-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs text-sand-100 placeholder-charcoal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={regData.semester}
                    onChange={(e) => setRegData({ ...regData, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs text-sand-100"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-sand-300 mb-1">
                  Enrolled Department / Program
                </label>
                <select
                  value={regData.course}
                  onChange={(e) => setRegData({ ...regData, course: e.target.value })}
                  className="w-full px-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs text-sand-100"
                >
                  <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                  <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                  <option value="B.Tech Mechanical Engineering">B.Tech Mechanical Engineering</option>
                  <option value="B.Tech Civil Engineering">B.Tech Civil Engineering</option>
                  <option value="B.Tech Electronics & Comm.">B.Tech Electronics & Comm.</option>
                  <option value="MBA Tech Management">MBA Tech Management</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-charcoal-800 hover:bg-charcoal-700 text-sand-100 font-bold text-xs sm:text-sm rounded-xl border border-sand-400/40 hover:border-electric-400 shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4 text-electric-400" />
                  <span>{isLoading ? 'Creating Student in Firebase...' : 'Register as Student'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Demo Sandbox Quick Login Section */}
          <div className="pt-4 border-t border-charcoal-800">
            <details className="group">
              <summary className="flex items-center justify-between text-xs font-semibold text-sand-300 cursor-pointer hover:text-sand-100 transition list-none">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-electric-400" />
                  <span>Demo & Evaluation Mode (Local Sandbox)</span>
                </span>
                <span className="text-[10px] text-sand-200 bg-charcoal-800 border border-charcoal-700 px-2 py-0.5 rounded-full font-bold">
                  Bypass Auth
                </span>
              </summary>

              <div className="mt-3 space-y-3">
                <p className="text-[11px] text-sand-400">
                  Instant sandbox switcher. Does not contact Firebase Auth:
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('student')}
                    className="p-2.5 bg-charcoal-950 hover:bg-charcoal-800 border border-charcoal-700 hover:border-electric-400/50 rounded-xl text-center text-[11px] font-bold text-sand-200 transition"
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 text-electric-400" />
                    <span>Student Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('staff')}
                    className="p-2.5 bg-charcoal-950 hover:bg-charcoal-800 border border-charcoal-700 hover:border-electric-400/50 rounded-xl text-center text-[11px] font-bold text-sand-200 transition"
                  >
                    <Briefcase className="w-4 h-4 mx-auto mb-1 text-sand-300" />
                    <span>Staff Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('admin')}
                    className="p-2.5 bg-charcoal-950 hover:bg-charcoal-800 border border-charcoal-700 hover:border-electric-400/50 rounded-xl text-center text-[11px] font-bold text-sand-200 transition"
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1 text-electric-400" />
                    <span>Admin Demo</span>
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className="text-center text-xs text-sand-400">
          <Link to="/" className="text-electric-400 hover:text-electric-300 font-medium">
            ← Return to Campus Home
          </Link>
        </div>
      </div>
    </div>
  );
};
