import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Modal } from '../../components/common/Modal';
import { maskPhoneNumber, maskEmail } from '../../utils/helpers';
import {
  Users,
  UserPlus,
  Search,
  GraduationCap,
  Briefcase,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck
} from 'lucide-react';

export const ManageUsers = () => {
  const { users, addMockUser, quickLogin } = useAuth();
  const { complaints, showToast } = useComplaints();

  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'staff' | 'admin'
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMasked, setIsMasked] = useState(true); // Default to PII Masked with asterisks

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: 'student',
    username: '',
    password: 'password123',
    email: '',
    phone: '+91 98765 00099',
    studentId: '',
    course: 'B.Tech Computer Science',
    semester: '1st Semester',
    hostelBlock: 'Block-A (Aryabhatta)',
    roomNo: '101',
    staffId: '',
    department: 'Electrical Maintenance',
    designation: 'Technician'
  });

  const studentsList = users.students || [];
  const staffList = users.staff || [];
  const adminObj = users.admin;

  const filteredStudents = studentsList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase()) ||
    s.staffId.toLowerCase().includes(search.toLowerCase()) ||
    s.designation.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.username.trim()) return;

    const userToAdd = {
      id: `usr-${Date.now()}`,
      name: newUserData.name,
      username: newUserData.username.toLowerCase(),
      password: newUserData.password,
      role: newUserData.role,
      email: newUserData.email || `${newUserData.username}@smartcampus.edu`,
      phone: newUserData.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      ...(newUserData.role === 'student' ? {
        studentId: newUserData.studentId || `ST2024-${Math.floor(100 + Math.random() * 900)}`,
        course: newUserData.course,
        semester: newUserData.semester,
        hostelBlock: newUserData.hostelBlock,
        roomNo: newUserData.roomNo
      } : {
        staffId: newUserData.staffId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
        department: newUserData.department,
        designation: newUserData.designation
      })
    };

    addMockUser(userToAdd);
    setIsAddModalOpen(false);
    showToast(`Account for ${userToAdd.name} (${userToAdd.role}) created successfully!`, 'success');

    // Reset
    setNewUserData({
      name: '',
      role: 'student',
      username: '',
      password: 'password123',
      email: '',
      phone: '+91 98765 00099',
      studentId: '',
      course: 'B.Tech Computer Science',
      semester: '1st Semester',
      hostelBlock: 'Block-A (Aryabhatta)',
      roomNo: '101',
      staffId: '',
      department: 'Electrical Maintenance',
      designation: 'Technician'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sand-100">Campus User Management</h1>
          <p className="text-xs sm:text-sm text-sand-400">
            Audit student, departmental staff, and administrative rosters across the university
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-electric-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Mock User Account</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'students'
                ? 'bg-electric-600 text-white shadow-xs'
                : 'bg-slate-100 text-sand-300 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students ({studentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'staff'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-sand-300 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Staff Roster ({staffList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'admin'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-slate-100 text-sand-300 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Administration</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Privacy Masking Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMasked(!isMasked);
              showToast(isMasked ? 'Privacy Masking OFF: Showing full student phone & email' : 'Privacy Protection ON: Student PII masked with asterisks', 'info');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border shadow-2xs ${
              isMasked
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-sand-200 border-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle Privacy Masking for sensitive student contact details"
          >
            {isMasked ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-sand-300" />}
            <span className="hidden sm:inline">Privacy Masking:</span>
            <span className="font-mono font-bold">{isMasked ? 'ON (***** )' : 'OFF'}</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-sand-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search roster..."
              className="w-full pl-9 pr-3 py-2 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      {isMasked && (
        <div className="px-4 py-2.5 bg-charcoal-950/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-electric-400 flex-shrink-0" />
            <span>
              <strong>PII Privacy Protection Active:</strong> Student contact phone numbers & emails are masked with asterisks (<code>*****</code>). Click the toggle above to reveal.
            </span>
          </div>
        </div>
      )}

      {/* Students Table */}
      {activeTab === 'students' && (
        <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-sand-300 font-semibold border-b border-charcoal-800">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Student ID</th>
                  <th className="px-6 py-3.5">Academic Program</th>
                  <th className="px-6 py-3.5">Hostel & Room</th>
                  <th className="px-6 py-3.5">Phone (Masked)</th>
                  <th className="px-6 py-3.5">Email (Masked)</th>
                  <th className="px-6 py-3.5">Issues</th>
                  <th className="px-6 py-3.5 text-right">Switch User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-sand-200">
                {filteredStudents.map(student => {
                  const studentCmps = complaints.filter(c => c.studentId === student.studentId).length;
                  return (
                    <tr key={student.id} className="hover:bg-charcoal-950/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-sand-100 block">{student.name}</span>
                            <span className="text-[10px] text-sand-400 font-mono">@{student.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-electric-300">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sand-100">{student.course}</div>
                        <div className="text-[11px] text-sand-400">{student.semester}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sand-100 font-medium">{student.hostelBlock}</div>
                        <div className="text-[11px] text-sand-400">Room: {student.roomNo}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sand-200 font-medium whitespace-nowrap">
                        {isMasked ? maskPhoneNumber(student.phone) : student.phone}
                      </td>
                      <td className="px-6 py-4 font-mono text-sand-300 whitespace-nowrap">
                        {isMasked ? maskEmail(student.email) : student.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-sand-200">
                          {studentCmps}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            quickLogin('student', student.id);
                            showToast(`Switched active session to ${student.name}`, 'info');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-electric-300 bg-charcoal-950 hover:bg-blue-100 rounded-lg transition"
                          title="Simulate login as this student"
                        >
                          Switch
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Table */}
      {activeTab === 'staff' && (
        <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-sand-300 font-semibold border-b border-charcoal-800">
                <tr>
                  <th className="px-6 py-3.5">Staff Officer</th>
                  <th className="px-6 py-3.5">Employee ID</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Designation</th>
                  <th className="px-6 py-3.5">Contact Phone</th>
                  <th className="px-6 py-3.5">Official Email</th>
                  <th className="px-6 py-3.5">Tasks</th>
                  <th className="px-6 py-3.5 text-right">Switch User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-sand-200">
                {filteredStaff.map(staff => {
                  const staffTasks = complaints.filter(c => c.assignedStaffId === staff.id).length;
                  return (
                    <tr key={staff.id} className="hover:bg-charcoal-950/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-sand-100 block">{staff.name}</span>
                            <span className="text-[10px] text-sand-400 font-mono">@{staff.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-purple-700">
                        {staff.staffId}
                      </td>
                      <td className="px-6 py-4 font-semibold text-sand-100">
                        {staff.department}
                      </td>
                      <td className="px-6 py-4 text-sand-300">
                        {staff.designation}
                      </td>
                      <td className="px-6 py-4 font-mono text-sand-200 font-medium whitespace-nowrap">
                        {isMasked ? maskPhoneNumber(staff.phone) : staff.phone}
                      </td>
                      <td className="px-6 py-4 font-mono text-sand-300 whitespace-nowrap">
                        {isMasked ? maskEmail(staff.email) : staff.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">
                          {staffTasks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            quickLogin('staff', staff.id);
                            showToast(`Switched active session to ${staff.name}`, 'info');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                        >
                          Switch
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Tab View */}
      {activeTab === 'admin' && (
        <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs max-w-xl">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={adminObj.avatar}
              alt={adminObj.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-rose-50"
            />
            <div>
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Chief Administrator
              </span>
              <h3 className="text-lg font-bold text-sand-100 mt-1">{adminObj.name}</h3>
              <p className="text-xs text-sand-400">{adminObj.designation}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs border-t border-charcoal-800 pt-4">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-sand-400">Admin Code:</span>
              <span className="font-mono font-bold text-sand-100">{adminObj.adminId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-sand-400">Username:</span>
              <span className="font-mono font-bold text-sand-100">{adminObj.username}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-sand-400">Email:</span>
              <span className="font-mono text-sand-100">{adminObj.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sand-400">Emergency Phone:</span>
              <span className="font-mono text-sand-100">{adminObj.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Mock User Account"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddUserSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
              User Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewUserData({ ...newUserData, role: 'student' })}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  newUserData.role === 'student'
                    ? 'border-blue-600 bg-charcoal-950 text-electric-300'
                    : 'border-charcoal-800 bg-charcoal-950 text-sand-200'
                }`}
              >
                Student Account
              </button>
              <button
                type="button"
                onClick={() => setNewUserData({ ...newUserData, role: 'staff' })}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  newUserData.role === 'staff'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-charcoal-800 bg-charcoal-950 text-sand-200'
                }`}
              >
                Staff Account
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newUserData.name}
              onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
              placeholder="e.g. Vikramaditya Rathore"
              className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
              Username (Login) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newUserData.username}
              onChange={e => setNewUserData({ ...newUserData, username: e.target.value })}
              placeholder="e.g. student11 or staff06"
              className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {newUserData.role === 'student' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
                  Academic Degree Course
                </label>
                <input
                  type="text"
                  value={newUserData.course}
                  onChange={e => setNewUserData({ ...newUserData, course: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
                    Hostel Block
                  </label>
                  <input
                    type="text"
                    value={newUserData.hostelBlock}
                    onChange={e => setNewUserData({ ...newUserData, hostelBlock: e.target.value })}
                    placeholder="Block-A"
                    className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
                    Room No
                  </label>
                  <input
                    type="text"
                    value={newUserData.roomNo}
                    onChange={e => setNewUserData({ ...newUserData, roomNo: e.target.value })}
                    placeholder="204"
                    className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
                  Assigned Department
                </label>
                <input
                  type="text"
                  value={newUserData.department}
                  onChange={e => setNewUserData({ ...newUserData, department: e.target.value })}
                  placeholder="e.g. Electrical Maintenance"
                  className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={newUserData.designation}
                  onChange={e => setNewUserData({ ...newUserData, designation: e.target.value })}
                  placeholder="e.g. Electrical Supervisor"
                  className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sand-200 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-electric-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
