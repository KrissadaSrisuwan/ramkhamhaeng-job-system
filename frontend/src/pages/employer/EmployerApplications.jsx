import { useEffect, useState } from "react";

import {
  FaArrowLeft,
  FaBook,
  FaBriefcase,
  FaCalendarAlt,
  FaCheck,
  FaClipboardCheck,
  FaEnvelope,
  FaEye,
  FaGraduationCap,
  FaIdCard,
  FaPhone,
  FaTimes,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getJobApplications,
  getApplicantStudent,
  reviewApplication,
} from "../../services/employerApi";
import { imageUrl } from "../../services/imageApi";

// รูปโปรไฟล์วงกลม ถ้าไม่มีรูปจะแสดงไอคอนผู้ใช้
function Avatar({ src, alt, className, iconClass }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ${className}`}
    >
      {src ? (
        <img
          src={imageUrl(src)}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <FaUser className={iconClass} />
      )}
    </div>
  );
}

// แสดงข้อมูลแต่ละรายการของนักศึกษา
function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-neutral-50 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
      <p className="mt-1 whitespace-pre-line pl-6 font-semibold text-black">
        {value || "-"}
      </p>
    </div>
  );
}

function EmployerApplications({ user, jobId, onBack, onNavigate, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStudentId, setLoadingStudentId] = useState(null);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState(null);
  const [remark, setRemark] = useState("");

  // โหลดข้อมูลผู้สมัคร
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobApplications(user.userId, jobId);

      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user.userId, jobId]);

  // ดูข้อมูลนักศึกษา
  const handleViewStudent = async (applicationId) => {
    try {
      setError("");
      setLoadingStudentId(applicationId);

      const data = await getApplicantStudent(user.userId, applicationId);

      setSelectedStudent({ applicationId, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStudentId(null);
    }
  };

  // ปิดข้อมูลนักศึกษา
  const handleCloseStudent = () => {
    setSelectedStudent(null);
  };

  // เริ่มพิจารณาผู้สมัคร
  const handleStartReview = (applicationId, status) => {
    setReviewingId(applicationId);
    setRemark("");

    setApplications((current) =>
      current.map((application) =>
        application.applicationId === applicationId
          ? { ...application, pendingReviewStatus: status }
          : application,
      ),
    );
  };

  // ยืนยันการพิจารณา
  const handleReview = async (application) => {
    const status = application.pendingReviewStatus;

    if (status === "REJECTED" && !remark.trim()) {
      alert("กรุณาระบุเหตุผลในการปฏิเสธ");
      return;
    }

    try {
      await reviewApplication(
        user.userId,
        application.applicationId,
        status,
        remark,
      );

      alert(
        status === "ACCEPTED"
          ? "รับผู้สมัครเรียบร้อยแล้ว"
          : "ปฏิเสธผู้สมัครเรียบร้อยแล้ว",
      );

      setReviewingId(null);
      setRemark("");

      await loadApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  // ยกเลิกการพิจารณา
  const handleCancelReview = () => {
    setReviewingId(null);
    setRemark("");
  };

  // แปลงสถานะเป็นภาษาไทย
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "รอพิจารณา";
      case "ACCEPTED":
        return "ผ่านการคัดเลือก";
      case "REJECTED":
        return "ไม่ผ่านการคัดเลือก";
      default:
        return status;
    }
  };

  // สีของสถานะ
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  // เปลี่ยนหน้าจากเมนู (ถ้า App ส่งมาแค่ onBack ให้ปุ่ม "หน้าหลัก" เรียก onBack)
  const handleNavigate = (key) => {
    if (key === "home" && !onNavigate) {
      onBack?.();
      return;
    }
    onNavigate?.(key);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        user={user}
        role="EMPLOYER"
        currentPage="manage-jobs"
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* แสดงระหว่างโหลด */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary" />
            <p className="text-neutral-600">กำลังโหลดข้อมูลผู้สมัคร...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <button
                type="button"
                onClick={onBack}
                className="mb-5 flex h-11 items-center gap-2 rounded-full border border-primary bg-white px-5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                <FaArrowLeft />
                กลับ
              </button>

              <h1 className="text-3xl font-bold text-black">ผู้สมัครงาน</h1>
              <p className="mt-1 text-sm font-bold text-black">
                ตรวจสอบข้อมูลและจัดการผู้สมัครงาน
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Summary */}
            <div className="mb-8 flex items-center gap-4 rounded-[2rem] border border-primary bg-white px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FaClipboardCheck />
              </div>
              <div>
                <p className="text-sm text-neutral-600">จำนวนผู้สมัครทั้งหมด</p>
                <p className="mt-1 text-2xl font-bold text-black">
                  {applications.length}{" "}
                  <span className="text-base font-normal text-neutral-600">
                    คน
                  </span>
                </p>
              </div>
            </div>

            {/* Empty */}
            {applications.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-primary/50 bg-neutral-50 px-6 py-16 text-center">
                <FaUsers className="mx-auto mb-4 text-4xl text-neutral-300" />
                <h2 className="text-lg font-semibold text-black">
                  ยังไม่มีนักศึกษาสมัครงานนี้
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  เมื่อมีนักศึกษาสมัครงาน ข้อมูลจะแสดงที่หน้านี้
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                {applications.map((application) => {
                  const isViewing =
                    selectedStudent?.applicationId ===
                    application.applicationId;

                  return (
                    <div
                      key={application.applicationId}
                      className="rounded-[2rem] border border-primary bg-white p-6"
                    >
                      {/* Applicant header */}
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <Avatar
                            src={application.profileImage}
                            alt="รูปโปรไฟล์"
                            className="h-14 w-14"
                            iconClass="text-xl"
                          />

                          <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-black">
                              {application.firstName || "-"}{" "}
                              {application.lastName || ""}
                            </h2>
                            <p className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                              <FaIdCard className="text-xs" />
                              {application.studentCode || "-"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${getStatusClass(
                            application.status,
                          )}`}
                        >
                          {getStatusText(application.status)}
                        </span>
                      </div>

                      {/* Application information */}
                      <div className="space-y-3 rounded-2xl bg-neutral-50 p-4">
                        <div className="flex items-start gap-3">
                          <FaBriefcase className="mt-1 shrink-0 text-primary" />
                          <div>
                            <p className="text-xs text-neutral-600">ตำแหน่ง</p>
                            <p className="mt-1 font-medium text-black">
                              {application.jobTitle || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="mt-1 shrink-0 text-primary" />
                          <div>
                            <p className="text-xs text-neutral-600">
                              วันที่สมัคร
                            </p>
                            <p className="mt-1 font-medium text-black">
                              {application.appliedAt
                                ? new Date(
                                    application.appliedAt,
                                  ).toLocaleString("th-TH")
                                : "-"}
                            </p>
                          </div>
                        </div>

                        {application.employerRemark && (
                          <div className="border-t border-neutral-200 pt-3">
                            <p className="text-xs text-neutral-600">หมายเหตุ</p>
                            <p className="mt-1 text-sm text-black">
                              {application.employerRemark}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* View student */}
                      <button
                        type="button"
                        onClick={() =>
                          isViewing
                            ? handleCloseStudent()
                            : handleViewStudent(application.applicationId)
                        }
                        disabled={
                          loadingStudentId === application.applicationId
                        }
                        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary bg-white font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingStudentId === application.applicationId ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            กำลังโหลดข้อมูล
                          </>
                        ) : isViewing ? (
                          <>
                            <FaTimes />
                            ซ่อนข้อมูลนักศึกษา
                          </>
                        ) : (
                          <>
                            <FaEye />
                            ดูข้อมูลนักศึกษา
                          </>
                        )}
                      </button>

                      {/* Student information */}
                      {isViewing && (
                        <div className="mt-5 rounded-[2rem] border border-neutral-300 bg-white p-6">
                          <div className="mb-7 flex flex-col items-center border-b border-neutral-200 pb-7">
                            <Avatar
                              src={selectedStudent.profileImage}
                              alt="รูปโปรไฟล์นักศึกษา"
                              className="h-28 w-28"
                              iconClass="text-5xl"
                            />
                            <h3 className="mt-4 text-xl font-bold text-black">
                              {selectedStudent.firstName || "-"}{" "}
                              {selectedStudent.lastName || ""}
                            </h3>
                            <p className="mt-1 text-sm text-neutral-600">
                              นักศึกษา
                            </p>
                          </div>

                          <h3 className="mb-5 text-xl font-bold text-primary">
                            ข้อมูลส่วนตัวนักศึกษา
                          </h3>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem
                              icon={<FaUser />}
                              label="ชื่อ - นามสกุล"
                              value={`${selectedStudent.firstName || ""} ${
                                selectedStudent.lastName || ""
                              }`.trim()}
                            />
                            <InfoItem
                              icon={<FaIdCard />}
                              label="รหัสนักศึกษา"
                              value={selectedStudent.studentCode}
                            />
                            <InfoItem
                              icon={<FaPhone />}
                              label="เบอร์โทรศัพท์"
                              value={selectedStudent.phone}
                            />
                            <InfoItem
                              icon={<FaEnvelope />}
                              label="อีเมล"
                              value={selectedStudent.email}
                            />
                            <InfoItem
                              icon={<FaGraduationCap />}
                              label="คณะ"
                              value={selectedStudent.faculty}
                            />
                            <InfoItem
                              icon={<FaBook />}
                              label="สาขา"
                              value={selectedStudent.major}
                            />
                            <InfoItem
                              icon={<FaCalendarAlt />}
                              label="ชั้นปี"
                              value={
                                selectedStudent.yearOfStudy
                                  ? `ปี ${selectedStudent.yearOfStudy}`
                                  : "-"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* Review buttons */}
                      {application.status === "PENDING" && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleStartReview(
                                application.applicationId,
                                "ACCEPTED",
                              )
                            }
                            className="flex h-12 items-center justify-center gap-2 rounded-full bg-green-600 font-semibold text-white transition hover:bg-green-700"
                          >
                            <FaCheck />
                            รับผู้สมัคร
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStartReview(
                                application.applicationId,
                                "REJECTED",
                              )
                            }
                            className="flex h-12 items-center justify-center gap-2 rounded-full bg-red-500 font-semibold text-white transition hover:bg-red-600"
                          >
                            <FaTimes />
                            ปฏิเสธ
                          </button>
                        </div>
                      )}

                      {/* Review form */}
                      {reviewingId === application.applicationId && (
                        <div className="mt-5 rounded-2xl border border-neutral-300 bg-neutral-50 p-5">
                          <h3 className="font-semibold text-black">
                            {application.pendingReviewStatus === "ACCEPTED"
                              ? "ยืนยันการรับผู้สมัคร"
                              : "ยืนยันการปฏิเสธผู้สมัคร"}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-600">
                            {application.pendingReviewStatus === "ACCEPTED"
                              ? "สามารถเพิ่มหมายเหตุเพิ่มเติมได้"
                              : "กรุณาระบุเหตุผลในการปฏิเสธผู้สมัคร"}
                          </p>

                          <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder={
                              application.pendingReviewStatus === "REJECTED"
                                ? "กรุณาระบุเหตุผลในการปฏิเสธ"
                                : "หมายเหตุเพิ่มเติม (ถ้ามี)"
                            }
                            aria-label="หมายเหตุ"
                            rows={4}
                            className="mt-4 w-full resize-none rounded-3xl border border-neutral-600 bg-white px-5 py-4 text-sm text-black outline-none placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50"
                          />

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleReview(application)}
                              className="h-12 rounded-full border border-black bg-primary font-semibold text-white transition hover:bg-primary-dark"
                            >
                              ยืนยัน
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelReview}
                              className="h-12 rounded-full border border-neutral-400 bg-white font-semibold text-black transition hover:bg-neutral-100"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default EmployerApplications;
