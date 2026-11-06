import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaClipboardList,
  FaArrowLeft,
  FaCommentDots,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getMyApplications } from "../../services/studentApi";

// หน้าประวัติและติดตามสถานะการสมัครงานของนักศึกษา (FR-03)
function StudentApplications({
  user,
  currentPage,
  onBack,
  onNavigate,
  onLogout,
}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // โหลดประวัติการสมัครงานทั้งหมด
  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications(user.userId);
      setApplications(data || []);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดประวัติการสมัครงานได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [user.userId]);

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
        currentPage={currentPage || "applications"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Header */}
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
              <h1 className="text-2xl font-bold text-primary md:text-3xl">
                ติดตามสถานะการสมัครงาน (FR-03)
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                ตรวจสอบสถานะการพิจารณาใบสมัครงานและหมายเหตุจากผู้ประกอบการ
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-base text-slate-500">กำลังโหลดรายการสมัครงาน...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FaClipboardList className="mx-auto mb-3 text-4xl text-slate-300" />
            <h2 className="text-lg font-bold text-slate-800">
              ยังไม่มีประวัติการสมัครงาน
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              คุณสามารถค้นหาและเลือกสมัครงานพาร์ตไทม์ที่ตรงกับเวลาว่างได้ในเมนู &quot;ค้นหางาน&quot;
            </p>
            <button
              type="button"
              onClick={() => onNavigate?.("jobs")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-dark"
            >
              <FaBriefcase />
              ไปหน้ารายการงาน
            </button>
          </div>
        )}

        {/* Application List */}
        {!loading && applications.length > 0 && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                ประวัติการสมัครทั้งหมด ({applications.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <div
                  key={app.applicationId}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                          {app.jobTitle}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <FaBuilding className="text-primary shrink-0" />
                          <span className="line-clamp-1">{app.companyName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <ApplicationStatusBadge status={app.status} />
                    </div>

                    {/* Timeline Info */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-slate-400 shrink-0" />
                        <span>
                          วันที่สมัคร:{" "}
                          {app.appliedAt
                            ? new Date(app.appliedAt).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </span>
                      </div>

                      {app.reviewedAt && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-slate-400 shrink-0" />
                          <span>
                            วันที่พิจารณา:{" "}
                            {new Date(app.reviewedAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Remark from Employer */}
                    {app.employerRemark && (
                      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <FaCommentDots className="text-primary" />
                          <span>หมายเหตุจากผู้ประกอบการ:</span>
                        </div>
                        <p className="mt-1 whitespace-pre-line text-slate-600">
                          {app.employerRemark}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ป้ายแสดงสถานะการสมัครงานพร้อมสีและไอคอน
function ApplicationStatusBadge({ status }) {
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
        <FaHourglassHalf />
        รอผู้ประกอบการพิจารณา
      </span>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
        <FaCheck />
        ผ่านการคัดเลือก
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
        <FaTimes />
        ไม่ผ่านการคัดเลือก
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      {status}
    </span>
  );
}

export default StudentApplications;
