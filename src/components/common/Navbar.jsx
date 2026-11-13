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
    <header className="sticky top-0 z-30 bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-800 shadow-sm text-sand-100">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-sand-300 hover:text-white hover:bg-charcoal-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-charcoal-950 text-sand-100 border border-sand-400/40 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-electric-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base block leading-tight">
                Sanjay Ghodawat University
              </span>
              <span className="text-[10px] font-bold text-electric-400 uppercase tracking-widest block">
                SGU Issue Resolution Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Demo Role Switcher Pill in Charcoal & Sand */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-charcoal-800 hover:bg-charcoal-700 text-sand-100 rounded-lg text-xs font-bold transition border border-charcoal-700"
              title="Switch user account"
            >
              <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse"></span>
              <span className="hidden md:inline text-sand-300/70 font-normal">Active Role:</span>
              <span className="capitalize font-bold text-white">
                {currentUser ? currentUser.role : 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-sand-400" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-56 bg-charcoal-900 rounded-xl shadow-2xl border border-charcoal-800 py-1.5 z-40 text-sand-100">
                <div className="px-3 py-1.5 border-b border-charcoal-800 text-[11px] font-bold uppercase tracking-wider text-sand-400/70">
                  Switch Active Portal Account
                </div>
                <button
                  onClick={() => handleRoleSwitch('student')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-charcoal-800 transition ${
                    currentUser?.role === 'student' ? 'text-electric-400 font-bold bg-charcoal-800/80' : 'text-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-electric-400" />
                    <span>Student (Aarav Sharma)</span>
                  </div>
                  {currentUser?.role === 'student' && <Check className="w-3.5 h-3.5 text-electric-400" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('staff')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-charcoal-800 transition ${
                    currentUser?.role === 'staff' ? 'text-sand-200 font-bold bg-charcoal-800/80' : 'text-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sand-300" />
                    <span>Staff (Suresh Kumar - Elec)</span>
                  </div>
                  {currentUser?.role === 'staff' && <Check className="w-3.5 h-3.5 text-sand-300" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-charcoal-800 transition ${
                    currentUser?.role === 'admin' ? 'text-electric-400 font-bold bg-charcoal-800/80' : 'text-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-electric-400" />
                    <span>Admin (Dr. Rajeshwar Rao)</span>
                  </div>
                  {currentUser?.role === 'admin' && <Check className="w-3.5 h-3.5 text-electric-400" />}
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
              className="relative p-2 rounded-lg text-sand-300 hover:text-white hover:bg-charcoal-800 transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 text-electric-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-charcoal-900 rounded-2xl shadow-2xl border border-charcoal-800 py-2 z-40 max-h-[80vh] flex flex-col text-sand-100">
                <div className="px-4 py-2 border-b border-charcoal-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-charcoal-800 text-electric-400 border border-charcoal-700 rounded-full text-xs font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead(currentUser?.studentId || currentUser?.id)}
                      className="text-xs text-electric-400 hover:text-electric-300 font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-charcoal-800 overflow-y-auto max-h-80">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-sand-400/60 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    userNotifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3.5 hover:bg-charcoal-800/80 cursor-pointer transition ${
                          !notif.isRead ? 'bg-charcoal-800/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs ${!notif.isRead ? 'font-bold text-white' : 'font-medium text-sand-200'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-sand-400/70 whitespace-nowrap">
                            {timeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-sand-300/80 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        {notif.trackingId && (
                          <span className="inline-block mt-1 text-[10px] font-mono text-electric-400 bg-charcoal-950 border border-charcoal-700 px-1.5 py-0.5 rounded">
                            {notif.trackingId}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-charcoal-800 text-center bg-charcoal-950/60">
                  <Link
                    to={currentUser?.role === 'student' ? '/student/notifications' : '#'}
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-electric-400 hover:text-electric-300 font-bold"
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
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-charcoal-800 transition border border-transparent hover:border-charcoal-700 text-sand-100"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-charcoal-700"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-white leading-tight">
                  {currentUser?.name || 'User'}
                </span>
                <span className="block text-[10px] text-sand-300/80 capitalize">
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-sand-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-charcoal-900 rounded-2xl shadow-2xl border border-charcoal-800 py-2 z-40 text-sand-100">
                <div className="px-4 py-2.5 border-b border-charcoal-800">
                  <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-sand-300/70 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-charcoal-800 text-sand-200 border border-charcoal-700 rounded">
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
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-sand-200 hover:bg-charcoal-800 hover:text-white transition"
                  >
                    <User className="w-4 h-4 text-electric-400" />
                    <span>My Account & Profile</span>
                  </Link>

                  <Link
                    to="/"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-sand-200 hover:bg-charcoal-800 hover:text-white transition"
                  >
                    <ExternalLink className="w-4 h-4 text-electric-400" />
                    <span>Public Portal View</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      resetDemoData();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-400 hover:bg-charcoal-800 transition"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Reset All Mock Data</span>
                  </button>
                </div>

                <div className="border-t border-charcoal-800 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 transition font-bold"
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
