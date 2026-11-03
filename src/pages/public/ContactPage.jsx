import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building2,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export const ContactPage = () => {
  const { departments, showToast } = useComplaints();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Hostel Administration',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your inquiry has been routed to the campus administration helpdesk!', 'success');
  };

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Support & Escalations
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Campus Helpdesk & Directory
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          Need immediate physical support or have an administrative inquiry? Connect with the central grievance desk or contact specific department officers.
        </p>
      </div>

      {/* Emergency Strip */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">24/7 Campus Emergency Medical & Safety Hotline</h3>
            <p className="text-xs text-rose-700">For urgent medical distress, electrical fire hazards, or security threats.</p>
          </div>
        </div>
        <a
          href="tel:+911800200999"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap"
        >
          Call 1800-200-CAMPUS
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Campus Information */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">Administrative Office</h3>

            <div className="flex items-start gap-3 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Dean of Student Welfare Complex</p>
                <p>Ground Floor, Main Senate Building</p>
                <p>Knowledge Park Avenue, College Main Campus</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-600">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Operating Hours</p>
                <p>Monday – Friday: 9:00 AM – 5:30 PM</p>
                <p>Saturday: 9:00 AM – 1:30 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Email Inquiries</p>
                <p>grievances@smartcampus.edu</p>
                <p>dean.welfare@smartcampus.edu</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Student Council Grievance Cell</h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              Students can also seek peer assistance from the elected Student Welfare Committee before submitting formal departmental appeals.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive General Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Send an Administrative Inquiry</h3>
          <p className="text-xs text-slate-500 mb-6">
            Submit a non-complaint inquiry directly to the respective department head.
          </p>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900">Inquiry Received</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you for contacting the Campus Administration. A response will be dispatched to your college email within 1 business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-semibold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    College Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@smartcampus.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Target Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Bus pass renewal inquiry"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Message Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your inquiry or feedback..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Department Officers Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">Department Officers & Extension Roster</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{dept.name}</p>
              <p className="text-slate-600">Officer: <span className="font-medium text-slate-800">{dept.head}</span></p>
              <p className="text-slate-500 font-mono text-[11px]">{dept.email}</p>
              <p className="text-slate-500 font-mono text-[11px]">{dept.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
