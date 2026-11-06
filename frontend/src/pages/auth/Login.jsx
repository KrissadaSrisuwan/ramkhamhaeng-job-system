import { useState } from "react";
import { FaLock, FaUser, FaBriefcase, FaGraduationCap } from "react-icons/fa";

import { loginUser } from "../../services/authApi";

// รูปภาพพื้นหลังฝั่งซ้าย
import BG_IMAGE from "../../assets/bg.jpg";

// หน้าเข้าสู่ระบบ (FR-01)
function Login({ onLoginSuccess, onGoRegister }) {
  // ข้อมูลฟอร์มเข้าสู่ระบบ
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ดำเนินการเข้าสู่ระบบ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        username: username.trim(),
        password,
      });

      onLoginSuccess(result);
    } catch (err) {
      setError(err.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ฝั่งซ้าย: รูปภาพบรรยากาศมหาวิทยาลัย */}
      <div
        className="relative hidden w-1/2 bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent flex flex-col justify-end p-12 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-amber-300 w-fit">
            <FaGraduationCap /> มหาวิทยาลัยรามคำแหง
          </div>
          <h2 className="mt-3 text-3xl font-black">
            PartTime Match
          </h2>
          <p className="mt-1 text-sm text-slate-200 leading-relaxed max-w-md">
            ศูนย์กลางจัดหางานพาร์ตไทม์สำหรับนักศึกษามหาวิทยาลัยรามคำแหง สร้างรายได้ระหว่างเรียนอย่างปลอดภัยและมั่นใจ
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: แบบฟอร์มเข้าสู่ระบบ */}
      <div className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
        <div className="w-full max-w-[380px]">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
              <FaBriefcase className="h-8 w-8 text-amber-400" />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-primary">
              เข้าสู่ระบบ
            </h1>

            <p className="mt-1 text-xs font-medium text-slate-500">
              ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง
            </p>
          </div>

          {/* ข้อความ Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm"
            >
              {error}
            </div>
          )}

          {/* ฟอร์มเข้าสู่ระบบ */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <FaUser className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  autoComplete="username"
                  required
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                รหัสผ่าน (Password)
              </label>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <FaLock className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* ลิงก์สมัครสมาชิก */}
          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-600">
            <span>ยังไม่มีบัญชีผู้ใช้งาน? </span>
            <button
              type="button"
              onClick={onGoRegister}
              className="font-bold text-primary hover:underline"
            >
              ลงทะเบียนสมัครสมาชิกใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
