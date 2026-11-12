import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User,
  Users,
  Building,
  Tag,
  BarChart3,
  AlertTriangle,
  LogOut,
  X,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { complaints, notifications, resetDemoData } = useComplaints();
  const navigate = useNavigate();

  const role = currentUser ? currentUser.role : 'student';

  // Badges counts
  const studentPending = complaints.filter(
    c => c.studentId === currentUser?.studentId && c.status !== 'Resolved' && c.status !== 'Rejected'
  ).length;

  const staffPending = complaints.filter(
    c => c.department === currentUser?.department && c.status !== 'Resolved' && c.status !== 'Rejected'
  ).length;

  const escalatedCount = complaints.filter(c => c.status === 'Escalated').length;

  const unreadNotifs = notifications.filter(n => {
    if (role === 'admin') return !n.isRead && (n.userRole === 'admin' || n.userId === 'adm-01');
    if (role === 'staff') return !n.isRead && (n.userRole === 'staff' || n.userId === currentUser?.id);
    return !n.isRead && (n.userRole === 'student' || n.userId === currentUser?.studentId);
  }).length;

  // Student Navigation Links
  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Submit Complaint', path: '/student/submit', icon: PlusCircle, highlight: true },
    { name: 'My Complaints', path: '/student/complaints', icon: FileText, badge: studentPending },
    { name: 'My Attendance', path: '/student/attendance', icon: CalendarCheck },
    { name: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadNotifs },
    { name: 'My Profile', path: '/student/profile', icon: User }
  ];

  // Staff Navigation Links
  const staffLinks = [
    { name: 'Staff Dashboard', path: '/staff', icon: LayoutDashboard },
    { name: 'Assigned Complaints', path: '/staff/assigned', icon: FileText, badge: staffPending },
    { name: 'Mark Attendance', path: '/staff/attendance', icon: CalendarCheck },
    { name: 'Staff Profile', path: '/staff/profile', icon: User }
  ];

  // Admin Navigation Links
  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'All Complaints', path: '/admin/complaints', icon: FileText, badge: complaints.length },
    { name: 'Attendance Audit', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Departments', path: '/admin/departments', icon: Building },
    { name: 'Categories & SLA', path: '/admin/categories', icon: Tag },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Escalation Center', path: '/admin/escalations', icon: AlertTriangle, badge: escalatedCount, alertBadge: true }
  ];

  let currentLinks = studentLinks;
  if (role === 'staff') currentLinks = staffLinks;
  if (role === 'admin') currentLinks = adminLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-charcoal-950 text-sand-200 flex flex-col transition-transform duration-300 ease-in-out border-r border-charcoal-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-charcoal-800 bg-charcoal-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-600 flex items-center justify-center text-white font-bold shadow-md shadow-electric-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight leading-tight block">
                SGU Portal
              </span>
              <span className="text-[10px] text-electric-400 font-bold uppercase tracking-wider block">
                Sanjay Ghodawat Univ.
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-sand-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Quick Snapshot */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-charcoal-900/90 border border-charcoal-800 flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-lg object-cover ring-2 ring-electric-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-sand-100 truncate">
              {currentUser?.name || 'Authorized User'}
            </p>
            <p className="text-[11px] text-sand-400 truncate">
              {role === 'student' ? currentUser?.studentId : role === 'staff' ? currentUser?.department : 'Admin Office'}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-sand-400">
            {role} workspace
          </div>

          {currentLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/student' || link.path === '/staff' || link.path === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-electric-600 text-white shadow-md shadow-electric-600/30 font-bold'
                      : link.highlight
                      ? 'text-electric-300 hover:bg-charcoal-900 hover:text-white'
                      : 'text-sand-200 hover:bg-charcoal-900 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.name}</span>
                </div>

                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      link.alertBadge
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-charcoal-900 text-electric-300 border border-charcoal-700'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Helper Controls */}
        <div className="p-3 border-t border-charcoal-800 bg-charcoal-950/80 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-sand-300 hover:text-white rounded-lg hover:bg-charcoal-900 transition"
          >
            <ExternalLink className="w-4 h-4 text-electric-400" />
            <span>SGU Public Portal</span>
          </Link>

          {role === 'admin' && (
            <button
              onClick={resetDemoData}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-sand-300 hover:text-amber-300 rounded-lg hover:bg-amber-950/30 transition"
              title="Reset records to default university database"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset University Records</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
