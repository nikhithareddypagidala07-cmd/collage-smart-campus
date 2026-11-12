import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  Check
} from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

export const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, quickLogin, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, resetDemoData } = useComplaints();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const navigate = useNavigate();

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return n.userRole === 'admin' || n.userId === 'adm-01';
    if (currentUser.role === 'staff') return n.userRole === 'staff' || n.userId === currentUser.id;
    return n.userRole === 'student' || n.userId === currentUser.studentId;
  });

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    setShowNotifications(false);
    if (currentUser.role === 'student') {
      navigate(`/student/complaints/${notif.complaintId}`);
    } else if (currentUser.role === 'staff') {
      navigate(`/staff/complaints/${notif.complaintId}`);
    } else {
      navigate(`/admin/complaints?search=${notif.trackingId}`);
    }
  };

  const handleRoleSwitch = (role) => {
    quickLogin(role);
    setShowRoleSwitcher(false);
    if (role === 'student') navigate('/student');
    if (role === 'staff') navigate('/staff');
    if (role === 'admin') navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-sand-300 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:text-charcoal-950 hover:bg-sand-100 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-charcoal-900 text-sand-100 border border-sand-400/40 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-electric-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-charcoal-950 tracking-tight text-sm sm:text-base block leading-tight">
                Sanjay Ghodawat University
              </span>
              <span className="text-[10px] font-bold text-electric-600 uppercase tracking-widest block">
                SGU Issue Resolution Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Demo Role Switcher Pill in Sand & Charcoal */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sand-100 hover:bg-sand-200 text-charcoal-900 rounded-lg text-xs font-bold transition border border-sand-300"
              title="Switch user account"
            >
              <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse"></span>
              <span className="hidden md:inline text-charcoal-600 font-normal">Active Role:</span>
              <span className="capitalize font-bold text-charcoal-950">
                {currentUser ? currentUser.role : 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-600" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Portal Account
                </div>
                <button
                  onClick={() => handleRoleSwitch('student')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 transition ${
                    currentUser?.role === 'student' ? 'text-blue-700 font-semibold bg-blue-50/60' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Student (Aarav Sharma)</span>
                  </div>
                  {currentUser?.role === 'student' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('staff')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-purple-50 transition ${
                    currentUser?.role === 'staff' ? 'text-purple-700 font-semibold bg-purple-50/60' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Staff (Suresh Kumar - Elec)</span>
                  </div>
                  {currentUser?.role === 'staff' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-rose-50 transition ${
                    currentUser?.role === 'admin' ? 'text-rose-700 font-semibold bg-rose-50/60' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-600" />
                    <span>Admin (Dr. Rajeshwar Rao)</span>
                  </div>
                  {currentUser?.role === 'admin' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
                setShowRoleSwitcher(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 max-h-[80vh] flex flex-col">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead(currentUser?.studentId || currentUser?.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-80">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    userNotifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition ${
                          !notif.isRead ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {timeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        {notif.trackingId && (
                          <span className="inline-block mt-1 text-[10px] font-mono text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                            {notif.trackingId}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/50">
                  <Link
                    to={currentUser?.role === 'student' ? '/student/notifications' : '#'}
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowRoleSwitcher(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser?.name || 'User'}
                </span>
                <span className="block text-[10px] text-slate-500 capitalize">
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 rounded">
                    {currentUser?.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to={
                      currentUser?.role === 'student'
                        ? '/student/profile'
                        : currentUser?.role === 'staff'
                        ? '/staff/profile'
                        : '/admin'
                    }
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Account & Profile</span>
                  </Link>

                  <Link
                    to="/"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Public Portal View</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      resetDemoData();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 transition"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <span>Reset All Mock Data</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
