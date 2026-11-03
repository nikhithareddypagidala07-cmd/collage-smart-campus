import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { Modal } from '../../components/common/Modal';
import {
  Building,
  PlusCircle,
  Mail,
  Phone,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManageDepartments = () => {
  const { departments, complaints, addDepartment } = useComplaints();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    head: '',
    email: '',
    phone: '+91 98765 00000'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newDept.name.trim() || !newDept.head.trim()) return;

    addDepartment(newDept);
    setIsAddModalOpen(false);
    setNewDept({ name: '', head: '', email: '', phone: '+91 98765 00000' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Departments & Service Divisions</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure institutional service units, responsible heads of department, and active caseloads
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => {
          const deptComplaints = complaints.filter(c => c.department === dept.name);
          const active = deptComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
          const resolved = deptComplaints.filter(c => c.status === 'Resolved').length;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                    {deptComplaints.length} Total Issues
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-4">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Supervisor: <strong>{dept.head}</strong></span>
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 font-mono border-t border-slate-100 pt-3">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.phone}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-orange-600 font-bold">{active} Active</span>
                  <span className="text-emerald-600 font-bold">{resolved} Resolved</span>
                </div>
                <Link
                  to={`/admin/complaints?dept=${encodeURIComponent(dept.name)}`}
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Queue</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New College Department"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newDept.name}
              onChange={e => setNewDept({ ...newDept, name: e.target.value })}
              placeholder="e.g. Sports & Gymnasium Facilities"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Head of Department / Officer <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newDept.head}
              onChange={e => setNewDept({ ...newDept, head: e.target.value })}
              placeholder="e.g. Dr. Harish Chandra"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Official Email
            </label>
            <input
              type="email"
              required
              value={newDept.email}
              onChange={e => setNewDept({ ...newDept, email: e.target.value })}
              placeholder="sports@smartcampus.edu"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Phone / Helpline
            </label>
            <input
              type="text"
              value={newDept.phone}
              onChange={e => setNewDept({ ...newDept, phone: e.target.value })}
              placeholder="+91 98765 00000"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
