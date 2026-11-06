import { useState } from "react";
import {
  FaBook,
  FaBuilding,
  FaCalendarAlt,
  FaEnvelope,
  FaFileAlt,
  FaGraduationCap,
  FaIdCard,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

import { registerUser } from "../../services/authApi";
import BG_IMAGE from "../../assets/bg.jpg";

// สไตล์ช่องกรอกข้อมูล
const fieldClass =
  "flex h-12 w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";

// คอมโพเนนต์ช่องกรอกข้อความ
function Field({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
}) {
  return (
    <div className={fieldClass}>
      <span className="text-slate-400 text-sm">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        required={required}
        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

// ส่วนหัวข้อของกลุ่มข้อมูล
function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

// หน้าสมัครสมาชิกแยกระหว่างนักศึกษาและผู้ประกอบการ (FR-01)
function Register({ onGoLogin }) {
  const [role, setRole] = useState("STUDENT");

  const emptyForm = {
    username: "",
    password: "",
    studentCode: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    faculty: "",
    major: "",
    yearOfStudy: "",
    companyName: "",
    contactName: "",
    address: "",
    companyDescription: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // อัปเดตข้อมูลฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ตรวจสอบความถูกต้องและส่งคำขอสมัครสมาชิก
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username.trim() || !form.password) {
      setError("กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน");
      return;
    }

    if (role === "STUDENT") {
      if (!form.studentCode.trim() || !form.firstName.trim() || !form.lastName.trim()) {
        setError("กรุณากรอกรหัสนักศึกษา ชื่อ และนามสกุล");
        return;
      }
    } else if (role === "EMPLOYER") {
      if (!form.companyName.trim() || !form.contactName.trim()) {
        setError("กรุณากรอกชื่อสถานประกอบการและชื่อผู้ติดต่อ");
        return;
      }
    }

    setLoading(true);

    try {
      const data = {
        username: form.username.trim(),
        password: form.password,
        role,
        ...(role === "STUDENT"
          ? {
              studentCode: form.studentCode.trim(),
              firstName: form.firstName.trim(),
              lastName: form.lastName.trim(),
              phone: form.phone.trim() || null,
              email: form.email.trim() || null,
              faculty: form.faculty.trim() || null,
              major: form.major.trim() || null,
              yearOfStudy: form.yearOfStudy ? Number(form.yearOfStudy) : null,
            }
          : {
              companyName: form.companyName.trim(),
              contactName: form.contactName.trim(),
              phone: form.phone.trim() || null,
              email: form.email.trim() || null,
              address: form.address.trim() || null,
              companyDescription: form.companyDescription.trim() || null,
            }),
      };

      await registerUser(data);
      setSuccess("สมัครสมาชิกสำเร็จเรียบร้อยแล้ว");
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "การสมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ฝั่งซ้าย: รูปภาพบรรยากาศ */}
      <div
        className="sticky top-0 hidden h-screen w-[32%] shrink-0 bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent flex flex-col justify-end p-10 text-white">
          <span className="text-xs font-bold text-amber-300">
            ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง
          </span>
          <h2 className="mt-2 text-2xl font-black">
            เชื่อมต่อโอกาส สู่อนาคตการทำงาน
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-200">
            ลงทะเบียนเพื่อเข้าถึงงานพาร์ตไทม์ที่ปลอดภัย หรือค้นหานักศึกษาที่มีศักยภาพ
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์มสมัครสมาชิก */}
      <div className="flex flex-1 justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-[650px]">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-black text-primary">
              สมัครสมาชิก
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              ระบบจัดหางานพาร์ตไทม์ มหาวิทยาลัยรามคำแหง
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="mx-auto mt-6 grid max-w-[420px] grid-cols-2 gap-3 rounded-2xl bg-slate-200/60 p-1.5">
            <button
              type="button"
              onClick={() => {
                setRole("STUDENT");
                setError("");
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition ${
                role === "STUDENT"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              นักศึกษา ม.รามคำแหง
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("EMPLOYER");
                setError("");
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition ${
                role === "EMPLOYER"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ผู้ประกอบการ / นายจ้าง
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-sm">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-base text-emerald-600" />
                <span>{success} สามารถเข้าสู่ระบบได้ทันที</span>
              </div>
              <button
                type="button"
                onClick={onGoLogin}
                className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-700"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Account Credentials */}
            <Section title="ข้อมูลบัญชีผู้ใช้งาน">
              <Field
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="ชื่อผู้ใช้งาน (Username) *"
                required
                icon={<FaUser />}
              />

              <Field
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="รหัสผ่าน (Password) *"
                required
                icon={<FaLock />}
              />
            </Section>

            {/* Student Specific Fields */}
            {role === "STUDENT" && (
              <>
                <Section title="ข้อมูลนักศึกษา มหาวิทยาลัยรามคำแหง">
                  <Field
                    name="studentCode"
                    value={form.studentCode}
                    onChange={handleChange}
                    placeholder="รหัสนักศึกษา (เช่น 6601234567) *"
                    required
                    icon={<FaIdCard />}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="ชื่อ *"
                      required
                      icon={<FaUser />}
                    />
                    <Field
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="นามสกุล *"
                      required
                      icon={<FaUser />}
                    />
                  </div>

                  <Field
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="เบอร์โทรศัพท์"
                    icon={<FaPhone />}
                  />

                  <Field
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="อีเมล"
                    icon={<FaEnvelope />}
                  />
                </Section>

                <Section title="ข้อมูลการศึกษา">
                  <Field
                    name="faculty"
                    value={form.faculty}
                    onChange={handleChange}
                    placeholder="คณะ (เช่น บริหารธุรกิจ, นิติศาสตร์)"
                    icon={<FaGraduationCap />}
                  />

                  <Field
                    name="major"
                    value={form.major}
                    onChange={handleChange}
                    placeholder="สาขาวิชา"
                    icon={<FaBook />}
                  />

                  <Field
                    name="yearOfStudy"
                    type="number"
                    value={form.yearOfStudy}
                    onChange={handleChange}
                    placeholder="ชั้นปีที่ศึกษา (เช่น 1, 2, 3, 4)"
                    icon={<FaCalendarAlt />}
                  />
                </Section>
              </>
            )}

            {/* Employer Specific Fields */}
            {role === "EMPLOYER" && (
              <Section title="ข้อมูลสถานประกอบการ">
                <Field
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="ชื่อสถานประกอบการ / บริษัท *"
                  required
                  icon={<FaBuilding />}
                />

                <Field
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="ชื่อ-นามสกุล ผู้ประสานงาน *"
                  required
                  icon={<FaUserTie />}
                />

                <Field
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="เบอร์โทรศัพท์ติดต่อ"
                  icon={<FaPhone />}
                />

                <Field
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="อีเมลติดต่อ"
                  icon={<FaEnvelope />}
                />

                <div className="sm:col-span-2">
                  <textarea
                    name="address"
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="ที่อยู่สถานประกอบการ (ระบุสาขาหรือพิกัดใกล้ ม.รามคำแหง)"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <textarea
                    name="companyDescription"
                    rows={3}
                    value={form.companyDescription}
                    onChange={handleChange}
                    placeholder="รายละเอียดธุรกิจเบื้องต้น (เช่น ประเภทกิจการ, สินค้า/บริการ)"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </Section>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md transition hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? "กำลังบันทึกข้อมูล..." : "ยืนยันการสมัครสมาชิก"}
              </button>
            </div>
          </form>

          {/* Login Back Link */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-xs text-slate-600">
            <span>มีบัญชีผู้ใช้งานอยู่แล้ว? </span>
            <button
              type="button"
              onClick={onGoLogin}
              className="font-bold text-primary hover:underline"
            >
              เข้าสู่ระบบที่นี่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
