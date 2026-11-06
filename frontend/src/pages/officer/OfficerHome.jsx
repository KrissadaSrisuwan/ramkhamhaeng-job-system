import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaTags,
  FaUserCheck,
  FaUserEdit,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getEmployersByStatus,
  getOfficerJobsByStatus,
  getCategories,
  getOfficerProfile,
} from "../../services/officerApi";
import { getComplaintsByStatus } from "../../services/complaintApi";

// ทางลัดหลักของเจ้าหน้าที่
const SHORTCUTS = [
  {
    key: "verify-employers",
    title: "ตรวจสอบและอนุมัติผู้ประกอบการ",
    desc: "ตรวจสอบเอกสารยืนยันตัวตนของผู้ประกอบการก่อนอนุญาตให้ประกาศงาน",
    icon: <FaBuilding className="text-2xl text-amber-600" />,
    badgeKey: "pendingEmployers",
  },
  {
    key: "verify-jobs",
    title: "ตรวจสอบประกาศงานพาร์ตไทม์",
    desc: "ตรวจสอบความเหมาะสมของค่าตอบแทนและเงื่อนไขการทำงานของงานใหม่",
    icon: <FaBriefcase className="text-2xl text-blue-600" />,
    badgeKey: "pendingJobs",
  },
  {
    key: "complaints",
    title: "จัดการเรื่องร้องเรียนและความปลอดภัย",
    desc: "ติดตามรายงานปัญหา เหตุการณ์ไม่ปลอดภัย และข้อพิพาทจากนักศึกษา",
    icon: <FaShieldAlt className="text-2xl text-red-600" />,
    badgeKey: "pendingComplaints",
  },
  {
    key: "categories",
    title: "จัดการหมวดหมู่งาน",
    desc: "เพิ่ม แก้ไข หรือระงับหมวดหมู่งานพาร์ตไทม์ในระบบ",
    icon: <FaTags className="text-2xl text-emerald-600" />,
    badgeKey: "categoriesCount",
  },
  {
    key: "officer-profile",
    title: "ข้อมูลส่วนตัวเจ้าหน้าที่",
    desc: "ตรวจสอบและแก้ไขข้อมูลโปรไฟล์เจ้าหน้าที่มหาวิทยาลัย",
    icon: <FaUserEdit className="text-2xl text-slate-700" />,
  },
];

// หน้าหลักของเจ้าหน้าที่มหาวิทยาลัย (Admin Cockpit)
function OfficerHome({ user, currentPage, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    pendingEmployers: 0,
    pendingJobs: 0,
    pendingComplaints: 0,
    categoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const officerUserId = user.userId;

  // โหลดข้อมูลสถิติสำหรับเจ้าหน้าที่
  useEffect(() => {
    async function loadOfficerStats() {
      try {
        setLoading(true);
        const [empData, jobData, compData, catData, profData] =
          await Promise.allSettled([
            getEmployersByStatus(officerUserId, "PENDING"),
            getOfficerJobsByStatus(officerUserId, "PENDING"),
            getComplaintsByStatus(officerUserId, "PENDING"),
            getCategories(),
            getOfficerProfile(officerUserId),
          ]);

        setStats({
          pendingEmployers: empData.status === "fulfilled" ? empData.value.length : 0,
          pendingJobs: jobData.status === "fulfilled" ? jobData.value.length : 0,
          pendingComplaints: compData.status === "fulfilled" ? compData.value.length : 0,
          categoriesCount: catData.status === "fulfilled" ? catData.value.length : 0,
        });

        if (profData.status === "fulfilled") {
          setProfile(profData.value);
        }
      } catch (err) {
        console.warn("ไม่สามารถโหลดข้อมูลสถิติเจ้าหน้าที่ได้:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOfficerStats();
  }, [officerUserId]);

  const officerName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.firstName || user?.username;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="OFFICER"
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Officer Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#11246D] to-[#0A1338] p-6 text-white shadow-lg md:p-10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
              ศูนย์กำกับดูแลและบริหารระบบ • มหาวิทยาลัยรามคำแหง
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white md:text-4xl">
              ยินดีต้อนรับเจ้าหน้าที่, {officerName}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
              แผงควบคุมการตรวจสอบความถูกต้องของผู้ประกอบการ คัดกรองประกาศงาน และดูแลความปลอดภัยของนักศึกษา
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.("verify-employers")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
              >
                <FaUserCheck />
                ตรวจสอบผู้ประกอบการ ({stats.pendingEmployers})
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.("complaints")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <FaShieldAlt />
                เรื่องร้องเรียน ({stats.pendingComplaints})
              </button>
            </div>
          </div>
        </section>

        {/* Action Needed Stats Grid */}
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ผู้ประกอบการรออนุมัติ
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FaBuilding />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-amber-600">
              {loading ? "..." : stats.pendingEmployers}
            </p>
            <span className="text-xs text-slate-400">รอการตรวจสอบเอกสาร</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                งานใหม่รอตรวจสอบ
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FaBriefcase />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-blue-600">
              {loading ? "..." : stats.pendingJobs}
            </p>
            <span className="text-xs text-slate-400">รอเปิดรับสมัคร</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                เรื่องร้องเรียนใหม่
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <FaShieldAlt />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-red-600">
              {loading ? "..." : stats.pendingComplaints}
            </p>
            <span className="text-xs text-slate-400">รอการตรวจสอบข้อเท็จจริง</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                หมวดหมู่งานทั้งหมด
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FaTags />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.categoriesCount}
            </p>
            <span className="text-xs text-slate-400">หมวดหมู่เปิดใช้งาน</span>
          </div>
        </section>

        {/* Shortcuts Section */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              ภารกิจและเมนูการตรวจสอบ
            </h2>
            <span className="text-xs text-slate-500">
              ระบบกำกับดูแลความปลอดภัย (NFR-02, FR-04)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHORTCUTS.map((item) => {
              const pendingCount = item.badgeKey ? stats[item.badgeKey] : null;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate?.(item.key)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition group-hover:bg-primary/10">
                        {item.icon}
                      </div>

                      {pendingCount !== null && pendingCount > 0 && (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800 border border-red-300 animate-pulse">
                          รอ {pendingCount} รายการ
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span>เปิดหน้ารายการ</span>
                    <FaArrowRight className="text-[10px] transition group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default OfficerHome;
