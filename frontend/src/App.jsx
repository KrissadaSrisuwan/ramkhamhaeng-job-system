import { useState } from "react";

// ==========================================
// AUTH
// ==========================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePassword from "./pages/auth/ChangePassword";

// ==========================================
// STUDENT
// ==========================================

import StudentHome from "./pages/student/StudentHome";
import StudentProfile from "./pages/student/StudentProfile";
import StudentAvailability from "./pages/student/StudentAvailability";
import StudentJobs from "./pages/student/StudentJobs";
import StudentJobDetail from "./pages/student/StudentJobDetail";
import StudentApplications from "./pages/student/StudentApplications";
import StudentComplaints from "./pages/student/StudentComplaints";

// ==========================================
// EMPLOYER
// ==========================================

import EmployerHome from "./pages/employer/EmployerHome";
import EmployerProfile from "./pages/employer/EmployerProfile";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerApplications from "./pages/employer/EmployerApplications";

// ==========================================
// OFFICER
// ==========================================

import OfficerHome from "./pages/officer/OfficerHome";
import OfficerProfile from "./pages/officer/OfficerProfile";
import CategoryManagement from "./pages/officer/CategoryManagement";
import EmployerVerification from "./pages/officer/EmployerVerification";
import JobVerification from "./pages/officer/JobVerification";
import OfficerComplaints from "./pages/officer/OfficerComplaints";

// คอมโพเนนต์หลักในการจัดการเส้นทางและสิทธิ์ผู้ใช้งาน (FR-01)
function App() {
  // เก็บข้อมูลผู้ใช้งานจาก LocalStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  // เก็บหน้าจอที่กำลังแสดงผล
  const [page, setPage] = useState(user ? "home" : "login");

  // เก็บ Job ID ที่เลือกสำหรับดูรายละเอียดหรือสมัคร
  const [selectedJobId, setSelectedJobId] = useState(null);

  // เก็บ Job ID สำหรับส่งเรื่องร้องเรียนที่เกี่ยวข้อง (FR-04)
  const [complaintJobId, setComplaintJobId] = useState(null);

  // เข้าสู่ระบบสำเร็จ
  function handleLoginSuccess(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setPage("home");
  }

  // อัปเดตข้อมูลผู้ใช้หลังแก้ไขโปรไฟล์
  function handleProfileUpdate(updatedData) {
    const updatedUser = {
      ...user,
      ...updatedData,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  // ออกจากระบบ
  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    setSelectedJobId(null);
    setComplaintJobId(null);
    setPage("login");
  }

  // นำทางกลับหน้าแรก
  function goHome() {
    setPage("home");
  }

  // นำทางไปยังหน้าที่กำหนดพร้อมส่งพารามิเตอร์เสริม
  function handleNavigate(targetPage, params) {
    if (params?.jobId) {
      setComplaintJobId(params.jobId);
    } else if (targetPage !== "complaints") {
      setComplaintJobId(null);
    }
    setPage(targetPage);
  }

  // ==========================================
  // AUTHENTICATION PAGES (ยังไม่เข้าสู่ระบบ)
  // ==========================================

  if (!user) {
    if (page === "register") {
      return <Register onGoLogin={() => setPage("login")} />;
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onGoRegister={() => setPage("register")}
      />
    );
  }

  // ==========================================
  // STUDENT PORTAL (สิทธิ์นักศึกษา)
  // ==========================================

  if (user.role === "STUDENT") {
    // ข้อมูลส่วนตัว
    if (page === "student-profile") {
      return (
        <StudentProfile
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onUserUpdate={handleProfileUpdate}
        />
      );
    }

    // เปลี่ยนรหัสผ่าน
    if (page === "change-password") {
      return (
        <ChangePassword
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // จัดการช่วงเวลาว่าง (FR-02)
    if (page === "availability") {
      return (
        <StudentAvailability
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // ค้นหางานพาร์ตไทม์ (FR-02, NFR-01)
    if (page === "jobs") {
      return (
        <StudentJobs
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onSelectJob={(jobId) => {
            setSelectedJobId(jobId);
            setPage("job-detail");
          }}
        />
      );
    }

    // รายละเอียดงาน (FR-02, FR-03, FR-04)
    if (page === "job-detail") {
      return (
        <StudentJobDetail
          user={user}
          currentPage={page}
          jobId={selectedJobId}
          onLogout={handleLogout}
          onBack={() => setPage("jobs")}
          onNavigate={handleNavigate}
        />
      );
    }

    // รายการงานที่สมัคร (FR-03)
    if (page === "applications") {
      return (
        <StudentApplications
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // รายงานปัญหาและความปลอดภัย (FR-04)
    if (page === "complaints") {
      return (
        <StudentComplaints
          user={user}
          currentPage={page}
          initialJobId={complaintJobId}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // หน้าหลักนักศึกษา
    return (
      <StudentHome
        user={user}
        currentPage={page}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // ==========================================
  // EMPLOYER PORTAL (สิทธิ์ผู้ประกอบการ)
  // ==========================================

  if (user.role === "EMPLOYER") {
    // ข้อมูลบริษัท / สถานประกอบการ
    if (page === "employer-profile") {
      return (
        <EmployerProfile
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onUserUpdate={handleProfileUpdate}
        />
      );
    }

    // เปลี่ยนรหัสผ่าน
    if (page === "change-password") {
      return (
        <ChangePassword
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // จัดการประกาศงาน (FR-03)
    if (page === "manage-jobs") {
      return (
        <EmployerJobs
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onViewApplicants={(jobId) => {
            setSelectedJobId(jobId);
            setPage("employer-applications");
          }}
        />
      );
    }

    // รายชื่อผู้สมัครงาน (FR-03)
    if (page === "employer-applications") {
      return (
        <EmployerApplications
          user={user}
          currentPage={page}
          jobId={selectedJobId}
          onLogout={handleLogout}
          onBack={() => setPage("manage-jobs")}
          onNavigate={handleNavigate}
        />
      );
    }

    // หน้าหลักผู้ประกอบการ
    return (
      <EmployerHome
        user={user}
        currentPage={page}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // ==========================================
  // OFFICER PORTAL (สิทธิ์เจ้าหน้าที่)
  // ==========================================

  if (user.role === "OFFICER") {
    // ข้อมูลส่วนตัวเจ้าหน้าที่
    if (page === "officer-profile") {
      return (
        <OfficerProfile
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onUserUpdate={handleProfileUpdate}
        />
      );
    }

    // เปลี่ยนรหัสผ่าน
    if (page === "change-password") {
      return (
        <ChangePassword
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // จัดการหมวดหมู่งาน
    if (page === "categories") {
      return (
        <CategoryManagement
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // ตรวจสอบและอนุมัติผู้ประกอบการ (FR-03, FR-04)
    if (page === "verify-employers") {
      return (
        <EmployerVerification
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // ตรวจสอบประกาศงาน (FR-03, FR-04)
    if (page === "verify-jobs") {
      return (
        <JobVerification
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // ตรวจสอบและจัดการเรื่องร้องเรียน (FR-04)
    if (page === "complaints") {
      return (
        <OfficerComplaints
          user={user}
          currentPage={page}
          onBack={goHome}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    }

    // หน้าหลักเจ้าหน้าที่
    return (
      <OfficerHome
        user={user}
        currentPage={page}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // กรณีไม่พบบทบาทที่ถูกต้อง
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-md">
        <h2 className="text-xl font-bold text-slate-900">
          ไม่พบประเภทผู้ใช้งานที่ถูกต้องในระบบ
        </h2>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-xl bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-primary-dark"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}

export default App;
