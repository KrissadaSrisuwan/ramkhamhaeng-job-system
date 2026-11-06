import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaBuilding,
  FaTags,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaUserCheck,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
  FaCheck,
  FaHourglassHalf,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getJobDetail, applyJob } from "../../services/studentApi";

// หน้ารายละเอียดงานและการสมัครสำหรับนักศึกษา (FR-02, FR-03, FR-04)
function StudentJobDetail({
  user,
  currentPage,
  jobId,
  onBack,
  onNavigate,
  onLogout,
}) {
  // เก็บรายละเอียดงาน
  const [job, setJob] = useState(null);

  // เก็บสถานะกำลังโหลด
  const [loading, setLoading] = useState(true);

  // เก็บข้อความ Error
  const [error, setError] = useState("");

  // เก็บสถานะการสมัครงาน
  const [applicationStatus, setApplicationStatus] = useState(null);

  // โหลดรายละเอียดงาน
  async function loadJob() {
    try {
      setLoading(true);
      setError("");

      const data = await getJobDetail(user.userId, jobId);

      setJob(data);
      setApplicationStatus(data.applicationStatus || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // โหลดรายละเอียดเมื่อเปิดหน้า
  useEffect(() => {
    loadJob();
  }, [jobId]);

  // จัดการสมัครงาน (FR-03)
  async function handleApply() {
    if (applicationStatus === "PENDING") {
      return;
    }

    const confirmed = window.confirm("คุณต้องการสมัครงานนี้หรือไม่?");
    if (!confirmed) {
      return;
    }

    try {
      await applyJob(user.userId, jobId);
      setApplicationStatus("PENDING");
      alert("สมัครงานสำเร็จ กรุณารอผู้ประกอบการพิจารณา");
    } catch (err) {
      alert(err.message);
    }
  }

  // เปลี่ยนหน้าจอจาก Navbar
  function handleNavigate(key) {
    if (key === "home" && !onNavigate) {
      onBack?.();
      return;
    }
    onNavigate?.(key);
  }

  // กำลังโหลด
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar
          user={user}
          role="STUDENT"
          currentPage="job-detail"
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-10">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
              <FaBriefcase />
            </div>
            <p className="text-lg text-primary">กำลังโหลดรายละเอียดงาน...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // เกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar
          user={user}
          role="STUDENT"
          currentPage="job-detail"
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              <FaTimes />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              ไม่สามารถโหลดรายละเอียดงานได้
            </h2>

            <p className="mt-3 rounded-xl bg-red-50 px-5 py-3 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-white transition hover:bg-primary-dark"
            >
              <FaArrowLeft />
              กลับไปหน้ารายการงาน
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ไม่พบข้อมูลงาน
  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar
          user={user}
          role="STUDENT"
          currentPage="job-detail"
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">ไม่พบข้อมูลงาน</h2>

            <button
              type="button"
              onClick={onBack}
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-white transition hover:bg-primary-dark"
            >
              <FaArrowLeft />
              กลับไปหน้ารายการงาน
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar
        user={user}
        role="STUDENT"
        currentPage={currentPage || "job-detail"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6">
        {/* ปุ่มกลับ */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <FaArrowLeft />
            กลับไปหน้ารายการงาน
          </button>
        </div>

        {/* รายละเอียดงาน */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                <FaBriefcase />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                  {job.jobTitle}
                </h1>

                <p className="mt-1 flex items-center gap-2 text-base font-medium text-slate-600">
                  <FaBuilding className="text-primary" />
                  <span>{job.companyName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<FaTags />}
              label="หมวดหมู่งาน"
              value={job.categoryName}
            />

            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="สถานที่ปฏิบัติงาน (บริเวณ ม.รามคำแหง)"
              value={job.location}
            />

            <InfoItem
              icon={<FaCalendarAlt />}
              label="วันที่ปฏิบัติงาน"
              value={job.jobDate}
            />

            <InfoItem
              icon={<FaClock />}
              label="ช่วงเวลาทำงาน"
              value={
                job.startTime && job.endTime
                  ? `${job.startTime} - ${job.endTime}`
                  : null
              }
            />

            <InfoItem
              icon={<FaMoneyBillWave />}
              label="ค่าตอบแทน"
              value={job.salary ? `${job.salary} บาท` : null}
            />
          </div>

          {/* Job Description */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
                <FaClipboardList />
              </div>
              <h3 className="font-bold text-slate-900">รายละเอียดงาน</h3>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {job.description || "ไม่มีข้อมูล"}
            </p>
          </div>

          {/* Qualifications */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
                <FaUserCheck />
              </div>
              <h3 className="font-bold text-slate-900">คุณสมบัติผู้สมัคร</h3>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {job.qualification || "ไม่มีข้อมูล"}
            </p>
          </div>

          {/* Status Row */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <span className="text-sm font-semibold text-slate-800">สถานะงาน</span>
              <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                {job.status === "OPEN" ? "เปิดรับสมัคร" : job.status}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <span className="text-sm font-semibold text-slate-800">สถานะการสมัคร</span>
              <ApplicationStatus status={applicationStatus} />
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            {applicationStatus === "PENDING" ? (
              <button
                type="button"
                disabled
                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-amber-100 font-semibold text-amber-800 border border-amber-300"
              >
                <FaHourglassHalf />
                รอผู้ประกอบการพิจารณาใบสมัคร
              </button>
            ) : applicationStatus === "ACCEPTED" ? (
              <button
                type="button"
                disabled
                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-emerald-100 font-semibold text-emerald-800 border border-emerald-300"
              >
                <FaCheck />
                ผ่านการคัดเลือกแล้ว
              </button>
            ) : applicationStatus === "REJECTED" ? (
              <button
                type="button"
                disabled
                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-red-100 font-semibold text-red-800 border border-red-300"
              >
                <FaTimes />
                ไม่ผ่านการคัดเลือก
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white shadow-md transition hover:bg-primary-dark"
              >
                <FaCheck />
                สมัครงานนี้
              </button>
            )}

            {/* Safety & Complaint Button (FR-04) */}
            <div className="mt-4 flex items-center justify-center border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => onNavigate?.("complaints", { jobId: job.jobId })}
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 hover:text-amber-800 transition"
              >
                <FaShieldAlt /> รายงานปัญหาหรือเหตุการณ์ที่ไม่ปลอดภัยเกี่ยวกับตำแหน่งงานนี้
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// แสดงข้อมูลรายละเอียดงาน
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-900">
          {value || "ไม่มีข้อมูล"}
        </p>
      </div>
    </div>
  );
}

// แสดงสถานะการสมัครงาน
function ApplicationStatus({ status }) {
  if (status === "PENDING") {
    return (
      <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800 border border-amber-300">
        รอพิจารณา
      </span>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
        ผ่านการพิจารณา
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-100 px-3.5 py-1 text-xs font-bold text-red-800 border border-red-300">
        ไม่ผ่านการพิจารณา
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-600">
      ยังไม่ได้สมัคร
    </span>
  );
}

export default StudentJobDetail;
