import { useState } from "react";

import { FaKey, FaLock } from "react-icons/fa";

import { changePassword } from "../../services/authApi";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ChangePassword({ user, onBack, onNavigate, onLogout }) {
  // กำหนดหน้า Profile ที่ต้องการให้ Navbar ขีดเส้นใต้
  const profilePage = {
    STUDENT: "student-profile",
    EMPLOYER: "employer-profile",
    OFFICER: "officer-profile",
  };

  // เก็บข้อมูลจากแบบฟอร์มเปลี่ยนรหัสผ่าน
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // เก็บข้อความสำเร็จ
  const [message, setMessage] = useState("");

  // เก็บข้อความ Error
  const [error, setError] = useState("");

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  // จัดการการ Submit เปลี่ยนรหัสผ่าน
  async function handleSubmit(e) {
    // ป้องกันการ Reload หน้าเว็บ
    e.preventDefault();

    // ล้างข้อความเดิม
    setMessage("");
    setError("");

    // ตรวจสอบรหัสผ่านปัจจุบัน
    if (!form.currentPassword) {
      setError("กรุณากรอกรหัสผ่านปัจจุบัน");
      return;
    }

    // ตรวจสอบรหัสผ่านใหม่
    if (!form.newPassword) {
      setError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }

    // ตรวจสอบความยาวรหัสผ่านใหม่
    if (form.newPassword.length < 6) {
      setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    // ตรวจสอบว่ารหัสผ่านใหม่ตรงกันหรือไม่
    if (form.newPassword !== form.confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      // ส่งข้อมูลเปลี่ยนรหัสผ่านไป API
      const result = await changePassword(user.userId, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      // แสดงข้อความเมื่อเปลี่ยนรหัสผ่านสำเร็จ
      setMessage(result.message);

      // ล้างข้อมูลหลังเปลี่ยนรหัสผ่านสำเร็จ
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      // แสดงข้อความเมื่อเปลี่ยนรหัสผ่านไม่สำเร็จ
      setError(err.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        user={user}
        role={user?.role || "STUDENT"}
        currentPage={profilePage[user?.role] || "home"}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* หัวข้อหน้า */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">เปลี่ยนรหัสผ่าน</h1>

          <p className="mt-2 text-neutral-600">
            เปลี่ยนรหัสผ่านสำหรับบัญชีของคุณ
          </p>
        </div>

        {/* แสดงข้อความสำเร็จ */}
        {message && (
          <p className="mx-auto mt-5 max-w-2xl rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {/* แสดงข้อความ Error */}
        {error && (
          <p className="mx-auto mt-5 max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Form สำหรับเปลี่ยนรหัสผ่าน */}
        <div className="mt-8 flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                {/* รหัสผ่านปัจจุบัน */}
                <PasswordField
                  label="รหัสผ่านปัจจุบัน"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                />

                {/* รหัสผ่านใหม่ */}
                <PasswordField
                  label="รหัสผ่านใหม่"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                />

                <p className="-mt-2 text-xs text-neutral-500">
                  รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                </p>

                {/* ยืนยันรหัสผ่านใหม่ */}
                <PasswordField
                  label="ยืนยันรหัสผ่านใหม่"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* ปุ่มดำเนินการ */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
                >
                  <FaKey />
                  เปลี่ยนรหัสผ่าน
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ช่องกรอกรหัสผ่าน
function PasswordField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <div className="flex h-14 w-full items-center gap-4 rounded-full border border-black bg-white px-7 focus-within:ring-2 focus-within:ring-primary/50">
        <span className="shrink-0 text-neutral-500">
          <FaLock />
        </span>

        <input
          type="password"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-base text-black outline-none placeholder:text-black"
        />
      </div>
    </div>
  );
}

export default ChangePassword;
