import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaTimes,
  FaArrowLeft,
  FaUser,
  FaBriefcase,
  FaCommentDots,
  FaSave,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getAllComplaints,
  getComplaintsByStatus,
  updateComplaintStatus,
} from "../../services/complaintApi";

// แปลงสถานะเรื่องร้องเรียนเป็นข้อความและสี
function getStatusBadge(status) {
  switch (status) {
    case "PENDING":
      return {
        text: "รอตรวจสอบ",
        classes: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <FaClock className="text-amber-600" />,
      };
    case "INVESTIGATING":
      return {
        text: "กำลังตรวจสอบ",
        classes: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <FaSearch className="text-blue-600" />,
      };
    case "RESOLVED":
      return {
        text: "แก้ไขเรียบร้อย",
        classes: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: <FaCheckCircle className="text-emerald-600" />,
      };
    case "DISMISSED":
      return {
        text: "ยุติเรื่อง",
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

// หน้าจัดการเรื่องร้องเรียนและติดตามความปลอดภัยสำหรับเจ้าหน้าที่ (FR-04)
function OfficerComplaints({ user, currentPage, onBack, onNavigate, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ฟอร์มสำหรับปรับปรุงสถานะเรื่องร้องเรียน
  const [updateForm, setUpdateForm] = useState({
    status: "INVESTIGATING",
    remark: "",
  });

  const officerUserId = user.userId;

  // โหลดรายการเรื่องร้องเรียนตามตัวกรอง
  async function loadComplaints() {
    try {
      setLoading(true);
      setError("");

      let data;
      if (filterStatus === "ALL") {
        data = await getAllComplaints(officerUserId);
      } else {
        data = await getComplaintsByStatus(officerUserId, filterStatus);
      }

      setComplaints(data);

      if (selectedComplaint) {
        const refreshed = data.find((c) => c.complaintId === selectedComplaint.complaintId);
        if (refreshed) {
          setSelectedComplaint(refreshed);
        }
      }
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดเรื่องร้องเรียนได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, [filterStatus]);

  // เมื่อเจ้าหน้าที่คลิกเลือกเรื่องร้องเรียน
  function handleSelect(complaint) {
    setSelectedComplaint(complaint);
    setUpdateForm({
      status: complaint.status === "PENDING" ? "INVESTIGATING" : complaint.status,
      remark: complaint.officerRemark || "",
    });
    setMessage("");
    setError("");
  }

  // เจ้าหน้าที่บันทึกการปรับปรุงสถานะและหมายเหตุ
  async function handleUpdateStatus(e) {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      await updateComplaintStatus(officerUserId, selectedComplaint.complaintId, {
        status: updateForm.status,
        remark: updateForm.remark.trim(),
      });

      setMessage("บันทึกการดำเนินงานเรื่องร้องเรียนเรียบร้อยแล้ว");
      await loadComplaints();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการปรับปรุงสถานะ");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="OFFICER"
        currentPage={currentPage || "complaints"}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
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
                จัดการเรื่องร้องเรียนและความปลอดภัย (FR-04)
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                ตรวจสอบและติดตามเรื่องร้องเรียนจากนักศึกษา พร้อมบันทึกผลการดำเนินงาน
              </p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { key: "ALL", label: "ทั้งหมด" },
            { key: "PENDING", label: "รอตรวจสอบ" },
            { key: "INVESTIGATING", label: "กำลังตรวจสอบ" },
            { key: "RESOLVED", label: "แก้ไขแล้ว" },
            { key: "DISMISSED", label: "ยุติเรื่อง" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filterStatus === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alert Messages */}
        {message && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-600" />
              <span>{message}</span>
            </div>
            <button type="button" onClick={() => setMessage("")}>
              <FaTimes />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800 shadow-sm">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              <span>{error}</span>
            </div>
            <button type="button" onClick={() => setError("")}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* Content Grid: Left List, Right Detail */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* List Section */}
          <div className="lg:col-span-5">
            <h2 className="mb-3 text-base font-bold text-slate-800">
              รายการเรื่องร้องเรียน ({complaints.length})
            </h2>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                กำลังโหลดข้อมูล...
              </div>
            ) : complaints.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                ไม่พบเรื่องร้องเรียนในหมวดนี้
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map((item) => {
                  const badge = getStatusBadge(item.status);
                  const isSelected = selectedComplaint?.complaintId === item.complaintId;

                  return (
                    <button
                      key={item.complaintId}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.classes}`}
                        >
                          {badge.icon}
                          {badge.text}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("th-TH", {
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-bold text-slate-900 line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <FaUser className="text-slate-400" />
                          {item.reporterName}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                          {item.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail & Action Section */}
          <div className="lg:col-span-7">
            {selectedComplaint ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                        getStatusBadge(selectedComplaint.status).classes
                      }`}
                    >
                      {getStatusBadge(selectedComplaint.status).icon}
                      {getStatusBadge(selectedComplaint.status).text}
                    </span>
                    <span className="text-xs text-slate-500">
                      รหัส: #{selectedComplaint.complaintId}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-slate-900">
                    {selectedComplaint.title}
                  </h2>
                </div>

                {/* Reporter & Info Cards */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3.5">
                    <span className="text-xs font-semibold text-slate-500">ผู้รายงาน</span>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                      {selectedComplaint.reporterName}
                    </p>
                    <p className="text-xs text-slate-500">
                      บัญชี: {selectedComplaint.username} ({selectedComplaint.reporterRole})
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5">
                    <span className="text-xs font-semibold text-slate-500">หมวดหมู่</span>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                      {selectedComplaint.category}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedComplaint.createdAt
                        ? new Date(selectedComplaint.createdAt).toLocaleString("th-TH")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Related Job */}
                {selectedComplaint.jobTitle && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-sm text-blue-900">
                    <FaBriefcase className="text-primary text-lg" />
                    <div>
                      <p className="font-bold">งานที่เกี่ยวข้อง: {selectedComplaint.jobTitle}</p>
                      {selectedComplaint.companyName && (
                        <p className="text-xs text-blue-700">ผู้ประกอบการ: {selectedComplaint.companyName}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    รายละเอียดเหตุการณ์
                  </h3>
                  <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                    {selectedComplaint.description}
                  </div>
                </div>

                {/* Officer Update Form */}
                <form onSubmit={handleUpdateStatus} className="mt-6 border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-900">
                    ดำเนินการตรวจสอบ / บันทึกผลการติดตาม
                  </h3>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      เปลี่ยนสถานะการดำเนินงาน
                    </label>
                    <select
                      value={updateForm.status}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="PENDING">รอตรวจสอบ (PENDING)</option>
                      <option value="INVESTIGATING">กำลังตรวจสอบข้อเท็จจริง (INVESTIGATING)</option>
                      <option value="RESOLVED">แก้ไขปัญหา / ยุติเรื่องเรียบร้อย (RESOLVED)</option>
                      <option value="DISMISSED">ยกเลิก / ปฏิเสธเรื่องร้องเรียน (DISMISSED)</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      บันทึกความเห็น / การประสานงานของเจ้าหน้าที่
                    </label>
                    <textarea
                      rows={4}
                      value={updateForm.remark}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({ ...prev, remark: e.target.value }))
                      }
                      placeholder="ระบุแนวทางการแก้ไข การติดต่อตักเตือนผู้ประกอบการ หรือข้อสรุปสำหรับให้นักศึกษาทราบ..."
                      className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      disabled={updating}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark disabled:opacity-50"
                    >
                      <FaSave />
                      {updating ? "กำลังบันทึก..." : "บันทึกผลการดำเนินงาน"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
                <FaShieldAlt className="mb-3 text-5xl text-slate-300" />
                <p className="text-base font-medium text-slate-600">
                  เลือกเรื่องร้องเรียนจากรายการทางซ้าย
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  เพื่อดูรายละเอียด ตรวจสอบข้อมูล และบันทึกผลการดำเนินงาน
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OfficerComplaints;
