import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClipboardList,
  FaUserEdit,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  searchJobs,
  getMyApplications,
  getAvailabilities,
  getStudentProfile,
} from "../../services/studentApi";
import { getMyComplaints } from "../../services/complaintApi";

// ทางลัดหลักของนักศึกษา
const SHORTCUTS = [
  {
    key: "jobs",
    title: "ค้นหางาน (Smart Match)",
    desc: "ค้นหางานพาร์ตไทม์รอบ ม.รามคำแหง และกรองตามเวลาว่าง",
    icon: <FaBriefcase className="text-2xl text-primary" />,
    badge: "แนะนำ",
  },
  {
    key: "availability",
    title: "จัดการช่วงเวลาว่าง",
    desc: "ระบุวันและเวลาที่คุณว่างทำงาน เพื่อให้ระบบจับคู่งาน",
    icon: <FaCalendarAlt className="text-2xl text-amber-600" />,
  },
  {
    key: "applications",
    title: "งานที่สมัคร",
    desc: "ติดตามสถานะการพิจารณาใบสมัครงานจากผู้ประกอบการ",
    icon: <FaClipboardList className="text-2xl text-blue-600" />,
  },
  {
    key: "complaints",
    title: "รายงานปัญหาและความปลอดภัย",
    desc: "แจ้งเหตุการณ์ไม่ปลอดภัยหรือร้องเรียนถึงเจ้าหน้าที่ ม.ร.",
    icon: <FaShieldAlt className="text-2xl text-red-600" />,
  },
  {
    key: "student-profile",
    title: "ข้อมูลส่วนตัว",
    desc: "ตรวจสอบและอัปเดตประวัติการศึกษาและช่องทางติดต่อ",
    icon: <FaUserEdit className="text-2xl text-slate-700" />,
  },
];

// หน้าหลักของนักศึกษา (Dashboard)
function StudentHome({ user, currentPage, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    openJobs: 0,
    appliedJobs: 0,
    availabilities: 0,
    complaints: 0,
  });
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลสถิติและโปรไฟล์ของนักศึกษา
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [jobsData, appsData, availData, compData, profData] =
          await Promise.allSettled([
            searchJobs(user.userId),
            getMyApplications(user.userId),
            getAvailabilities(user.userId),
            getMyComplaints(user.userId),
            getStudentProfile(user.userId),
          ]);

        setStats({
          openJobs: jobsData.status === "fulfilled" ? jobsData.value.length : 0,
          appliedJobs:
            appsData.status === "fulfilled" ? appsData.value.length : 0,
          availabilities:
            availData.status === "fulfilled" ? availData.value.length : 0,
          complaints:
            compData.status === "fulfilled" ? compData.value.length : 0,
        });

        if (profData.status === "fulfilled") {
          setProfile(profData.value);
        }
      } catch (err) {
        console.warn("ไม่สามารถโหลดข้อมูลแดชบอร์ดได้:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user.userId]);

  const studentName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.username;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="STUDENT"
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* University Official Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#11246D] to-[#0A1338] p-6 text-white shadow-lg md:p-10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              มหาวิทยาลัยรามคำแหง • Ramkhamhaeng University
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white md:text-4xl">
              ยินดีต้อนรับ, {studentName}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
              ระบบจัดหางานพาร์ตไทม์และเชื่อมโยงโอกาสการทำงานระหว่างเรียน
              {profile?.faculty ? ` • คณะ${profile.faculty}` : ""}
              {profile?.studentCode ? ` (รหัสนักศึกษา: ${profile.studentCode})` : ""}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.("jobs")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
              >
                <FaBriefcase />
                ค้นหางาน Smart Match
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.("availability")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <FaCalendarAlt />
                ตั้งค่าตารางเวลาว่าง
              </button>
            </div>
          </div>
        </section>

        {/* Quick Statistics Grid */}
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                งานที่เปิดรับสมัคร
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaBriefcase />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.openJobs}
            </p>
            <span className="text-xs text-slate-400">ตำแหน่งงานรอบ ม.ราม</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                งานที่สมัครแล้ว
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FaClipboardList />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.appliedJobs}
            </p>
            <span className="text-xs text-slate-400">อยู่ระหว่างพิจารณา/เสร็จสิ้น</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                เวลาว่างที่ตั้งไว้
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FaClock />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.availabilities}
            </p>
            <span className="text-xs text-slate-400">ช่วงเวลาพร้อมทำงาน</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                เรื่องร้องเรียน/ติดตาม
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <FaShieldAlt />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : stats.complaints}
            </p>
            <span className="text-xs text-slate-400">รายงานความปลอดภัย</span>
          </div>
        </section>

        {/* Shortcuts Section */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              บริการและเมนูด่วน
            </h2>
            <span className="text-xs text-slate-500">
              เลือกระบบที่ต้องการเข้าใช้งาน
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
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition group-hover:bg-primary/10">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-300">
                        {item.badge}
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
                  <span>เข้าสู่ระบบ</span>
                  <FaArrowRight className="text-[10px] transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* University Safety & Part-Time Guidelines Notice */}
        <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-blue-950">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="mt-0.5 text-xl text-primary shrink-0" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-sm text-primary">
                คำแนะนำและมาตรการความปลอดภัยสำหรับนักศึกษา ม.ร. (NFR-02, FR-04)
              </p>
              <ul className="mt-1.5 list-disc list-inside space-y-1 text-slate-700">
                <li>
                  ผู้ประกอบการทุกแห่งในระบบผ่านการยืนยันตัวตนและตรวจสอบเบื้องต้นจากเจ้าหน้าที่มหาวิทยาลัยแล้ว
                </li>
                <li>
                  ห้ามโอนเงินหรือชำระค่าธรรมเนียมใดๆ เพื่อสมัครงาน หากพบการเรียกเก็บเงินให้กดรายงานปัญหาทันที
                </li>
                <li>
                  ตรวจสอบวัน เวลา และสถานที่ทำงานให้ตรงกับช่วงเวลาที่สะดวก เพื่อไม่ให้กระทบต่อตารางการเรียนและการสอบ
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default StudentHome;
