import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaUserFriends,
  FaPencilAlt,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getMyJobs,
  createJob,
  updateJob,
  openJob,
  closeJob,
  deleteJob,
  getEmployerProfile,
} from "../../services/employerApi";

import { getCategories } from "../../services/officerApi";

// ค่าเริ่มต้นของฟอร์มประกาศงาน
const EMPTY_FORM = {
  categoryId: "",
  jobTitle: "",
  description: "",
  location: "",
  salary: "",
  qualification: "",
  jobDate: "",
  startTime: "",
  endTime: "",
};

const fieldClass =
  "flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";

const inputClass =
  "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400";

// ฟอร์มสร้างและแก้ไขประกาศงาน
function JobForm({
  isEditing,
  isApproved,
  form,
  categories,
  onChange,
  onSubmit,
  onCancel,
  error,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-primary">
          {isEditing ? "แก้ไขประกาศงาน" : "สร้างประกาศงานพาร์ตไทม์"}
        </h2>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="ยกเลิกการแก้ไข"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-black"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* คำเตือนเรื่องการยืนยันตัวตน (FR-03, FR-04) */}
      {!isApproved && !isEditing && (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <FaExclamationTriangle />
            <span>รอการยืนยันตัวตนจากเจ้าหน้าที่มหาวิทยาลัย</span>
          </div>
          <p className="mt-1">
            สถานประกอบการต้องผ่านการตรวจสอบและอนุมัติจากเจ้าหน้าที่ก่อน จึงจะสามารถสร้างประกาศงานได้
          </p>
        </div>
      )}

      {/* ข้อผิดพลาด */}
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200"
        >
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* หมวดหมู่งาน */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            หมวดหมู่งาน <span className="text-red-500">*</span>
          </label>
          <div className={fieldClass}>
            <FaBriefcase className="shrink-0 text-slate-400 text-sm" />
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={onChange}
              required
              className="w-full cursor-pointer bg-transparent text-sm text-slate-900 outline-none"
            >
              <option value="">-- เลือกหมวดหมู่งาน --</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ชื่องาน */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            ชื่อตำแหน่งงาน <span className="text-red-500">*</span>
          </label>
          <div className={fieldClass}>
            <FaBriefcase className="shrink-0 text-slate-400 text-sm" />
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={onChange}
              placeholder="เช่น พนักงานบริการลูกค้า, ผู้ช่วยจัดเรียงสินค้า"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* รายละเอียด */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            รายละเอียดงานและหน้าที่ <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={onChange}
            placeholder="อธิบายหน้าที่ความรับผิดชอบ ลักษณะงาน..."
            required
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* สถานที่ทำงาน */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            สถานที่ทำงาน (บริเวณ ม.รามคำแหง / ใกล้เคียง)
          </label>
          <div className={fieldClass}>
            <FaMapMarkerAlt className="shrink-0 text-slate-400 text-sm" />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={onChange}
              placeholder="เช่น ม.รามคำแหง 1 หัวหมาก, ซอยรามคำแหง 24, เดอะมอลล์บางกะปิ"
              className={inputClass}
            />
          </div>
        </div>

        {/* ค่าตอบแทน */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            ค่าตอบแทน (บาท/วัน หรือ บาท/ชั่วโมง)
          </label>
          <div className={fieldClass}>
            <FaMoneyBillWave className="shrink-0 text-slate-400 text-sm" />
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={onChange}
              placeholder="เช่น 400"
              min="0"
              className={inputClass}
            />
          </div>
        </div>

        {/* คุณสมบัติ */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            คุณสมบัติผู้สมัคร
          </label>
          <textarea
            name="qualification"
            rows={3}
            value={form.qualification}
            onChange={onChange}
            placeholder="เช่น สามารถยกของหนักได้, รักงานบริการ, ตรงต่อเวลา..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* วันที่และเวลา */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              วันที่ทำงาน
            </label>
            <div className={fieldClass}>
              <FaCalendarAlt className="shrink-0 text-slate-400 text-sm" />
              <input
                type="date"
                name="jobDate"
                value={form.jobDate}
                onChange={onChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                เวลาเริ่ม
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-3 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                เวลาสิ้นสุด
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-3 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <div className="flex gap-3 pt-3">
          <button
            type="submit"
            disabled={!isApproved && !isEditing}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isEditing
              ? "บันทึกการแก้ไขประกาศงาน"
              : isApproved
              ? "สร้างประกาศงานและส่งตรวจสอบ"
              : "รอการอนุมัติบัญชีก่อนประกาศงาน"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// หน้าจัดการประกาศงานของผู้ประกอบการ (FR-03)
function EmployerJobs({
  user,
  currentPage,
  onBack,
  onNavigate,
  onLogout,
  onViewApplicants,
}) {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("PENDING");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // โหลดรายการงาน หมวดหมู่ และสถานะผู้ประกอบการ
  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [jobsData, categoriesData, profileData] = await Promise.all([
        getMyJobs(user.userId),
        getCategories(),
        getEmployerProfile(user.userId).catch(() => ({ verificationStatus: "PENDING" })),
      ]);

      setJobs(jobsData || []);
      setCategories(categoriesData || []);
      setVerificationStatus(profileData?.verificationStatus || "PENDING");
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดข้อมูลงานได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // โหลดเฉพาะรายการงาน
  async function loadJobs() {
    try {
      const data = await getMyJobs(user.userId);
      setJobs(data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  // อัปเดตข้อมูลฟอร์ม
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ล้างฟอร์ม
  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setError("");
  }

  // บันทึกฟอร์มสร้างหรือแก้ไขประกาศงาน
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!editingId && verificationStatus !== "APPROVED") {
      setError("ผู้ประกอบการต้องผ่านการยืนยันตัวตนจากเจ้าหน้าที่มหาวิทยาลัยก่อน จึงจะสามารถประกาศงานได้");
      return;
    }

    if (!form.categoryId) {
      setError("กรุณาเลือกหมวดหมู่งาน");
      return;
    }
    if (!form.jobTitle.trim()) {
      setError("กรุณากรอกชื่องาน");
      return;
    }
    if (!form.description.trim()) {
      setError("กรุณากรอกรายละเอียดงาน");
      return;
    }

    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      setError("เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด");
      return;
    }

    const payload = {
      categoryId: Number(form.categoryId),
      jobTitle: form.jobTitle.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      salary: form.salary === "" ? null : Number(form.salary),
      qualification: form.qualification.trim(),
      jobDate: form.jobDate === "" ? null : form.jobDate,
      startTime: form.startTime === "" ? null : form.startTime,
      endTime: form.endTime === "" ? null : form.endTime,
    };

    try {
      if (editingId) {
        await updateJob(user.userId, editingId, payload);
        setMessage("แก้ไขประกาศงานเรียบร้อยแล้ว (งานจะถูกส่งตรวจสอบใหม่)");
      } else {
        await createJob(user.userId, payload);
        setMessage("สร้างประกาศงานเรียบร้อยแล้ว งานถูกส่งให้เจ้าหน้าที่ตรวจสอบ");
      }

      resetForm();
      await loadJobs();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  }

  // เลือกงานเพื่อแก้ไข
  function handleEdit(job) {
    setEditingId(job.jobId);
    setForm({
      categoryId: job.categoryId || "",
      jobTitle: job.jobTitle || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary ?? "",
      qualification: job.qualification || "",
      jobDate: job.jobDate || "",
      startTime: job.startTime?.slice(0, 5) || "",
      endTime: job.endTime?.slice(0, 5) || "",
    });
    setMessage("");
    setError("");
  }

  // เปิดรับสมัครงาน
  async function handleOpen(jobId) {
    try {
      setMessage("");
      setError("");
      await openJob(user.userId, jobId);
      setMessage("เปิดรับสมัครงานเรียบร้อยแล้ว");
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  // ปิดรับสมัครงาน
  async function handleClose(jobId) {
    try {
      setMessage("");
      setError("");
      await closeJob(user.userId, jobId);
      setMessage("ปิดรับสมัครงานเรียบร้อยแล้ว");
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  // ลบประกาศงาน
  async function handleDelete(jobId) {
    const confirmed = window.confirm("ต้องการลบประกาศงานนี้หรือไม่?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteJob(user.userId, jobId);
      setMessage("ลบประกาศงานเรียบร้อยแล้ว");
      if (editingId === jobId) resetForm();
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  }

  // นำทางผ่าน Navbar
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
        role="EMPLOYER"
        currentPage={currentPage || "manage-jobs"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Verification Status Banner */}
        {verificationStatus !== "APPROVED" && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs md:text-sm text-amber-900 shadow-sm">
            <div className="flex items-center gap-2 font-bold">
              <FaShieldAlt className="text-amber-600 text-lg" />
              <span>สถานะการยืนยันตัวตน: {verificationStatus === "PENDING" ? "อยู่ระหว่างรอการตรวจสอบ (PENDING)" : "ไม่ผ่านการอนุมัติ (REJECTED)"}</span>
            </div>
            <p className="mt-1 text-amber-800">
              ตามข้อกำหนด FR-03 และ FR-04 ผู้ประกอบการต้องได้รับการอนุมัติจากเจ้าหน้าที่มหาวิทยาลัยก่อนจึงจะสร้างประกาศงานได้ หากมีข้อสงสัยกรุณาติดต่อกองกิจการนักศึกษา
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-base text-slate-500">กำลังโหลดข้อมูลงาน...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            {/* ฝั่งซ้าย: ฟอร์ม */}
            <div className="self-start">
              <JobForm
                isEditing={editingId !== null}
                isApproved={verificationStatus === "APPROVED"}
                form={form}
                categories={categories}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                error={error}
              />
            </div>

            {/* ฝั่งขวา: รายการงาน */}
            <section>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-primary">
                    จัดการประกาศงานพาร์ตไทม์
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    รายการประกาศงานทั้งหมดที่คุณสร้างไว้ ({jobs.length})
                  </p>
                </div>
              </div>

              {message && (
                <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
                  {message}
                </div>
              )}

              {error && !editingId && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs font-semibold text-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <FaBriefcase className="mx-auto mb-3 text-4xl text-slate-300" />
                    <p className="text-base font-bold text-slate-700">ยังไม่มีประกาศงาน</p>
                    <p className="mt-1 text-xs text-slate-400">
                      กรอกข้อมูลในแบบฟอร์มด้านซ้ายเพื่อสร้างประกาศงานใหม่
                    </p>
                  </div>
                ) : (
                  jobs.map((job) => {
                    const isApprovedJob = job.verificationStatus === "APPROVED";
                    const isPendingJob = job.verificationStatus === "PENDING";
                    const isRejectedJob = job.verificationStatus === "REJECTED";
                    const isOpenJob = job.status === "OPEN";

                    return (
                      <div
                        key={job.jobId}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <span className="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                              {job.categoryName || "ทั่วไป"}
                            </span>
                            <h3 className="mt-2 text-lg font-bold text-slate-900">
                              {job.jobTitle}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                                isOpenJob
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-slate-100 text-slate-700 border-slate-300"
                              }`}
                            >
                              {isOpenJob ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                            </span>

                            <span
                              className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                                isApprovedJob
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : isRejectedJob
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-amber-100 text-amber-800 border-amber-300"
                              }`}
                            >
                              {isApprovedJob
                                ? "อนุมัติแล้ว"
                                : isRejectedJob
                                ? "ไม่อนุมัติ"
                                : "รอตรวจสอบ"}
                            </span>
                          </div>
                        </div>

                        {/* Detail Grid */}
                        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-primary shrink-0" />
                            <span>{job.location || "ไม่ระบุสถานที่"}</span>
                          </div>

                          <div className="flex items-center gap-2 font-bold text-emerald-700">
                            <FaMoneyBillWave className="shrink-0" />
                            <span>
                              {job.salary != null ? `${job.salary} บาท` : "ตามตกลง"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-slate-400 shrink-0" />
                            <span>วันที่: {job.jobDate || "ไม่ระบุ"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaClock className="text-slate-400 shrink-0" />
                            <span>
                              เวลา:{" "}
                              {job.startTime && job.endTime
                                ? `${job.startTime.slice(0, 5)} - ${job.endTime.slice(0, 5)}`
                                : "ไม่ระบุ"}
                            </span>
                          </div>
                        </div>

                        {/* Officer Remark */}
                        {job.verificationRemark && (
                          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                            <span className="font-bold">หมายเหตุจากเจ้าหน้าที่:</span>{" "}
                            {job.verificationRemark}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() => onViewApplicants(job.jobId)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark"
                          >
                            <FaUserFriends />
                            ดูผู้สมัคร
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(job)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <FaPencilAlt />
                            แก้ไข
                          </button>

                          {/* Toggle Open/Close */}
                          {isApprovedJob && (
                            isOpenJob ? (
                              <button
                                type="button"
                                onClick={() => handleClose(job.jobId)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                              >
                                <FaLock />
                                ปิดรับสมัคร
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpen(job.jobId)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                              >
                                <FaUnlock />
                                เปิดรับสมัคร
                              </button>
                            )
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(job.jobId)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            <FaTrash />
                            ลบ
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

export default EmployerJobs;
