import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from '../common/ToastContainer';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Shield,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = (role) => {
    quickLogin(role);
    if (role === 'student') navigate('/student');
    if (role === 'staff') navigate('/staff');
    if (role === 'admin') navigate('/admin');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About System', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact & Support', path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <ToastContainer />

      {/* Top Banner Notice */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sanjay Ghodawat University (SGU) • Digital Grievance & Academic Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Toll-Free Helpline: 1800-313-001566</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">support@sgu.ac.in</span>
          </div>
        </div>
      </div>

      {/* Main Public Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block leading-tight">
                Sanjay Ghodawat University
              </span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest block">
                Smart Campus Portal • Kolhapur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <Link
                to={
                  currentUser.role === 'student'
                    ? '/student'
                    : currentUser.role === 'staff'
                    ? '/staff'
                    : '/admin'
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
              >
                <span>Go to {currentUser.role} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login?tab=student"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Student Login
                </Link>
                <Link
                  to="/login?tab=staff"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Staff Login
                </Link>
                <Link
                  to="/login?tab=admin"
                  className="px-3.5 py-2 text-xs font-semibold bg-navy-900 text-white hover:bg-slate-800 rounded-lg shadow-xs transition"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login?tab=student"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg"
              >
                Student Login
              </Link>
              <Link
                to="/login?tab=staff"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg"
              >
                Staff Login
              </Link>
              <Link
                to="/login?tab=admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold bg-navy-900 text-white rounded-lg"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* College Institutional Footer */}
      <footer className="bg-navy-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            {/* Column 1: College & System Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-base">SmartCampus</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A modern grievance and complaint resolution platform engineered for degree colleges. Eliminating paper delays and empowering campus communities.
              </p>
              <div className="text-xs text-slate-400">
                <span className="inline-block px-2.5 py-1 bg-slate-800 text-blue-300 rounded-md font-mono">
                  ISO 9001:2015 Compliant
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Platform Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/" className="hover:text-blue-400 transition">Campus Portal Home</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition">About the System</Link></li>
                <li><Link to="/how-it-works" className="hover:text-blue-400 transition">How It Works</Link></li>
                <li><Link to="/login?tab=student" className="hover:text-blue-400 transition">Submit New Complaint</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition">Campus Support Contacts</Link></li>
              </ul>
            </div>

            {/* Column 3: Portals & Roles */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Access Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleQuickDemo('student')}
                    className="hover:text-blue-400 transition flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Student Resolution Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleQuickDemo('staff')}
                    className="hover:text-purple-400 transition flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>Department Staff Workbench</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleQuickDemo('admin')}
                    className="hover:text-rose-400 transition flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    <span>Dean & Administrator Analytics</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Help */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Campus Helpdesk & Dean Office
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Sanjay Ghodawat University, Kolhapur-Sangli Highway, Atigre, Maharashtra 416118</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>+91 90110 39800 / 1800-313-001566</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>grievances@sgu.ac.in</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Sanjay Ghodawat University (SGU), Kolhapur. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <span>Student Grievance Charter</span>
              <span>75% Attendance Regulation</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
