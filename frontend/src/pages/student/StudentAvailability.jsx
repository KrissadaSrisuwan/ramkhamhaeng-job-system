import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaPencilAlt,
  FaTrash,
  FaTimes,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../services/studentApi";

// รายชื่อวันในรอบสัปดาห์
const DAYS = [
  { value: "MONDAY", label: "วันจันทร์" },
  { value: "TUESDAY", label: "วันอังคาร" },
  { value: "WEDNESDAY", label: "วันพุธ" },
  { value: "THURSDAY", label: "วันพฤหัสบดี" },
  { value: "FRIDAY", label: "วันศุกร์" },
  { value: "SATURDAY", label: "วันเสาร์" },
  { value: "SUNDAY", label: "วันอาทิตย์" },
];

const EMPTY_FORM = {
  dayOfWeek: "",
  startTime: "",
  endTime: "",
  isAvailable: true,
};

const fieldClass =
  "flex h-12 w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";

const inputClass =
  "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400";

// แบบฟอร์มเพิ่มหรือแก้ไขช่วงเวลาว่าง
function AvailabilityForm({
  isEditing,
  form,
  onChange,
  onToggle,
  onSubmit,
  onCancel,
  error,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-primary">
          {isEditing ? "แก้ไขช่วงเวลาว่าง" : "เพิ่มช่วงเวลาว่างใหม่"}
        </h2>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="ยกเลิกการแก้ไข"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700"
        >
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* วัน */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            วันในสัปดาห์ <span className="text-red-500">*</span>
          </label>
          <div className={fieldClass}>
            <FaCalendarAlt className="shrink-0 text-slate-400 text-sm" />
            <select
              name="dayOfWeek"
              value={form.dayOfWeek}
              onChange={onChange}
              required
              className="w-full cursor-pointer bg-transparent text-sm text-slate-900 outline-none"
            >
              <option value="">-- เลือกวัน --</option>
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* เวลาเริ่มต้นและสิ้นสุด */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              เวลาเริ่มต้น <span className="text-red-500">*</span>
            </label>
            <div className={fieldClass}>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={onChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              เวลาสิ้นสุด <span className="text-red-500">*</span>
            </label>
            <div className={fieldClass}>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={onChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* สถานะพร้อมทำงาน */}
        <label className="flex cursor-pointer items-center gap-3 pt-1 select-none">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={onToggle}
            className="h-4 w-4 rounded border-slate-300 text-primary accent-primary"
          />
          <span className="text-xs font-semibold text-slate-700">
            เปิดใช้งานช่วงเวลานี้สำหรับการแนะนำงาน (Smart Match)
          </span>
        </label>

        {/* ปุ่มบันทึก */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark"
          >
            {isEditing ? "บันทึกการแก้ไข" : "บันทึกช่วงเวลา"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// หน้าจัดการช่วงเวลาว่างสำหรับนักศึกษา (FR-02)
function StudentAvailability({
  user,
  currentPage,
  onBack,
  onNavigate,
  onLogout,
}) {
  const [availabilities, setAvailabilities] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // โหลดรายการช่วงเวลาว่างทั้งหมด
  async function loadAvailabilities() {
    try {
      setLoading(true);
      setError("");
      const data = await getAvailabilities(user.userId);
      setAvailabilities(data || []);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดช่วงเวลาว่างได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailabilities();
  }, [user.userId]);

  // จัดการเปลี่ยนค่าฟอร์ม
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // สลับสถานะเปิดใช้งานเวลาว่าง
  function handleToggle(e) {
    setForm((prev) => ({ ...prev, isAvailable: e.target.checked }));
  }

  // ล้างฟอร์ม
  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setError("");
  }

  // ส่งฟอร์มบันทึกหรือแก้ไขช่วงเวลาว่าง
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.dayOfWeek) {
      setError("กรุณาเลือกวันในสัปดาห์");
      return;
    }
    if (!form.startTime || !form.endTime) {
      setError("กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุด");
      return;
    }
    if (form.startTime >= form.endTime) {
      setError("เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }

    const payload = {
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      isAvailable: form.isAvailable,
    };

    try {
      if (editingId) {
        await updateAvailability(user.userId, editingId, payload);
        setMessage("แก้ไขช่วงเวลาว่างเรียบร้อยแล้ว");
      } else {
        await createAvailability(user.userId, payload);
        setMessage("เพิ่มช่วงเวลาว่างใหม่เรียบร้อยแล้ว");
      }

      resetForm();
      await loadAvailabilities();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    }
  }

  // เริ่มแก้ไขรายการ
  function handleEdit(item) {
    setEditingId(item.availabilityId);
    setForm({
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime?.slice(0, 5) || "",
      endTime: item.endTime?.slice(0, 5) || "",
      isAvailable: item.isAvailable,
    });
    setMessage("");
    setError("");
  }

  // ลบช่วงเวลาว่าง
  async function handleDelete(id) {
    const confirmDelete = window.confirm("ต้องการลบช่วงเวลาว่างนี้หรือไม่?");
    if (!confirmDelete) return;

    try {
      setMessage("");
      setError("");
      await deleteAvailability(user.userId, id);
      setMessage("ลบช่วงเวลาว่างเรียบร้อยแล้ว");
      if (editingId === id) resetForm();
      await loadAvailabilities();
    } catch (err) {
      setError(err.message || "ไม่สามารถลบข้อมูลได้");
    }
  }

  // นำทางผ่านเมนูหลัก
  function handleNavigate(key) {
    if (key === "home" && !onNavigate) {
      onBack?.();
      return;
    }
    onNavigate?.(key);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="STUDENT"
        currentPage={currentPage || "availability"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            จัดการช่วงเวลาว่าง (FR-02)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            กำหนดตารางเวลาว่างของคุณ เพื่อให้ระบบใช้ค้นหาและแนะนำงานที่ตรงกับเวลา (Smart Match)
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-base text-slate-500">กำลังโหลดช่วงเวลาว่าง...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
            {/* ฝั่งซ้าย: ฟอร์ม */}
            <div className="self-start">
              <AvailabilityForm
                isEditing={editingId !== null}
                form={form}
                onChange={handleChange}
                onToggle={handleToggle}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                error={error}
              />
            </div>

            {/* ฝั่งขวา: รายการช่วงเวลาว่าง */}
            <section>
              <h2 className="mb-3 text-base font-bold text-slate-800">
                รายการช่วงเวลาว่างที่ลงทะเบียนไว้ ({availabilities.length})
              </h2>

              <div className="space-y-3">
                {availabilities.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <FaClock className="mx-auto mb-3 text-4xl text-slate-300" />
                    <p className="text-base font-bold text-slate-700">
                      ยังไม่ได้ระบุช่วงเวลาว่าง
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      เพิ่มช่วงเวลาที่คุณสะดวกทำงานผ่านแบบฟอร์มด้านซ้าย
                    </p>
                  </div>
                ) : (
                  availabilities.map((item) => {
                    const day = DAYS.find((d) => d.value === item.dayOfWeek);

                    return (
                      <div
                        key={item.availabilityId}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FaCalendarAlt />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {day?.label || item.dayOfWeek}
                            </p>
                            <p className="text-xs text-slate-500">
                              เวลา: {item.startTime?.slice(0, 5)} - {item.endTime?.slice(0, 5)} น.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                              item.isAvailable
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-slate-100 text-slate-600 border-slate-300"
                            }`}
                          >
                            {item.isAvailable ? "เปิดรับงาน (พร้อมทำ)" : "ปิดรับชั่วคราว"}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            aria-label="แก้ไข"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-amber-600 hover:bg-amber-50"
                          >
                            <FaPencilAlt size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.availabilityId)}
                            aria-label="ลบ"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default StudentAvailability;
