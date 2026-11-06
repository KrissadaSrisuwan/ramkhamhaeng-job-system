import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaCommentDots,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  createComplaint,
  getMyComplaints,
} from "../../services/complaintApi";
import { getMyApplications } from "../../services/studentApi";

// หมวดหมู่เรื่องร้องเรียนและความปลอดภัย
const COMPLAINT_CATEGORIES = [
  "ความปลอดภัยในสถานที่ทำงาน",
  "ค่าจ้างและผลตอบแทนไม่เป็นไปตามข้อตกลง",
  "งานไม่ตรงกับรายละเอียดที่ประกาศ",
  "การเลือกปฏิบัติหรือการคุกคาม",
  "ผู้ประกอบการมีพฤติกรรมน่าสงสัย / หลอกลวง",
  "ปัญหาหรือข้อพิพาทอื่นๆ",
];

// แปลงสถานะเรื่องร้องเรียนเป็นข้อความและสี
function getStatusBadge(status) {
  switch (status) {
    case "PENDING":
      return {
        text: "รอเจ้าหน้าที่ตรวจสอบ",
        classes: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <FaClock className="text-amber-600" />,
      };
    case "INVESTIGATING":
      return {
        text: "กำลังตรวจสอบข้อเท็จจริง",
        classes: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <FaSearch className="text-blue-600" />,
      };
    case "RESOLVED":
      return {
        text: "ดำเนินการแก้ไขเรียบร้อย",
        classes: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: <FaCheckCircle className="text-emerald-600" />,
      };
    case "DISMISSED":
      return {
        text: "ยุติเรื่องร้องเรียน",
        classes: "bg-neutral-100 text-neutral-700 border-neutral-300",
        icon: <FaTimes className="text-neutral-500" />,
      };
    default:
      return {
        text: status,
        classes: "bg-neutral-100 text-neutral-800 border-neutral-300",
        icon: <FaClock />,
      };
  }
}

// หน้าแจ้งเรื่องร้องเรียนและรายงานความไม่ปลอดภัยสำหรับนักศึกษา (FR-04)
function StudentComplaints({
  user,
  currentPage,
  initialJobId = null,
  onBack,
  onNavigate,
  onLogout,
}) {
  // รายการเรื่องร้องเรียนที่เคยส่ง
  const [complaints, setComplaints] = useState([]);

  // รายการงานที่เคยสมัคร (เพื่อเลือกอ้างอิง)
  const [appliedJobs, setAppliedJobs] = useState([]);

  // สถานะเปิด/ปิดฟอร์มส่งเรื่องร้องเรียน
  const [showForm, setShowForm] = useState(Boolean(initialJobId));

  // ข้อมูลแบบฟอร์ม
  const [form, setForm] = useState({
    title: "",
    category: COMPLAINT_CATEGORIES[0],
    jobId: initialJobId || "",
    description: "",
  });

  // สถานะการโหลดและข้อผิดพลาด
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // โหลดข้อมูลเรื่องร้องเรียนและประวัติงานที่สมัคร
  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [complaintsData, appsData] = await Promise.all([
        getMyComplaints(user.userId),
        getMyApplications(user.userId).catch(() => []),
      ]);

      setComplaints(complaintsData);
      setAppliedJobs(appsData);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดข้อมูลเรื่องร้องเรียนได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user.userId]);

  // จัดการเปลี่ยนค่าฟิลด์ในฟอร์ม
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ส่งแบบฟอร์มร้องเรียน
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("กรุณากรอกหัวข้อและรายละเอียดให้ครบถ้วน");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        jobId: form.jobId ? Number(form.jobId) : null,
      };

      await createComplaint(user.userId, payload);
      setSuccessMessage("ส่งเรื่องร้องเรียนสำเร็จ เจ้าหน้าที่จะดำเนินการตรวจสอบโดยเร็ว");
      setForm({
        title: "",
        category: COMPLAINT_CATEGORIES[0],
        jobId: "",
        description: "",
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการส่งเรื่องร้องเรียน");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="STUDENT"
        currentPage={currentPage || "complaints"}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <FaArrowLeft />
              กลับ
            </button>
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-primary md:text-3xl">
                <FaShieldAlt className="text-amber-600" />
                รายงานปัญหาและความปลอดภัย (FR-04)
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                ส่งเรื่องร้องเรียนหรือรายงานเหตุการณ์ที่ไม่ปลอดภัยถึงเจ้าหน้าที่มหาวิทยาลัยรามคำแหง
              </p>
            </div>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={() => {
                setShowForm(true);
                setSuccessMessage("");
                setError("");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark"
            >
              <FaPlus />
              แจ้งเรื่องร้องเรียนใหม่
            </button>
          )}
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-xl text-emerald-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-xl text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Form Modal / Section */}
        {showForm && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    แบบฟอร์มส่งเรื่องร้องเรียน / รายงานความไม่ปลอดภัย
                  </h2>
                  <p className="text-xs text-slate-500">
                    ข้อมูลของคุณจะได้รับการคุ้มครองและตรวจสอบโดยเจ้าหน้าที่มหาวิทยาลัย
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-800">
                  หัวข้อเรื่องร้องเรียน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="เช่น ไม่ได้รับค่าจ้างตามที่ตกลง, สภาพแวดล้อมไม่ปลอดภัย"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">
                    หมวดหมู่ปัญหา <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-800">
                    งานที่เกี่ยวข้อง (ไม่บังคับ)
                  </label>
                  <select
                    name="jobId"
                    value={form.jobId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">-- ไม่ระบุงาน / ปัญหาระดับทั่วไป --</option>
                    {appliedJobs.map((app) => (
                      <option key={app.jobId} value={app.jobId}>
                        {app.jobTitle} ({app.companyName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-800">
                  รายละเอียดเหตุการณ์และข้อเท็จจริง <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="ระบุข้อเท็จจริง วันที่ เวลา บุคคลที่เกี่ยวข้อง และรายละเอียดเพื่อการตรวจสอบ..."
                  className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:opacity-50"
                >
                  {submitting ? "กำลังส่งข้อมูล..." : "ส่งเรื่องร้องเรียน"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints History List */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            ประวัติเรื่องร้องเรียนของคุณ ({complaints.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              กำลังโหลดข้อมูลเรื่องร้องเรียน...
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <FaShieldAlt className="mx-auto mb-3 text-5xl text-slate-300" />
              <p className="text-lg font-medium text-slate-700">
                คุณยังไม่มีประวัติการส่งเรื่องร้องเรียน
              </p>
              <p className="mt-1 text-sm text-slate-500">
                หากพบปัญหาหรือเหตุการณ์ที่ไม่ปลอดภัย สามารถคลิกปุ่ม &quot;แจ้งเรื่องร้องเรียนใหม่&quot; ได้ตลอดเวลา
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <div
                    key={item.complaintId}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.classes}`}
                          >
                            {badge.icon}
                            {badge.text}
                          </span>
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>
                      </div>

                      <div className="text-right text-xs text-slate-400">
                        ส่งเมื่อ:{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </div>
                    </div>

                    {item.jobTitle && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700">
                        <FaBriefcase className="text-primary" />
                        <span>งานที่เกี่ยวข้อง: {item.jobTitle}</span>
                        {item.companyName && (
                          <span className="text-slate-400">({item.companyName})</span>
                        )}
                      </div>
                    )}

                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>

                    {/* Officer Remark & Resolution */}
                    {item.officerRemark && (
                      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                          <FaCommentDots />
                          บันทึกการดำเนินการจากเจ้าหน้าที่
                          {item.resolvedByName && ` (${item.resolvedByName})`}
                        </div>
                        <p className="mt-1 whitespace-pre-line text-sm text-blue-950">
                          {item.officerRemark}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default StudentComplaints;
