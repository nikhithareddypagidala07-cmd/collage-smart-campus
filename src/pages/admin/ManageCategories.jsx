import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Modal } from '../../components/common/Modal';
import {
  Tag,
  Clock,
  Building,
  Edit2,
  PlusCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const ManageCategories = () => {
  const { categories, departments, complaints, updateCategory, addCategory } = useComplaints();

  const [editCategory, setEditCategory] = useState(null);
  const [slaHours, setSlaHours] = useState(24);
  const [department, setDepartment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEdit = (cat) => {
    setEditCategory(cat);
    setSlaHours(cat.slaHours);
    setDepartment(cat.department);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editCategory) return;

    updateCategory(editCategory.id, {
      slaHours: Number(slaHours),
      department
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complaint Categories & SLA Configuration</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure default department mappings and target resolution turnaround hours across all 10 grievance categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const categoryComplaints = complaints.filter(c => c.category === cat.name);
          const resolved = categoryComplaints.filter(c => c.status === 'Resolved').length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <CategoryIcon iconName={cat.iconName} categoryName={cat.name} className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                    {cat.slaHours} Hours SLA
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Dept:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{cat.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Logged:</span>
                    <span className="font-bold text-slate-900">{categoryComplaints.length} issues</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Resolved Rate:</span>
                    <span className="font-bold text-emerald-600">
                      {categoryComplaints.length > 0 ? Math.round((resolved / categoryComplaints.length) * 100) : 100}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Configure SLA & Dept</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Configure Category: ${editCategory?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Mapped Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              New complaints under this category will automatically be assigned to this department.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Standard SLA Target Resolution (Hours) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="168"
              required
              value={slaHours}
              onChange={e => setSlaHours(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Issues exceeding this SLA will be flagged as Overdue and escalated to the Dean.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
