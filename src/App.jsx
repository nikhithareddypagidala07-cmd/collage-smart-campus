import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { AttendanceProvider } from './context/AttendanceContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SubmitComplaint } from './pages/student/SubmitComplaint';
import { MyComplaints } from './pages/student/MyComplaints';
import { ComplaintDetails } from './pages/student/ComplaintDetails';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { StudentProfile } from './pages/student/StudentProfile';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AssignedComplaints } from './pages/staff/AssignedComplaints';
import { StaffComplaintDetails } from './pages/staff/StaffComplaintDetails';
import { StaffAttendance } from './pages/staff/StaffAttendance';
import { StaffProfile } from './pages/staff/StaffProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AllComplaints } from './pages/admin/AllComplaints';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageDepartments } from './pages/admin/ManageDepartments';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ComplaintAnalytics } from './pages/admin/ComplaintAnalytics';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { EscalationReports } from './pages/admin/EscalationReports';

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <AttendanceProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Institutional Pages */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>

              {/* Student Portal Routes */}
              <Route path="/student" element={<DashboardLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="submit" element={<SubmitComplaint />} />
                <Route path="complaints" element={<MyComplaints />} />
                <Route path="complaints/:id" element={<ComplaintDetails />} />
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>

              {/* Staff Portal Routes */}
              <Route path="/staff" element={<DashboardLayout />}>
                <Route index element={<StaffDashboard />} />
                <Route path="assigned" element={<AssignedComplaints />} />
                <Route path="complaints/:id" element={<StaffComplaintDetails />} />
                <Route path="attendance" element={<StaffAttendance />} />
                <Route path="profile" element={<StaffProfile />} />
              </Route>

              {/* Administrator Portal Routes */}
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="complaints" element={<AllComplaints />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="departments" element={<ManageDepartments />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="analytics" element={<ComplaintAnalytics />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="escalations" element={<EscalationReports />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AttendanceProvider>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;
