import { useEffect, useState } from "react";
import { FaBriefcase, FaBars, FaTimes } from "react-icons/fa";

import { getStudentProfile } from "../services/studentApi";
import { getEmployerProfile } from "../services/employerApi";
import { getOfficerProfile } from "../services/officerApi";

// เมนูนำทางตามสิทธิ์ผู้ใช้งาน (FR-01, FR-04)
const MENUS = {
  STUDENT: {
    label: "นักศึกษา",
    items: [
      { key: "home", label: "หน้าหลัก" },
      { key: "availability", label: "จัดการช่วงเวลาว่าง" },
      { key: "jobs", label: "ค้นหางาน" },
      { key: "applications", label: "งานที่สมัคร" },
      { key: "complaints", label: "รายงานปัญหา / ปลอดภัย" },
      { key: "student-profile", label: "ข้อมูลส่วนตัว" },
    ],
  },

  EMPLOYER: {
    label: "ผู้ประกอบการ",
    items: [
      { key: "home", label: "หน้าหลัก" },
      { key: "manage-jobs", label: "จัดการงาน" },
      { key: "employer-profile", label: "ข้อมูลบริษัท / ยืนยันตัวตน" },
    ],
  },

  OFFICER: {
    label: "เจ้าหน้าที่",
    items: [
      { key: "home", label: "หน้าหลัก" },
      { key: "verify-employers", label: "ตรวจสอบผู้ประกอบการ" },
      { key: "verify-jobs", label: "ตรวจสอบงาน" },
      { key: "complaints", label: "เรื่องร้องเรียน" },
      { key: "categories", label: "จัดการหมวดหมู่" },
      { key: "officer-profile", label: "ข้อมูลส่วนตัว" },
    ],
  },
};

// แถบเมนูด้านบนของระบบ (Navbar)
function Navbar({
  user,
  role = "STUDENT",
  currentPage = "home",
  onNavigate,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const menu = MENUS[role] ?? MENUS.STUDENT;

  // โหลดรูปโปรไฟล์ของผู้ใช้ตามบทบาท
  useEffect(() => {
    async function loadProfileImage() {
      if (!user?.userId) return;

      try {
        let data;
        if (role === "STUDENT") {
          data = await getStudentProfile(user.userId);
        } else if (role === "EMPLOYER") {
          data = await getEmployerProfile(user.userId);
        } else if (role === "OFFICER") {
          data = await getOfficerProfile(user.userId);
        }

        if (data?.profileImage) {
          const imageUrl = data.profileImage.startsWith("http")
            ? data.profileImage
            : `http://localhost:8080${data.profileImage}`;
          setProfileImage(imageUrl);
        } else {
          setProfileImage("");
        }
      } catch (error) {
        setProfileImage("");
      }
    }

    loadProfileImage();
  }, [user?.userId, role]);

  // เปลี่ยนหน้าและปิดเมนูมือถือ
  const go = (key) => {
    setOpen(false);
    onNavigate?.(key);
  };

  // ตรวจสอบสถานะเมนูปัจจุบัน
  const isActiveMenu = (itemKey) => {
    if (currentPage === "job-detail" && itemKey === "jobs") {
      return true;
    }
    return currentPage === itemKey;
  };

  // ตัวอักษรย่อสำหรับอวตารเมื่อไม่มีรูป
  const getInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (role === "STUDENT") return "S";
    if (role === "EMPLOYER") return "E";
    return "O";
  };

  const rolePill = (
    <div className="flex items-center rounded-full border border-white/20 bg-white/10 p-1 shadow-inner backdrop-blur-md">
      <span className="whitespace-nowrap py-1 pl-3.5 pr-2.5 text-xs font-semibold text-white md:text-xs">
        {menu.label}
      </span>
      <button
        type="button"
        onClick={onLogout}
        className="whitespace-nowrap rounded-full bg-amber-500 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
      >
        ออกจากระบบ
      </button>
    </div>
  );

  const avatar = (
    <button
      type="button"
      onClick={() => {
        if (role === "STUDENT") go("student-profile");
        else if (role === "EMPLOYER") go("employer-profile");
        else if (role === "OFFICER") go("officer-profile");
      }}
      aria-label="ข้อมูลส่วนตัว"
      className="group relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/30 bg-white/10 transition hover:scale-105 hover:border-amber-400"
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt="รูปโปรไฟล์"
          className="h-full w-full object-cover"
          onError={() => setProfileImage("")}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary-light text-sm font-bold text-white">
          {getInitial()}
        </div>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-dark text-white shadow-md backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
        {/* โลโก้และชื่อระบบ */}
        <button
          type="button"
          onClick={() => go("home")}
          className="group flex items-center gap-3 text-left transition active:scale-95"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-slate-950 shadow-md transition group-hover:bg-amber-400">
            <FaBriefcase size={20} />
          </div>

          <div>
            <span className="block text-xl font-extrabold tracking-tight text-white md:text-2xl">
              PartTime Match
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-300">
              มหาวิทยาลัยรามคำแหง
            </span>
          </div>
        </button>

        {/* เมนูสำหรับจอขนาดใหญ่ */}
        <nav className="hidden items-center gap-6 lg:flex">
          {menu.items.map((item) => {
            const active = isActiveMenu(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.key)}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap px-1 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "font-bold text-amber-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}

          <div className="mx-1 h-6 w-px bg-white/20" />

          {avatar}
          {rolePill}
        </nav>

        {/* ปุ่มเมนูสำหรับหน้าจอมือถือ */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="เปิดเมนู"
          aria-expanded={open}
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10 lg:hidden"
        >
          {open ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* เมนูย่อยสำหรับหน้าจอมือถือ */}
      {open && (
        <nav className="absolute left-0 top-full flex w-full flex-col gap-2 border-b border-white/10 bg-slate-950/95 px-6 py-6 shadow-2xl backdrop-blur-xl lg:hidden">
          {menu.items.map((item) => {
            const active = isActiveMenu(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.key)}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                  active
                    ? "border border-amber-400/40 bg-amber-400/10 text-amber-300"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}

          <div className="my-2 h-px bg-white/10" />

          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              {avatar}
              <div className="text-sm font-medium text-white/90">
                บัญชีของฉัน
              </div>
            </div>
            {rolePill}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
