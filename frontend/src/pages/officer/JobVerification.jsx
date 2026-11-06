import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaTags,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getOfficerJobsByStatus, verifyJob } from "../../services/officerApi";

function JobVerification({ user, currentPage, onBack, onNavigate, onLogout }) {
  // เก็บรายการประกาศงานที่รอตรวจสอบ
  const [jobs, setJobs] = useState([]);

  // เก็บประกาศงานที่เลือกตรวจสอบ
  const [selectedJob, setSelectedJob] = useState(null);

  // เก็บหมายเหตุหรือเหตุผลการตรวจสอบ
  const [remark, setRemark] = useState("");

  // ตรวจสอบสถานะกำลังโหลดข้อมูล
  const [loading, setLoading] = useState(false);

  // เก็บข้อความ Error
  const [error, setError] = useState("");

  // เก็บข้อความสำเร็จ
  const [message, setMessage] = useState("");

  // เก็บ UserID ของเจ้าหน้าที่
  const officerUserId = user.userId;

  // โหลดรายการประกาศงานที่รอตรวจสอบ
  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const data = await getOfficerJobsByStatus(officerUserId, "PENDING");

      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // โหลดข้อมูลเมื่อเปิดหน้า
  useEffect(() => {
    loadJobs();
  }, []);

  // เลือกประกาศงานเพื่อดูรายละเอียด
  function handleSelect(job) {
    setSelectedJob(job);
    setRemark("");
    setError("");
    setMessage("");
  }

  // จัดการการอนุมัติหรือปฏิเสธประกาศงาน
  async function handleVerify(status) {
    if (!selectedJob) {
      return;
    }

    // ตรวจสอบว่าการปฏิเสธต้องระบุเหตุผล
    if (status === "REJECTED" && !remark.trim()) {
      setError("กรุณาระบุเหตุผลที่ปฏิเสธ");
      return;
    }

    // ยืนยันการดำเนินการ
    const confirmed = window.confirm(
      status === "APPROVED"
        ? "ยืนยันการอนุมัติประกาศงาน?"
        : "ยืนยันการปฏิเสธประกาศงาน?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      // ส่งผลการตรวจสอบไปยัง API
      await verifyJob(officerUserId, selectedJob.jobId, {
        status,
        remark: remark.trim(),
      });

      // แสดงข้อความตามผลการตรวจสอบ
      setMessage(
        status === "APPROVED"
          ? "อนุมัติประกาศงานเรียบร้อยแล้ว"
          : "ปฏิเสธประกาศงานเรียบร้อยแล้ว",
      );

      // ล้างข้อมูลประกาศงานที่เลือก
      setSelectedJob(null);
      setRemark("");

      // โหลดรายการประกาศงานใหม่
      await loadJobs();
    } catch (err) {
      setError(err.message);
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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        user={user}
        role="OFFICER"
        currentPage={currentPage || "job-verification"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* หัวข้อหน้า */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">ตรวจสอบประกาศงาน</h1>

          <p className="mt-2 text-sm text-neutral-600">
            ตรวจสอบข้อมูลประกาศงานก่อนอนุมัติให้แสดงในระบบ
          </p>
        </div>

        {/* ข้อความสำเร็จ */}
        {message && (
          <p
            role="status"
            className="mb-5 rounded-xl bg-green-50 px-5 py-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        {/* ข้อความ Error */}
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 px-5 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-lg text-primary">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
            {/* รายการประกาศงาน */}
            <section className="self-start rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    ประกาศงานรอตรวจสอบ
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    จำนวน {jobs.length} รายการ
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FaBriefcase />
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
                  <FaBriefcase className="mx-auto mb-3 text-3xl text-neutral-400" />

                  <p className="text-neutral-600">ไม่มีประกาศงานที่รอตรวจสอบ</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const isSelected = selectedJob?.jobId === job.jobId;

                    return (
                      <button
                        type="button"
                        key={job.jobId}
                        onClick={() => handleSelect(job)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-neutral-200 bg-white hover:border-primary/40 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            <FaBriefcase />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-black">
                              {job.jobTitle}
                            </h3>

                            <p className="mt-1 text-sm text-neutral-600">
                              บริษัท: {job.companyName}
                            </p>

                            <p className="mt-1 text-sm text-neutral-600">
                              หมวดหมู่: {job.categoryName}
                            </p>

                            <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                              รอตรวจสอบ
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* รายละเอียดประกาศงาน */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {!selectedJob ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                    <FaBriefcase />
                  </div>

                  <h2 className="text-xl font-bold text-primary">
                    รายละเอียดประกาศงาน
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    เลือกประกาศงานจากรายการเพื่อดูรายละเอียด
                  </p>
                </div>
              ) : (
                <>
                  {/* หัวข้อรายละเอียด */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl text-primary">
                      <FaBriefcase />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-primary">
                        รายละเอียดประกาศงาน
                      </h2>

                      <p className="mt-1 break-words text-sm text-neutral-500">
                        {selectedJob.jobTitle}
                      </p>
                    </div>
                  </div>

                  {/* ข้อมูลประกาศงาน */}
                  <div className="space-y-4">
                    <InfoItem
                      icon={<FaBriefcase />}
                      label="ชื่องาน"
                      value={selectedJob.jobTitle}
                    />

                    <InfoItem
                      icon={<FaBuilding />}
                      label="บริษัท"
                      value={selectedJob.companyName}
                    />

                    <InfoItem
                      icon={<FaTags />}
                      label="หมวดหมู่"
                      value={selectedJob.categoryName}
                    />

                    <InfoItem
                      icon={<FaMapMarkerAlt />}
                      label="สถานที่"
                      value={selectedJob.location}
                    />

                    <InfoItem
                      icon={<FaMoneyBillWave />}
                      label="ค่าตอบแทน"
                      value={selectedJob.salary}
                    />

                    <InfoItem
                      icon={<FaCalendarAlt />}
                      label="วันที่"
                      value={selectedJob.jobDate}
                    />

                    <InfoItem
                      icon={<FaClock />}
                      label="เวลา"
                      value={
                        selectedJob.startTime && selectedJob.endTime
                          ? `${selectedJob.startTime} - ${selectedJob.endTime}`
                          : "ไม่มีข้อมูล"
                      }
                    />

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <FaClipboardList className="text-primary" />

                        <p className="text-sm font-semibold text-black">
                          รายละเอียดงาน
                        </p>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-600">
                        {selectedJob.description || "ไม่มีข้อมูล"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                      <p className="mb-2 text-sm font-semibold text-black">
                        คุณสมบัติ
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-600">
                        {selectedJob.qualification || "ไม่มีข้อมูล"}
                      </p>
                    </div>

                    {/* สถานะ */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                        <span className="text-sm font-semibold text-black">
                          สถานะงาน
                        </span>

                        <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                          {selectedJob.status || "ไม่มีข้อมูล"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                        <span className="text-sm font-semibold text-black">
                          สถานะตรวจสอบ
                        </span>

                        <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                          {selectedJob.verificationStatus || "ไม่มีข้อมูล"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* หมายเหตุ */}
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-black">
                      หมายเหตุ
                    </label>

                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="กรอกเหตุผล กรณีปฏิเสธ"
                      rows="4"
                      className="w-full resize-none rounded-3xl border border-black bg-white px-6 py-4 text-base text-black outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* ปุ่มอนุมัติ / ปฏิเสธ */}
                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => handleVerify("APPROVED")}
                      className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      <FaCheck />
                      อนุมัติ
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVerify("REJECTED")}
                      className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-red-500 px-6 font-semibold text-red-500 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      <FaTimes />
                      ปฏิเสธ
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// แสดงข้อมูลแต่ละรายการ
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-neutral-500">{label}</p>

        <p className="mt-1 break-words text-sm text-black">
          {value || "ไม่มีข้อมูล"}
        </p>
      </div>
    </div>
  );
}

export default JobVerification;
