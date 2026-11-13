import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Users,
  Target,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-electric-400 bg-charcoal-950 px-3 py-1 rounded-full">
          Institutional Vision & Mandate
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-sand-100 tracking-tight">
          Modernizing College Grievance Governance
        </h1>
        <p className="mt-4 text-base text-sand-300 leading-relaxed">
          The Smart Campus Issue Resolution System is a campus-wide initiative designed to replace fragmented manual paper registers with an automated, trackable, and student-first service resolution platform.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-charcoal-900 p-8 rounded-2xl border border-charcoal-800 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-charcoal-950 text-electric-400 flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-sand-100 mb-2">Our Mission</h3>
          <p className="text-xs sm:text-sm text-sand-300 leading-relaxed">
            To ensure zero student concern goes unattended. By digitizing complaints across academic and non-academic domains, every degree college department is held accountable to strict time-bound SLAs.
          </p>
        </div>

        <div className="bg-charcoal-900 p-8 rounded-2xl border border-charcoal-800 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-sand-100 mb-2">Privacy & Equity</h3>
          <p className="text-xs sm:text-sm text-sand-300 leading-relaxed">
            Ensuring a safe and unbiased campus climate. Students can report delicate hostel or canteen issues anonymously without fear of reprimand, backed by end-to-end encrypted tracking keys.
          </p>
        </div>

        <div className="bg-charcoal-900 p-8 rounded-2xl border border-charcoal-800 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-sand-100 mb-2">NAAC & UGC Compliance</h3>
          <p className="text-xs sm:text-sm text-sand-300 leading-relaxed">
            Complies with statutory University Grants Commission (UGC) Student Grievance Redressal Regulations and provides verifiable digital audit trails required for NAAC Criterion V ratings.
          </p>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-8 shadow-xs">
        <h3 className="text-xl font-bold text-sand-100 mb-6 text-center">
          Traditional Paper Letters vs. Smart Campus Digital Resolution
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-charcoal-800 bg-charcoal-950 text-sand-200 font-semibold">
                <th className="p-3">Evaluation Parameter</th>
                <th className="p-3 text-rose-700">Traditional Physical System</th>
                <th className="p-3 text-electric-300">Smart Campus Resolution System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sand-300">
              <tr>
                <td className="p-3 font-semibold text-sand-100">Lodging Speed</td>
                <td className="p-3">Requires finding physical staff office during hours</td>
                <td className="p-3 font-medium text-emerald-700">Instant submission 24/7 with photo upload</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-sand-100">Status Tracking</td>
                <td className="p-3">Zero visibility; students have to visit offices repeatedly</td>
                <td className="p-3 font-medium text-emerald-700">Live 4-stage tracking stepper with timestamped remarks</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-sand-100">Escalation Mechanism</td>
                <td className="p-3">Letters often misplaced; no automatic alerts</td>
                <td className="p-3 font-medium text-emerald-700">Automatic escalation to Dean when SLA expires</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-sand-100">Accountability</td>
                <td className="p-3">No centralized performance records</td>
                <td className="p-3 font-medium text-emerald-700">Complete HoD metrics and staff resolution analytics</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-sand-100">Post-Resolution Audit</td>
                <td className="p-3">Closed without student confirmation</td>
                <td className="p-3 font-medium text-emerald-700">Student can reopen ticket if problem persists</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/login?tab=student"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-md transition"
        >
          <span>Experience the System Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
