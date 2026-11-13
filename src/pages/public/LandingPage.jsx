import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Lock,
  Smartphone,
  BarChart,
  UserCheck,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Shield
} from 'lucide-react';

export const LandingPage = () => {
  const { quickLogin } = useAuth();
  const { categories, complaints } = useComplaints();
  const navigate = useNavigate();

  const handleRoleQuickLogin = (role) => {
    quickLogin(role);
    if (role === 'student') navigate('/student');
    if (role === 'staff') navigate('/staff');
    if (role === 'admin') navigate('/admin');
  };

  const totalResolved = complaints.filter(c => c.status === 'Resolved').length;
  const totalUrgent = complaints.filter(c => c.priority === 'Urgent').length;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section with Sanjay Ghodawat University Campus Photo Background */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-charcoal-800 min-h-[640px] flex items-center">
        {/* Background Campus Image with Deep Charcoal Vignette Gradient for Crisp Text Legibility */}
        <div className="absolute inset-0 z-0">
          <img
            src="/sgu_campus_hero.jpg"
            alt="Sanjay Ghodawat University Campus"
            className="w-full h-full object-cover object-center brightness-95"
          />
          {/* Multi-layered dark charcoal overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-900/85 to-charcoal-950/70 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-electric-600/25 text-electric-300 border border-electric-400/40 text-xs font-semibold mb-6 shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-electric-400 animate-pulse shadow-[0_0_8px_#0066ff]"></span>
              <span className="text-sand-100 font-medium">Sanjay Ghodawat University • Integrated Campus Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none drop-shadow-md">
              Your Campus. <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 via-cyan-300 to-sand-200">Your Voice.</span> Our Responsibility.
            </h1>

            {/* Short Description */}
            <p className="mt-6 text-base sm:text-lg text-sand-100/90 leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-normal">
              The official centralized platform for Sanjay Ghodawat University to streamline student grievances, track SLA resolution across 10 departments, and monitor academic attendance compliance.
            </p>

            {/* Action Buttons: Charcoal & Sand with Electric Blue Accents */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/student/submit"
                className="px-6 py-3.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 font-bold text-sm rounded-xl border border-sand-400/60 shadow-lg shadow-charcoal-950/60 flex items-center gap-2 transition transform hover:-translate-y-0.5 hover:border-electric-400 hover:shadow-electric-600/25"
              >
                <span>Submit Grievance</span>
                <ArrowRight className="w-4 h-4 text-electric-400" />
              </Link>
              <Link
                to="/login?tab=student"
                className="px-5 py-3.5 bg-sand-200 hover:bg-sand-300 text-charcoal-950 font-bold text-sm rounded-xl border border-sand-400 shadow-md flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <GraduationCap className="w-4 h-4 text-electric-600" />
                <span>Student Portal</span>
              </Link>
              <Link
                to="/login?tab=staff"
                className="px-5 py-3.5 bg-charcoal-900/90 hover:bg-charcoal-800 text-sand-100 font-semibold text-sm rounded-xl border border-sand-400/40 shadow-md backdrop-blur-md flex items-center gap-2 transition transform hover:-translate-y-0.5 hover:border-electric-400"
              >
                <Briefcase className="w-4 h-4 text-electric-400" />
                <span>Staff Portal</span>
              </Link>
              <Link
                to="/login?tab=admin"
                className="px-5 py-3.5 bg-sand-100/90 hover:bg-sand-200 text-charcoal-950 font-bold text-sm rounded-xl border border-sand-300 shadow-md backdrop-blur-md flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <Shield className="w-4 h-4 text-charcoal-800" />
                <span>Admin Console</span>
              </Link>
            </div>

            {/* Institutional Security Notice */}
            <div className="mt-6 p-3 bg-charcoal-900/80 border border-sand-400/30 rounded-xl text-xs text-sand-100/90 inline-flex items-center gap-2 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-4 h-4 text-electric-400 flex-shrink-0" />
              <span>
                <strong className="text-white">SGU Authorized Access:</strong> Secure Single Sign-On (SSO) enabled for students, faculty, and administrative staff.
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip with Glassmorphism */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-charcoal-900/85 backdrop-blur-md p-4 rounded-2xl border border-sand-400/30 text-center shadow-lg text-white">
              <span className="block text-3xl font-extrabold text-electric-400">22+</span>
              <span className="text-xs text-sand-100/80 font-medium">Logged Campus Grievances</span>
            </div>
            <div className="bg-charcoal-900/85 backdrop-blur-md p-4 rounded-2xl border border-sand-400/30 text-center shadow-lg text-white">
              <span className="block text-3xl font-extrabold text-sand-200">{totalResolved}</span>
              <span className="text-xs text-sand-100/80 font-medium">Resolved Complaints</span>
            </div>
            <div className="bg-charcoal-900/85 backdrop-blur-md p-4 rounded-2xl border border-sand-400/30 text-center shadow-lg text-white">
              <span className="block text-3xl font-extrabold text-white">10</span>
              <span className="text-xs text-sand-100/80 font-medium">Campus Departments</span>
            </div>
            <div className="bg-charcoal-900/85 backdrop-blur-md p-4 rounded-2xl border border-sand-400/30 text-center shadow-lg text-white">
              <span className="block text-3xl font-extrabold text-electric-300">&lt; 24h</span>
              <span className="text-xs text-sand-100/80 font-medium">Target Avg SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-electric-400 mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            How The Resolution System Operates
          </h3>
          <p className="mt-2 text-sm text-sand-300/80">
            From complaint submission to final resolution, every step is transparent, accountable, and digitized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-800 text-sand-100 shadow-md relative hover:border-sand-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-electric-400 font-bold flex items-center justify-center mb-4 text-base border border-charcoal-700 shadow-inner">
              1
            </div>
            <h4 className="text-base font-bold text-white mb-2">Student Reports</h4>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              Student chooses category, uploads photo evidence, selects priority, and receives an instant unique tracking ID.
            </p>
          </div>

          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-800 text-sand-100 shadow-md relative hover:border-sand-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-sand-200 font-bold flex items-center justify-center mb-4 text-base border border-charcoal-700 shadow-inner">
              2
            </div>
            <h4 className="text-base font-bold text-white mb-2">Auto Routing</h4>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              The ticket is automatically assigned to the respective department head and scheduled within its SLA target hours.
            </p>
          </div>

          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-800 text-sand-100 shadow-md relative hover:border-sand-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-electric-400 font-bold flex items-center justify-center mb-4 text-base border border-charcoal-700 shadow-inner">
              3
            </div>
            <h4 className="text-base font-bold text-white mb-2">Staff Investigates</h4>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              Maintenance engineer inspects, adds progress remarks, updates the lifecycle status, and uploads resolution sign-off.
            </p>
          </div>

          <div className="bg-charcoal-900/90 rounded-2xl p-6 border border-charcoal-800 text-sand-100 shadow-md relative hover:border-sand-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-emerald-400 font-bold flex items-center justify-center mb-4 text-base border border-charcoal-700 shadow-inner">
              4
            </div>
            <h4 className="text-base font-bold text-white mb-2">Verified & Closed</h4>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              Student gets instant notification. If satisfied, ticket closes; if issue persists, student can reopen with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Complaint Categories Section (All 10 required categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-electric-400 mb-2">
            Coverage Spectrum
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            10 Dedicated Campus Issue Categories
          </h3>
          <p className="mt-2 text-sm text-sand-300/80">
            Each category is pre-configured with strict SLA turnaround deadlines and mapped directly to campus departments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-charcoal-900/90 rounded-2xl p-5 border border-charcoal-800 hover:border-electric-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group text-sand-100"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-charcoal-800 text-electric-400 border border-charcoal-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-electric-600 group-hover:text-white transition">
                  <CategoryIcon iconName={cat.iconName} categoryName={cat.name} className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-electric-400 transition">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-sand-300/75 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-charcoal-800 flex items-center justify-between text-[11px]">
                <span className="text-sand-400 font-medium truncate max-w-[100px]">{cat.department}</span>
                <span className="px-2 py-0.5 rounded bg-charcoal-800 text-sand-200 border border-sand-400/30 font-bold">
                  {cat.slaHours}h SLA
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Key Platform Features Section */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Next-Gen Architecture
            </h2>
            <h3 className="text-3xl font-bold text-white">
              Purpose-Built for College Governance
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Modern digital infrastructure replacing slow registers and manual signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-2">Real-Time Tracking & Stepper</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students track exactly what stage their request is in: Submitted, Under Review, In Progress, or Resolved, with timestamps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-2">Confidential Whistleblower Toggle</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students can report sensitive mess, ragging, or hostel issues anonymously while still monitoring progress with their tracking code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-2">Auto Escalation & SLA Triggers</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complaints that exceed department resolution SLA deadlines trigger escalation notifications directly to the College Dean.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-2">Photo Evidence Verification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Attach images directly during submission to help technicians diagnose equipment breakdowns before visiting on-site.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-2">Student Reopen Protection</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an issue returns after being marked as resolved, students can reopen it with a persistence reason, ensuring quality accountability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold mb-2">Executive Analytics & Reports</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interactive charts for Deans and HoDs breaking down monthly volume, category hotspots, priority loads, and department throughput.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-electric-400 mb-2">
            Why Transition?
          </h2>
          <h3 className="text-3xl font-bold text-sand-100">
            Benefits for Students & Campus Administration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-charcoal-900 rounded-2xl p-8 border border-charcoal-800 shadow-xl text-sand-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-electric-400 border border-charcoal-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-sand-100">For Degree College Students</h4>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-sand-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Zero need to locate physical department staff or stand in paper queues.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>24/7 digital complaint lodging from anywhere inside or outside campus.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Live in-app notifications as soon as a technician updates remarks.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Guaranteed audit trail so issues cannot be swept under the rug.</span>
              </li>
            </ul>
          </div>

          <div className="bg-charcoal-900 rounded-2xl p-8 border border-charcoal-800 shadow-xl text-sand-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-sand-200 border border-charcoal-700 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-sand-100">For College Administration & HoDs</h4>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-sand-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Elimination of lost paper letters, duplicate complaints, and unassigned tasks.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Transparent staff workload tracking and SLA turnaround benchmarks.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Objective data for NAAC / UGC accreditation and infrastructure budgeting.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                <span>Automatic escalation alerts that prevent student dissatisfaction and campus strikes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Bottom Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 p-8 sm:p-12 text-sand-100 text-center shadow-2xl border border-sand-400/30 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-electric-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="text-2xl sm:text-4xl font-extrabold mb-4 text-white">
            Ready to experience frictionless campus issue resolution?
          </h3>
          <p className="text-sand-200 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Submit your first issue or test the system with our one-click simulated student, staff, and admin accounts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              to="/student/submit"
              className="px-6 py-3.5 bg-sand-200 hover:bg-sand-300 text-charcoal-950 font-bold text-sm rounded-xl shadow-md border border-sand-400 transition transform hover:-translate-y-0.5"
            >
              Submit a Campus Issue
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 border border-sand-400/50 hover:border-electric-400 font-bold text-sm rounded-xl transition shadow-sm transform hover:-translate-y-0.5"
            >
              Browse Demo Accounts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
