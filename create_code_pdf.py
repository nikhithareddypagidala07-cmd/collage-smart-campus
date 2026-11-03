import os
import sys
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Preformatted, HRFlowable
)
from reportlab.pdfgen import canvas

BASE_DIR = r"C:\Users\Nikhitha Reddy\.gemini\antigravity\scratch\smart-campus-resolution"
OUTPUT_PDF = os.path.join(BASE_DIR, "SGU_Smart_Campus_Complete_Source_Code.pdf")

FILES_TO_INCLUDE = [
    # 1. Project Configuration
    ("Configuration", "package.json", "Project dependencies and build scripts"),
    ("Configuration", "tailwind.config.js", "Tailwind CSS theme, campus colors & typography"),
    ("Configuration", "index.html", "HTML entry point with Inter font & SGU branding"),
    ("Configuration", "start_server.bat", "One-click local server launcher"),

    # 2. Application Core & Routing
    ("Core", "src/main.jsx", "React DOM application root mount"),
    ("Core", "src/App.jsx", "Main application routing, layout providers & role guards"),
    ("Core", "src/index.css", "Tailwind CSS directives, custom scrollbars & print rules"),
    ("Core", "src/utils/helpers.js", "Utility helpers: Tracking IDs, SLA overdue check & date formatting"),

    # 3. State Management & Context Providers
    ("Context", "src/context/AuthContext.jsx", "Authentication, user profiles, PII masking & role switching"),
    ("Context", "src/context/ComplaintContext.jsx", "Grievance submission, lifecycle state machine & SLA escalation"),
    ("Context", "src/context/AttendanceContext.jsx", "Lecture attendance, QR sessions, Wi-Fi verification & defaulter detection"),

    # 4. Mock Database & Configurations
    ("Data", "src/data/mockData.js", "Departments, categories, faculty, students & initial complaints"),
    ("Data", "src/data/attendanceMockData.js", "SGU engineering curricula, attendance metrics & Wi-Fi config"),

    # 5. Layout Components
    ("Layout", "src/components/layout/PublicLayout.jsx", "Public header, SGU helpline banner & institutional footer"),
    ("Layout", "src/components/layout/DashboardLayout.jsx", "Authenticated layout wrapping Sidebar, Navbar & ToastContainer"),

    # 6. Common UI Components
    ("Components", "src/components/common/Navbar.jsx", "Top campus navigation, notification drawer & user profile"),
    ("Components", "src/components/common/Sidebar.jsx", "Role-based navigation menu with live badge counters"),
    ("Components", "src/components/common/StatusBadge.jsx", "Color-coded grievance lifecycle badges"),
    ("Components", "src/components/common/PriorityBadge.jsx", "Priority badges: Low, Medium, High, Urgent"),
    ("Components", "src/components/common/CategoryIcon.jsx", "Dynamic Lucide icon mapper for campus departments"),
    ("Components", "src/components/common/Timeline.jsx", "4-Stage visual resolution stepper & audit trail history"),
    ("Components", "src/components/common/StatCard.jsx", "Executive KPI summary metric card"),
    ("Components", "src/components/common/ToastContainer.jsx", "Floating visual feedback notifications"),
    ("Components", "src/components/common/Modal.jsx", "Accessible modal dialog with ESC key handler"),

    # 7. QR Attendance & Wi-Fi Geofence Components
    ("Attendance", "src/components/attendance/ClassroomQrModal.jsx", "Faculty live 20s rotating QR code projector with Wi-Fi geofence"),
    ("Attendance", "src/components/attendance/StudentQrScannerModal.jsx", "Student QR scanner with classroom Wi-Fi inspector & proxy blocker"),

    # 8. Public Pages
    ("Pages: Public", "src/pages/public/LandingPage.jsx", "SGU public landing page with features & quick access"),
    ("Pages: Public", "src/pages/public/AboutPage.jsx", "Institutional grievance cell details & university overview"),
    ("Pages: Public", "src/pages/public/HowItWorksPage.jsx", "End-to-end 4-step issue resolution explanation"),
    ("Pages: Public", "src/pages/public/ContactPage.jsx", "Campus support contacts, emergency desk & SGU address"),
    ("Pages: Public", "src/pages/public/LoginPage.jsx", "SGU Single Sign-On (SSO) login with credential helper"),

    # 9. Student Portal Pages
    ("Pages: Student", "src/pages/student/StudentDashboard.jsx", "Student workbench: quick stats, recent complaints & actions"),
    ("Pages: Student", "src/pages/student/SubmitComplaint.jsx", "Lodge grievance with photo upload preview & tracking ID"),
    ("Pages: Student", "src/pages/student/MyComplaints.jsx", "Student complaint directory with search & status filters"),
    ("Pages: Student", "src/pages/student/ComplaintDetails.jsx", "Detailed complaint view, visual stepper & reopen action"),
    ("Pages: Student", "src/pages/student/StudentAttendance.jsx", "My Attendance: subject breakdown, 75% warning & QR scanner"),
    ("Pages: Student", "src/pages/student/NotificationsPage.jsx", "Personal notification feed with mark-read actions"),
    ("Pages: Student", "src/pages/student/StudentProfile.jsx", "Student academic profile and department details"),

    # 10. Staff Portal Pages
    ("Pages: Staff", "src/pages/staff/StaffDashboard.jsx", "Departmental staff overview & SLA turnaround metrics"),
    ("Pages: Staff", "src/pages/staff/AssignedComplaints.jsx", "Department queue with evidence review & status transitions"),
    ("Pages: Staff", "src/pages/staff/StaffComplaintDetails.jsx", "Staff resolution workbench, technician assignment & remarks"),
    ("Pages: Staff", "src/pages/staff/StaffAttendance.jsx", "Lecture attendance marker with QR broadcast projector"),
    ("Pages: Staff", "src/pages/staff/StaffProfile.jsx", "Staff employee credentials & assigned department info"),

    # 11. Administrator Portal Pages
    ("Pages: Admin", "src/pages/admin/AdminDashboard.jsx", "Executive overview, 6 KPIs & Recharts analytics"),
    ("Pages: Admin", "src/pages/admin/AllComplaints.jsx", "University-wide grievance directory with department reassignment"),
    ("Pages: Admin", "src/pages/admin/ManageUsers.jsx", "User management: students, faculty, staff & admin with PII mask"),
    ("Pages: Admin", "src/pages/admin/ManageDepartments.jsx", "Manage 10 campus departments, heads & workload monitoring"),
    ("Pages: Admin", "src/pages/admin/ManageCategories.jsx", "Manage complaint categories, department mappings & SLA hours"),
    ("Pages: Admin", "src/pages/admin/ComplaintAnalytics.jsx", "Deep analytics: 5 Recharts graphs & trend visualizations"),
    ("Pages: Admin", "src/pages/admin/AdminAttendance.jsx", "Attendance compliance center, defaulters table & Wi-Fi audit logs"),
    ("Pages: Admin", "src/pages/admin/EscalationReports.jsx", "Dean escalation center for SLA breached & critical complaints"),
]

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Suppress headers/footers on cover page

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1e293b"))
        self.drawString(54, 755, "SANJAY GHODAWAT UNIVERSITY (SGU), KOLHAPUR")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawRightString(558, 755, "Smart Campus Source Code Documentation")

        # Top border rule
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6)
        self.line(54, 747, 558, 747)

        # Bottom border rule
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Smart Campus Issue Resolution & Attendance Management System")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_str)
        self.restoreState()

def wrap_code_lines_with_numbers(code_text, max_len=84):
    lines = code_text.splitlines()
    total_lines = len(lines)
    num_width = max(len(str(total_lines)), 2)
    
    formatted_lines = []
    for idx, line in enumerate(lines, 1):
        line = line.replace('\t', '  ')
        prefix = f"{idx:>{num_width}} | "
        indent = " " * len(prefix)
        
        if len(line) <= max_len:
            formatted_lines.append(f"{prefix}{line}")
        else:
            first_chunk = line[:max_len]
            formatted_lines.append(f"{prefix}{first_chunk}")
            remainder = line[max_len:]
            while len(remainder) > max_len:
                formatted_lines.append(f"{indent}{remainder[:max_len]}")
                remainder = remainder[max_len:]
            if remainder:
                formatted_lines.append(f"{indent}{remainder}")
    return "\n".join(formatted_lines)

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    cover_title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=23,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        alignment=1
    )

    cover_subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#2563eb'),
        alignment=1
    )

    cover_meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'FileH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor('#1e40af'),
        spaceBefore=10,
        spaceAfter=2
    )

    desc_style = ParagraphStyle(
        'FileDesc',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        fontName='Courier',
        fontSize=6.5,
        leading=8.2,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f8fafc'),
        borderColor=colors.HexColor('#cbd5e1'),
        borderWidth=0.5,
        borderPadding=5,
        spaceAfter=12
    )

    story = []

    # ================= COVER PAGE =================
    story.append(Spacer(1, 35))
    
    # Institution Badge
    badge_data = [[
        Paragraph("<font size='10' color='#1d4ed8'><b>SANJAY GHODAWAT UNIVERSITY, KOLHAPUR</b></font><br/><font size='8' color='#64748b'>Established under Maharashtra Act No. XL of 2017 | Approved by UGC</font>", cover_meta_style)
    ]]
    badge_table = Table(badge_data, colWidths=[500])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#eff6ff')),
        ('BORDER', (0, 0), (-1, -1), 1, colors.HexColor('#bfdbfe')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 30))

    story.append(Paragraph("SMART CAMPUS ISSUE RESOLUTION &<br/>ATTENDANCE MANAGEMENT SYSTEM", cover_title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Complete Technical Source Code & Architecture Documentation", cover_subtitle_style))
    story.append(Spacer(1, 18))

    # Features Overview Box
    features_html = """
    <b>System Modules & Core Capabilities:</b><br/>
    • <b>Role-Based Dashboards:</b> Independent portals for Students, Departmental Staff, and University Administration.<br/>
    • <b>Grievance Redressal Engine:</b> 10 campus departments, 4 priority levels, image upload evidence, real-time 4-stage stepper.<br/>
    • <b>Classroom Attendance Management:</b> Course & subject marker, 75% statutory exam debarment warnings, shortfall calculator.<br/>
    • <b>Smart QR Code Attendance with Wi-Fi Geofence:</b> 20s rotating dynamic token, campus Wi-Fi verification (SSID: <code>SGU-Campus-WiFi-5G</code>), anti-proxy rejection.<br/>
    • <b>Executive Analytics & Compliance:</b> 5 Recharts visualizations, user management with PII data masking, automated warning dispatches, CSV export.<br/>
    • <b>Modern Frontend Stack:</b> React 19, Tailwind CSS 3.4, Lucide Icons, Recharts, LocalStorage dual persistence.
    """
    feat_data = [[Paragraph(features_html, ParagraphStyle('Feat', parent=styles['Normal'], fontSize=8.5, leading=13.5, textColor=colors.HexColor('#1e293b')))]]
    feat_table = Table(feat_data, colWidths=[500])
    feat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BORDER', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(feat_table)
    story.append(Spacer(1, 28))

    # Metadata Footer Table
    meta_data = [
        [Paragraph("<b>Document Type:</b> Full Source Code Appendix", cover_meta_style),
         Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", cover_meta_style)],
        [Paragraph("<b>Academic Year:</b> 2026 - 2027", cover_meta_style),
         Paragraph("<b>Total Files Documented:</b> 51 Components", cover_meta_style)],
        [Paragraph("<b>Status:</b> Production Ready & Verified", cover_meta_style),
         Paragraph("<b>Local Server:</b> http://localhost:5173", cover_meta_style)]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor('#f1f5f9')),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # ================= TABLE OF CONTENTS =================
    story.append(Paragraph("TABLE OF CONTENTS", h1_style))
    story.append(Paragraph("Complete Index of All 51 Source Code Files Across Modules", desc_style))
    story.append(Spacer(1, 6))

    toc_data = [["#", "Category", "File Relative Path", "Description"]]
    for idx, (cat, rel_path, desc) in enumerate(FILES_TO_INCLUDE, 1):
        toc_data.append([
            str(idx),
            cat,
            rel_path,
            desc
        ])

    toc_table = Table(toc_data, colWidths=[22, 75, 175, 228])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.2),
        ('LEADING', (0, 0), (-1, -1), 9.2),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # ================= SOURCE CODE LISTINGS =================
    current_category = None

    for idx, (category, rel_path, desc) in enumerate(FILES_TO_INCLUDE, 1):
        full_path = os.path.join(BASE_DIR, rel_path)
        
        if not os.path.exists(full_path):
            print(f"Warning: File not found: {full_path}")
            continue

        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
            code_text = f.read()

        line_count = len(code_text.splitlines())
        file_size_kb = round(os.path.getsize(full_path) / 1024, 1)

        # Category Divider
        if category != current_category:
            current_category = category
            cat_header = Paragraph(f"SECTION: {current_category.upper()}", h1_style)
            story.append(cat_header)
            story.append(Spacer(1, 4))

        # File Card Header
        file_title = f"{idx}. {rel_path}"
        story.append(Paragraph(file_title, h2_style))
        story.append(Paragraph(f"<b>Module:</b> {category} | <b>Lines:</b> {line_count} | <b>Size:</b> {file_size_kb} KB — {desc}", desc_style))

        # Format Code Listing with line numbers and character wrapping
        formatted_code = wrap_code_lines_with_numbers(code_text, max_len=84)
        code_flowable = Preformatted(formatted_code, code_style)
        story.append(code_flowable)
        story.append(Spacer(1, 10))

    print(f"Building PDF document...")
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built at: {OUTPUT_PDF}")

if __name__ == "__main__":
    build_pdf()
