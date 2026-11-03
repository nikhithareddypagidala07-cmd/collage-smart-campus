# Sanjay Ghodawat University — Smart Campus Issue Resolution & Attendance System 🎓🏛️

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A centralized, role-based digital grievance redressal and smart attendance monitoring platform engineered for **Sanjay Ghodawat University (SGU), Kolhapur**. Built with React 19, Tailwind CSS, Lucide Icons, and Recharts.

---

## 🌟 Key Highlights & Modules

### 1. 🛡️ Grievance Redressal & Issue Resolution
- **10 Campus Departments**: Academic Affairs, Hostel Administration, Campus Estate, Sanitation, Electrical Maintenance, Transport, Plumbing, Library, Food Services, and General Affairs.
- **Priority Matrix**: Low, Medium, High, and Urgent SLA deadlines.
- **Photo Evidence Upload**: Instant client-side file upload and preview.
- **Unique Tracking IDs**: Automated tracking code generation (e.g., `CMP-2026-4821`).
- **4-Stage Visual Stepper**: Real-time progress monitoring (`Submitted` → `Under Review` → `In Progress` → `Resolved`).
- **Reopen & Escalation**: Students can reopen unsatisfied issues; admins manage Dean-level escalations.

### 2. 📲 Smart QR Code Attendance with Wi-Fi Geofence
- **Dynamic 20s Rotating QR Codes**: Anti-screenshot protection with auto-refreshing security tokens.
- **Campus Wi-Fi Geofencing**: Mandatory SSID validation against authorized campus networks (`SGU-Campus-WiFi-5G`).
- **Anti-Proxy Rejection**: Scans from unauthorized external networks (e.g., personal hotspots, home broadband) are immediately blocked and logged in the audit trail.
- **Statutory 75% Compliance Tracking**: Automatic semester examination eligibility calculation with statutory red warning alerts and shortfall calculations.
- **One-Click Warning Dispatch**: Administrative dispatch of official warning notices to defaulter students.

### 3. 👥 Three Role-Based Dashboards
- **Student Dashboard**: Submit complaints, track status, view personal subject-wise attendance, scan classroom QR codes.
- **Staff / Faculty Dashboard**: Review department queue, assign technicians, update complaint progress remarks, broadcast classroom QR attendance.
- **Administrator Console**: Executive KPIs, 5 Recharts data visualizations, user management with PII phone/email data masking, and CSV audit exports.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, JavaScript (ES6+) |
| **Build Tool & Dev Server** | Vite 8 |
| **Styling & Design** | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| **Routing** | React Router DOM 7 |
| **Icons & Visuals** | Lucide React |
| **Analytics & Charts** | Recharts (Bar, Pie, Donut charts) |
| **QR Code Engine** | `qrcode.react` (SVG) |
| **State Persistence** | Browser `LocalStorage` (Decoupled schema) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open browser at:
   ```text
   http://localhost:5173
   ```
   *(Or double-click `start_server.bat` on Windows)*

---

## 🔑 Demo Access Credentials

The application includes pre-configured testing accounts with an in-app account switcher:

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Student** | `student01` | `student123` | Submit issues, track status, scan classroom QR, view attendance |
| **Staff** | `staff01` | `staff123` | Department queue, update status, generate classroom QR codes |
| **Admin** | `admin` | `admin123` | Executive analytics, department reassignment, defaulter audit |

---

## 🏛️ Institutional Customization
Customized specifically for **Sanjay Ghodawat University (SGU), Kolhapur**, Maharashtra, including:
- Official SGU campus hero photography and color palette.
- PII privacy masking for student phone numbers and email addresses.
- Statutory 75% attendance threshold per Indian academic university regulations.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
