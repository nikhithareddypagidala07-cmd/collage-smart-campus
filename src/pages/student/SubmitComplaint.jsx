import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import {
  PlusCircle,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';

// Sample evidence images for quick one-click testing
const PRESET_EVIDENCE_IMAGES = [
  {
    name: 'Electrical Issue',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Plumbing / Water Leak',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Classroom Projector',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Canteen / Mess Food',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
  }
];

export const SubmitComplaint = () => {
  const { currentUser } = useAuth();
  const { categories, submitComplaint } = useComplaints();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: categories[0]?.name || 'Academics',
    department: categories[0]?.department || 'Academic Affairs',
    priority: 'Medium',
    location: '',
    description: '',
    isConfidential: false,
    evidenceImage: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdComplaint, setCreatedComplaint] = useState(null);

  // Auto-map department whenever category changes
  useEffect(() => {
    const matchedCategory = categories.find(c => c.name === formData.category);
    if (matchedCategory) {
      setFormData(prev => ({
        ...prev,
        department: matchedCategory.department
      }));
    }
  }, [formData.category, categories]);

  // Set default student location
  useEffect(() => {
    if (currentUser && !formData.location) {
      const defaultLoc = currentUser.hostelBlock !== 'Day Scholar'
        ? `${currentUser.hostelBlock}, Room ${currentUser.roomNo}`
        : 'Main Academic Campus';
      setFormData(prev => ({ ...prev, location: defaultLoc }));
    }
  }, [currentUser]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, evidenceImage: reader.result }));
        setErrors(prev => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetImage = (url) => {
    setImagePreview(url);
    setFormData(prev => ({ ...prev, evidenceImage: url }));
    setErrors(prev => ({ ...prev, image: null }));
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, evidenceImage: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Complaint title is required.';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description.';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters for technicians to understand.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Specific campus location or room number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newCmp = submitComplaint(formData, currentUser);
      setIsSubmitting(false);
      setCreatedComplaint(newCmp);
    }, 400);
  };

  if (createdComplaint) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Registration Successful
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3">
              Complaint Lodged Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Your grievance has been digitized, assigned a tracking number, and routed to the respective department.
            </p>
          </div>

          {/* Tracking ID Badge Display */}
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
            <p className="text-xs text-blue-700 uppercase font-bold tracking-wider">
              Your Unique Tracking ID
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-900 tracking-wider">
              {createdComplaint.trackingId}
            </p>
            <p className="text-[11px] text-blue-600">
              Assigned to: <strong>{createdComplaint.department}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/student/complaints/${createdComplaint.id}`)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md"
            >
              <span>Track Complaint Status Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCreatedComplaint(null);
                setFormData({
                  title: '',
                  category: categories[0]?.name || 'Academics',
                  department: categories[0]?.department || 'Academic Affairs',
                  priority: 'Medium',
                  location: `${currentUser?.hostelBlock || 'Campus'}, Room ${currentUser?.roomNo || ''}`,
                  description: '',
                  isConfidential: false,
                  evidenceImage: null
                });
                setImagePreview(null);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition"
            >
              Submit Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submit New Campus Complaint</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide accurate issue details and photo evidence to enable rapid departmental resolution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Category & Mapped Department Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Complaint Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.slaHours}h SLA)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Auto-Mapped Department
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-900 font-semibold">
              <Building className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">{formData.department}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Directly routed based on chosen category.
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Complaint Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Ceiling Fan Making Heavy Sparking Noise in Room 304"
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Priority Selector & Specific Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Severity Priority <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Low', 'Medium', 'High', 'Urgent'].map(p => {
                const isSelected = formData.priority === p;
                let activeStyle = 'border-blue-600 bg-blue-50 text-blue-700 font-bold';
                if (p === 'Urgent') activeStyle = 'border-rose-600 bg-rose-50 text-rose-700 font-bold';
                if (p === 'High') activeStyle = 'border-orange-600 bg-orange-50 text-orange-700 font-bold';

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-2 text-xs rounded-xl border text-center transition ${
                      isSelected ? activeStyle : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Campus Location / Room <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Block-A Room 304, LH-201, Canteen"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.location && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Issue Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Explain the problem in detail: when did it start, equipment model if visible, impact on academic or living activities..."
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
            }`}
          ></textarea>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Minimum 20 characters</span>
            <span>{formData.description.length} characters</span>
          </div>
          {errors.description && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Image Upload with Preview and Presets */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Supporting Image Evidence (Optional but Recommended)
          </label>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-64 flex items-center justify-center group">
              <img
                src={imagePreview}
                alt="Evidence Preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-400 transition bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to browse photo or drag and drop
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, WEBP up to 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}

          {/* Quick Preset Images for effortless evaluation */}
          {!imagePreview && (
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Quick sample image presets for testing:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_EVIDENCE_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPresetImage(img.url)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 border border-slate-200"
                  >
                    <ImageIcon className="w-3 h-3 text-blue-500" />
                    <span>{img.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confidential Whistleblower Option */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
          <input
            type="checkbox"
            id="confidentialCheck"
            checked={formData.isConfidential}
            onChange={e => setFormData({ ...formData, isConfidential: e.target.checked })}
            className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <label htmlFor="confidentialCheck" className="text-xs text-slate-700 cursor-pointer">
            <span className="font-bold text-slate-900 block flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              Submit as Confidential / Anonymous Complaint
            </span>
            <span className="text-slate-500 block mt-0.5 leading-relaxed">
              Your name and student ID will be masked as "Anonymous Student" in staff and technician views. Only the Chief Administrator can inspect identity if mandated.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Generating Tracking ID...</span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Submit Complaint & Generate Tracking ID</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
