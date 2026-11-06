import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaLock,
  FaTimes,
  FaUserCheck,
  FaUserEdit,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getMyJobs, getEmployerProfile } from "../../services/employerApi";

// ทางลัดหลักของผู้ประกอบการ
const SHORTCUTS = [
  {
    key: "manage-jobs",
    title: "จัดการประกาศงานและผู้สมัคร",
    desc: "สร้างประกาศงาน เปิด-ปิดรับสมัคร และตรวจรายชื่อนักศึกษาที่สมัคร",
    icon: <FaBriefcase className="text-2xl text-primary" />,
  },
  {
    key: "employer-profile",
    title: "ข้อมูลสถานประกอบการและยืนยันตัวตน",
    desc: "แก้ไขข้อมูลบริษัท รายละเอียดผู้ติดต่อ และตรวจสอบสถานะการอนุมัติ",
    icon: <FaBuilding className="text-2xl text-amber-600" />,
  },
  {
    key: "change-password",
    title: "เปลี่ยนรหัสผ่านและความปลอดภัย",
    desc: "ปรับปรุงรหัสผ่านเพื่อความปลอดภัยของบัญชีผู้ใช้งาน",
    icon: <FaLock className="text-2xl text-slate-600" />,
  },
];

// หน้าหลักของผู้ประกอบการ (Dashboard)
function EmployerHome({ user, currentPage, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลโปรไฟล์สถานประกอบการและงาน
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [profData, jobsData] = await Promise.allSettled([
          getEmployerProfile(user.userId),
          getMyJobs(user.userId),
        ]);

        if (profData.status === "fulfilled") {
          setProfile(profData.value);
        }
        if (jobsData.status === "fulfilled") {
          setJobs(jobsData.value || []);
        }
      } catch (err) {
        console.warn("ไม่สามารถโหลดข้อมูลผู้ประกอบการได้:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user.userId]);

  const companyName = profile?.companyName || user?.companyName || user?.username;
  const isApproved = profile?.verificationStatus === "APPROVED";
  const isPending = profile?.verificationStatus === "PENDING";
  const isRejected = profile?.verificationStatus === "REJECTED";

  const openJobsCount = jobs.filter((j) => j.status === "OPEN").length;
  const pendingJobsCount = jobs.filter((j) => j.verificationStatus === "PENDING").length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="EMPLOYER"
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Verification Status Alert Banner (FR-03, FR-04) */}
        {isApproved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
            <FaCheckCircle className="text-2xl text-emerald-600 shrink-0" />
            <div className="text-xs md:text-sm">
              <span className="font-bold">สถานะบัญชี: ได้รับการยืนยันตัวตนแล้ว (APPROVED)</span>
              <p className="mt-0.5 text-emerald-800">
                สถานประกอบการของคุณผ่านการตรวจสอบจากเจ้าหน้าที่มหาวิทยาลัยแล้ว สามารถประกาศงานและเปิดรับสมัครนักศึกษาได้ตามปกติ
              </p>
            </div>
          </div>
        )}

        {isPending && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <FaClock className="text-2xl text-amber-600 shrink-0" />
            <div className="text-xs md:text-sm">
              <span className="font-bold">สถานะบัญชี: อยู่ระหว่างรอการตรวจสอบ (PENDING)</span>
              <p className="mt-0.5 text-amber-800">
                ข้อมูลสถานประกอบการของคุณกำลังรอการตรวจสอบเอกสารจากเจ้าหน้าที่มหาวิทยาลัยรามคำแหง เพื่อความปลอดภัยของนักศึกษา ระบบจะเปิดให้ประกาศงานได้ทันทีหลังได้รับการอนุมัติ
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-900 shadow-sm">
            <FaExclamationTriangle className="text-2xl text-red-600 shrink-0" />
            <div className="text-xs md:text-sm">
              <span className="font-bold">สถานะบัญชี: ไม่ผ่านการอนุมัติ (REJECTED)</span>
              <p className="mt-0.5 text-red-800">
                เอกสารหรือข้อมูลสถานประกอบการไม่ผ่านเกณฑ์การตรวจสอบ กรุณาตรวจสอบข้อมูลในหน้า &quot;ข้อมูลส่วนตัว&quot; หรือติดต่อเจ้าหน้าที่มหาวิทยาลัย
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#11246D] to-[#0A1338] p-6 text-white shadow-lg md:p-10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
              ศูนย์บริการผู้ประกอบการ • มหาวิทยาลัยรามคำแหง
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white md:text-4xl">
              ยินดีต้อนรับ, {companyName}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
              ระบบประกาศงานพาร์ตไทม์และคัดเลือกนักศึกษามหาวิทยาลัยรามคำแหงที่มีคุณภาพและตรงกับเวลาทำงาน
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.("manage-jobs")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
              >
                <FaBriefcase />
                จัดการประกาศงาน
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.("employer-profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <FaBuilding />
                ดูข้อมูลบริษัท
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ประกาศงานทั้งหมด
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaBriefcase />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : jobs.length}
            </p>
            <span className="text-xs text-slate-400">ตำแหน่งงานที่เคยสร้าง</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                กำลังเปิดรับสมัคร
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FaCheckCircle />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : openJobsCount}
            </p>
            <span className="text-xs text-slate-400">นักศึกษาสามารถสมัครได้ทันที</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                งานรอเจ้าหน้าที่อนุมัติ
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FaClock />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : pendingJobsCount}
            </p>
            <span className="text-xs text-slate-400">รอการตรวจสอบความปลอดภัย</span>
          </div>
        </section>

        {/* Shortcuts Section */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              เมนูการจัดการ
            </h2>
            <span className="text-xs text-slate-500">
              เลือกฟังก์ชันการทำงาน
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHORTCUTS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate?.(item.key)}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition group-hover:bg-primary/10">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>เข้าสู่เมนู</span>
                  <FaArrowRight className="text-[10px] transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default EmployerHome;
