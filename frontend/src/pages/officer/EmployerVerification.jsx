import { useEffect, useState } from "react";

import {
  FaBuilding,
  FaCheck,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getEmployersByStatus,
  verifyEmployer,
} from "../../services/officerApi";

function EmployerVerification({
  user,
  currentPage,
  onBack,
  onNavigate,
  onLogout,
}) {
  // เก็บรายการผู้ประกอบการที่รอตรวจสอบ
  const [employers, setEmployers] = useState([]);

  // เก็บผู้ประกอบการที่เลือกตรวจสอบ
  const [selectedEmployer, setSelectedEmployer] = useState(null);

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

  // โหลดรายการผู้ประกอบการที่รอตรวจสอบ
  async function loadEmployers() {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployersByStatus(officerUserId, "PENDING");

      setEmployers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // โหลดข้อมูลเมื่อเปิดหน้า
  useEffect(() => {
    loadEmployers();
  }, []);

  // เลือกผู้ประกอบการเพื่อดูรายละเอียด
  function handleSelect(employer) {
    setSelectedEmployer(employer);
    setRemark("");
    setError("");
    setMessage("");
  }

  // จัดการการอนุมัติหรือปฏิเสธผู้ประกอบการ
  async function handleVerify(status) {
    if (!selectedEmployer) {
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
        ? "ยืนยันการอนุมัติผู้ประกอบการ?"
        : "ยืนยันการปฏิเสธผู้ประกอบการ?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await verifyEmployer(
        officerUserId,
        selectedEmployer.employerId,
        {
          status,
          remark: remark.trim(),
        },
      );

      setMessage(
        status === "APPROVED"
          ? "อนุมัติผู้ประกอบการเรียบร้อยแล้ว"
          : "ปฏิเสธผู้ประกอบการเรียบร้อยแล้ว",
      );

      setSelectedEmployer(null);
      setRemark("");

      await loadEmployers();
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
        currentPage={currentPage || "verification"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* หัวข้อหน้า */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            ตรวจสอบผู้ประกอบการ
          </h1>

          <p className="mt-2 text-sm text-neutral-600">
            ตรวจสอบข้อมูลและดำเนินการอนุมัติหรือปฏิเสธผู้ประกอบการ
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
            {/* รายการผู้ประกอบการ */}
            <section className="self-start rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    ผู้ประกอบการรอตรวจสอบ
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    จำนวน {employers.length} รายการ
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FaBuilding />
                </div>
              </div>

              {employers.length === 0 ? (
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
                  <FaBuilding className="mx-auto mb-3 text-3xl text-neutral-400" />

                  <p className="text-neutral-600">
                    ไม่มีผู้ประกอบการที่รอตรวจสอบ
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {employers.map((employer) => {
                    const isSelected =
                      selectedEmployer?.employerId === employer.employerId;

                    return (
                      <button
                        type="button"
                        key={employer.employerId}
                        onClick={() => handleSelect(employer)}
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
                            <FaBuilding />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-black">
                              {employer.companyName}
                            </h3>

                            <p className="mt-1 text-sm text-neutral-600">
                              ผู้ติดต่อ: {employer.contactName}
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

            {/* รายละเอียดผู้ประกอบการ */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {!selectedEmployer ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                    <FaBuilding />
                  </div>

                  <h2 className="text-xl font-bold text-primary">
                    รายละเอียดผู้ประกอบการ
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    เลือกผู้ประกอบการจากรายการเพื่อดูรายละเอียด
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl text-primary">
                      <FaBuilding />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-primary">
                        รายละเอียดผู้ประกอบการ
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        ตรวจสอบข้อมูลก่อนดำเนินการ
                      </p>
                    </div>
                  </div>

                  {/* ข้อมูลผู้ประกอบการ */}
                  <div className="space-y-4">
                    <InfoItem
                      icon={<FaBuilding />}
                      label="บริษัท"
                      value={selectedEmployer.companyName}
                    />

                    <InfoItem
                      icon={<FaUser />}
                      label="ผู้ติดต่อ"
                      value={selectedEmployer.contactName}
                    />

                    <InfoItem
                      icon={<FaPhone />}
                      label="โทรศัพท์"
                      value={selectedEmployer.phone}
                    />

                    <InfoItem
                      icon={<FaEnvelope />}
                      label="Email"
                      value={selectedEmployer.email}
                    />

                    <InfoItem
                      icon={<FaMapMarkerAlt />}
                      label="ที่อยู่"
                      value={selectedEmployer.address}
                    />

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                      <p className="mb-2 text-sm font-semibold text-black">
                        รายละเอียดบริษัท
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-600">
                        {selectedEmployer.companyDescription ||
                          "ไม่มีข้อมูล"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                      <span className="text-sm font-semibold text-black">
                        สถานะการตรวจสอบ
                      </span>

                      <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                        {selectedEmployer.verificationStatus}
                      </span>
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

export default EmployerVerification;