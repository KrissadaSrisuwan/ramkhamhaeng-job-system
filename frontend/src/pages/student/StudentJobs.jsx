import { useEffect, useState } from "react";
import {
  FaSearch,
  FaBriefcase,
  FaBuilding,
  FaTags,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaArrowLeft,
  FaCheckCircle,
  FaFilter,
  FaTimes,
  FaBolt,
} from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { searchJobs } from "../../services/studentApi";
import { getCategories } from "../../services/officerApi";

// ตัวเลือกพื้นที่ยอดนิยมบริเวณมหาวิทยาลัยรามคำแหงและใกล้เคียง (FR-02)
const LOCATION_OPTIONS = [
  { value: "", label: "ทุกพื้นที่ / ทั่วไป" },
  { value: "หัวหมาก", label: "ม.รามคำแหง 1 (หัวหมาก / บางกะปิ)" },
  { value: "บางนา", label: "ม.รามคำแหง 2 (บางนา / ประเวศ)" },
  { value: "รามคำแหง", label: "ถนนรามคำแหง" },
  { value: "ลาดพร้าว", label: "ลาดพร้าว / เสรีไทย" },
  { value: "พระราม 9", label: "พระราม 9 / คลองตัน" },
  { value: "ออนไลน์", label: "ออนไลน์ / Work from Home" },
];

// หน้าค้นหาและกรองงานสำหรับนักศึกษา (FR-02, NFR-01)
function StudentJobs({
  user,
  currentPage,
  onBack,
  onNavigate,
  onLogout,
  onSelectJob,
}) {
  // รายการประกาศงาน
  const [jobs, setJobs] = useState([]);

  // หมวดหมู่งานทั้งหมดในระบบ
  const [categories, setCategories] = useState([]);

  // ตัวกรองการค้นหา
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filterByAvailability, setFilterByAvailability] = useState(false);

  // สถานะโหลดข้อมูลและข้อผิดพลาด
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // โหลดรายการหมวดหมู่สำหรับตัวกรอง
  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.warn("ไม่สามารถโหลดหมวดหมู่งานได้:", err);
    }
  }

  // โหลดรายการงานตามเงื่อนไขตัวกรอง
  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const data = await searchJobs(
        user.userId,
        title,
        filterByAvailability,
        selectedCategory,
        selectedLocation,
      );

      setJobs(data || []);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดรายการงานได้");
    } finally {
      setLoading(false);
    }
  }

  // โหลดหมวดหมู่และงานเมื่อเปิดหน้าครั้งแรก
  useEffect(() => {
    loadCategories();
    loadJobs();
  }, []);

  // เมื่อเปลี่ยนตัวกรองด่วน (หมวดหมู่, พื้นที่, หรือ Smart Match)
  useEffect(() => {
    loadJobs();
  }, [filterByAvailability, selectedCategory, selectedLocation]);

  // ค้นหาเมื่อส่งแบบฟอร์ม
  function handleSearch(event) {
    event.preventDefault();
    loadJobs();
  }

  // ล้างตัวกรองทั้งหมด
  function handleResetFilters() {
    setTitle("");
    setSelectedCategory("");
    setSelectedLocation("");
    setFilterByAvailability(false);
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
        currentPage={currentPage || "jobs"}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Header & Back Button */}
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
                ค้นหางานพาร์ตไทม์
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                งานพาร์ตไทม์รอบมหาวิทยาลัยรามคำแหงและพื้นที่ใกล้เคียงที่ผ่านการตรวจสอบแล้ว
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Top row: Search input & Submit */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่องาน รายละเอียด หรือชื่อสถานประกอบการ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark"
              >
                <FaSearch />
                ค้นหา
              </button>
            </div>

            {/* Bottom row: Dropdowns & Smart Match Toggle */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category Dropdown */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  หมวดหมู่งาน
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">ทุกหมวดหมู่</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Dropdown */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  พื้นที่ / บริเวณ ม.รามคำแหง (FR-02)
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  <FaTimes />
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            </div>

            {/* Smart Match Toggle (FR-02, NFR-01) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <label className="flex cursor-pointer items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={filterByAvailability}
                  onChange={(e) => setFilterByAvailability(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-primary accent-primary focus:ring-primary"
                />
                <span className="text-sm font-semibold text-slate-800">
                  เปิดใช้งาน Smart Match: แสดงเฉพาะงานที่ตรงกับช่วงเวลาว่างของฉัน
                </span>
              </label>

              {filterByAvailability && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                  <FaBolt className="text-amber-600" />
                  Smart Match กำลังทำงาน
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              รายการงานพาร์ตไทม์ที่เปิดรับสมัคร
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              พบ {jobs.length} ตำแหน่งงานที่ตรงกับเงื่อนไขการค้นหา
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center text-slate-500">
              <FaBriefcase className="mx-auto mb-2 text-3xl animate-bounce text-primary" />
              <p className="text-sm font-medium">กำลังค้นหาตำแหน่งงาน...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FaBriefcase className="mx-auto mb-3 text-4xl text-slate-300" />
            <h3 className="text-lg font-bold text-slate-800">
              ไม่พบงานที่ตรงกับเงื่อนไข
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              ลองเปลี่ยนคำค้นหา หรือปิดตัวกรองเวลาว่างเพื่อดูงานทั้งหมด
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  {/* Job Header */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {job.categoryName || "ทั่วไป"}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                      เปิดรับสมัคร
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900 line-clamp-2">
                    {job.jobTitle}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <FaBuilding className="text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{job.companyName}</span>
                  </p>

                  {/* Info Items */}
                  <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary shrink-0" />
                      <span className="line-clamp-1 font-medium">
                        {job.location || "ไม่ระบุสถานที่"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary shrink-0" />
                      <span>{job.jobDate || "ไม่ระบุวัน"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary shrink-0" />
                      <span>
                        {job.startTime && job.endTime
                          ? `${job.startTime} - ${job.endTime}`
                          : "ไม่ระบุเวลา"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-emerald-700">
                      <FaMoneyBillWave className="shrink-0" />
                      <span>
                        {job.salary ? `${job.salary} บาท` : "ตามตกลง"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detail Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectJob(job.jobId)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
                  >
                    ดูรายละเอียดและสมัคร
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default StudentJobs;
