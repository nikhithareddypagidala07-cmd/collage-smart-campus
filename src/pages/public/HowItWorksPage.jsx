import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  RotateCcw,
  Camera,
  Bell,
  Clock,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const HowItWorksPage = () => {
  const lifecycle = [
    {
      step: '01',
      title: 'Complaint Lodging & Tracking ID Generation',
      status: 'Submitted',
      description: 'The student selects one of 10 campus categories (Academics, Hostel, Electrical, Sanitation, etc.), adds description, specifies urgency priority, and optionally attaches photo evidence.',
      highlight: 'An immutable unique tracking ID (e.g. CMP-2024-8192) is generated instantaneously and saved to LocalStorage.'
    },
    {
      step: '02',
      title: 'Department Mapping & Triage',
      status: 'Under Review',
      description: 'The system automatically routes the issue to the respective departmental supervisor (e.g. Electrical Maintenance or Hostel Warden). The supervisor checks severity and assigns a field technician.',
      highlight: 'SLA target timer activates based on category standards (e.g. 12h for Sanitation, 24h for Electrical).'
    },
    {
      step: '03',
      title: 'Maintenance Execution & Live Updates',
      status: 'In Progress',
      description: 'Staff inspects equipment on-site, logs technician remarks (e.g. parts replaced, contractor ordered), and records detailed progress notes visible in the student audit trail.',
      highlight: 'Real-time in-app notification triggers on the student’s portal whenever remarks are updated.'
    },
    {
      step: '04',
      title: 'Resolution Sign-off & Student Verification',
      status: 'Resolved',
      description: 'Once repaired, the staff marks the complaint as Resolved with complete resolution notes. The student dashboard displays a celebratory resolution banner and verification sign-off.',
      highlight: 'If the issue persists, the student can hit "Reopen Complaint" with a persistence remark.'
    }
  ];

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Lifecycle Blueprint
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Complaints Flow Through the System
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          A fully transparent 4-stage workflow designed with automated SLA tracking, role segregation, and student feedback validation.
        </p>
      </div>

      {/* Workflow Stepper Details */}
      <div className="space-y-8">
        {lifecycle.map((item, idx) => (
          <div
            key={item.step}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-blue-300 transition"
          >
            <div className="flex items-start gap-5 flex-1">
              <span className="text-3xl font-extrabold text-blue-600/30 font-mono">
                {item.step}
              </span>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                  💡 <span className="text-slate-900 font-semibold">Key Feature:</span> {item.highlight}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edge Case States (Rejected, Escalated, Reopened) */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          Handling Exceptions & Complex Lifecycles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status="Rejected" size="sm" />
              <h4 className="text-xs font-bold text-slate-900">Rejected With Reason</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an issue falls outside college jurisdiction or violates hostel rules, staff must provide a mandatory written justification before rejecting.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status="Escalated" size="sm" />
              <h4 className="text-xs font-bold text-slate-900">Dean Escalation</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If a complaint exceeds its statutory SLA deadline without resolution, it triggers automatic escalation to the Dean of Student Welfare.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status="Reopened" size="sm" />
              <h4 className="text-xs font-bold text-slate-900">Student Reopen Guarantee</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If a repair fails within 7 days, the student can reopen the ticket with a single tap, returning it to the department queue with high urgency.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/student/submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-md transition"
        >
          <span>Try Submitting a Test Complaint</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
