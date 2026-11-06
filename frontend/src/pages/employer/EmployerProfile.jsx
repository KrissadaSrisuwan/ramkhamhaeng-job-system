import { useEffect, useState } from "react";

import {
  FaBuilding,
  FaEnvelope,
  FaFileAlt,
  FaImage,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaTrash,
  FaUser,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";

import {
  getEmployerProfile,
  updateEmployerProfile,
} from "../../services/employerApi";

import { imageUrl } from "../../services/imageApi";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function EmployerProfile({ user, currentPage, onBack, onNavigate, onLogout }) {
  // เก็บข้อมูลโปรไฟล์ผู้ประกอบการ
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    companyDescription: "",
    profileImage: "",
  });

  // เก็บไฟล์รูปโปรไฟล์
  const [profileFile, setProfileFile] = useState(null);

  // เก็บรูปสำหรับแสดง Preview
  const [profilePreview, setProfilePreview] = useState("");

  // เก็บสถานะการยืนยันผู้ประกอบการ
  const [verificationStatus, setVerificationStatus] = useState("");

  // ตรวจสอบสถานะกำลังโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // เก็บสถานะแก้ไขข้อมูล
  const [editing, setEditing] = useState(false);

  // เก็บข้อความสำเร็จ
  const [message, setMessage] = useState("");

  // เก็บข้อความ Error
  const [error, setError] = useState("");

  // โหลดข้อมูลโปรไฟล์เมื่อเปิดหน้า
  useEffect(() => {
    loadProfile();

    // ล้าง Object URL เมื่อออกจากหน้า
    return () => {
      if (profilePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, []);

  // โหลดข้อมูลโปรไฟล์จาก API
  async function loadProfile() {
    try {
      // ดึงข้อมูลโปรไฟล์ผู้ประกอบการ
      const data = await getEmployerProfile(user.userId);

      // นำข้อมูลที่ได้มาแสดง
      setForm({
        companyName: data.companyName || "",
        contactName: data.contactName || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        companyDescription: data.companyDescription || "",
        profileImage: data.profileImage || "",
      });

      // แสดงรูปโปรไฟล์เดิม
      if (data.profileImage) {
        setProfilePreview(imageUrl(data.profileImage));
      } else {
        setProfilePreview("");
      }

      // แสดงสถานะการยืนยัน
      setVerificationStatus(data.verificationStatus || "");
    } catch (err) {
      // แสดงข้อความเมื่อโหลดข้อมูลไม่สำเร็จ
      setError(err.message);
    } finally {
      // สิ้นสุดสถานะกำลังโหลด
      setLoading(false);
    }
  }

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  // จัดการการเลือกรูปโปรไฟล์
  function handleProfileImageChange(e) {
    const file = e.target.files?.[0];

    // ตรวจสอบว่ามีการเลือกไฟล์หรือไม่
    if (!file) {
      return;
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // ล้าง Object URL เดิม
    if (profilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }

    // เก็บไฟล์ที่เลือก
    setProfileFile(file);

    // สร้าง Preview รูป
    setProfilePreview(URL.createObjectURL(file));

    // ล้าง Error
    setError("");
  }

  // จัดการการ Submit แก้ไขข้อมูล
  async function handleSubmit(e) {
    // ป้องกันการ Reload หน้าเว็บ
    e.preventDefault();

    // ล้างข้อความเดิม
    setMessage("");
    setError("");

    try {
      // ส่งข้อมูลโปรไฟล์ที่แก้ไขไป API
      await updateEmployerProfile(user.userId, {
        ...form,
        profileFile,
      });

      // แสดงข้อความเมื่อบันทึกสำเร็จ
      setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");

      // ล้างไฟล์ที่เลือก
      setProfileFile(null);

      // กลับไปโหมดแสดงข้อมูล
      setEditing(false);

      // โหลดข้อมูลล่าสุด
      await loadProfile();
    } catch (err) {
      // แสดงข้อความเมื่อบันทึกไม่สำเร็จ
      setError(err.message);
    }
  }

  // จัดการการลบบัญชี
  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "คุณต้องการลบบัญชีใช่หรือไม่?\nการดำเนินการนี้อาจไม่สามารถย้อนกลับได้",
    );

    if (!confirmed) {
      return;
    }

    // ยังไม่มี API ลบบัญชี
    alert("ฟังก์ชันลบบัญชีกำลังรอเชื่อมต่อ API");
  }

  // แสดงข้อความระหว่างโหลดข้อมูล
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-primary">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar
        user={user}
        role="EMPLOYER"
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {/* หัวข้อ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            ข้อมูลสถานประกอบการ
          </h1>

          <p className="mt-2 text-sm text-neutral-600">
            ตรวจสอบและจัดการข้อมูลสถานประกอบการของคุณ
          </p>
        </div>

        {/* แสดงข้อความสำเร็จ */}
        {message && (
          <div className="mb-5 rounded-xl bg-green-50 px-5 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* แสดงข้อความ Error */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-5 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!editing ? (
          <>
            {/* ส่วนข้อมูลสถานประกอบการ */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {/* รูปโปรไฟล์ */}
              <div className="mb-8 flex flex-col items-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-7xl text-primary" />
                  )}
                </div>

                <h2 className="mt-4 text-xl font-bold text-black">
                  {form.companyName}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">ผู้ประกอบการ</p>
              </div>

              {/* สถานะการยืนยัน */}
              <div className="mb-6 flex items-center gap-4 rounded-2xl bg-neutral-50 px-5 py-4">
                <FaFileAlt className="shrink-0 text-lg text-primary" />

                <div>
                  <p className="text-sm text-neutral-500">
                    สถานะการยืนยันผู้ประกอบการ
                  </p>

                  <p className="mt-1 font-semibold text-black">
                    {verificationStatus || "รอตรวจสอบ"}
                  </p>
                </div>
              </div>

              {/* ข้อมูลสถานประกอบการ */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={<FaBuilding />}
                  label="ชื่อบริษัท / สถานประกอบการ"
                  value={form.companyName}
                />

                <InfoItem
                  icon={<FaUser />}
                  label="ชื่อผู้ติดต่อ"
                  value={form.contactName}
                />

                <InfoItem
                  icon={<FaPhone />}
                  label="เบอร์โทรศัพท์"
                  value={form.phone}
                />

                <InfoItem
                  icon={<FaEnvelope />}
                  label="อีเมล"
                  value={form.email}
                />

                <InfoItem
                  icon={<FaMapMarkerAlt />}
                  label="ที่อยู่"
                  value={form.address}
                  full
                />

                <InfoItem
                  icon={<FaFileAlt />}
                  label="รายละเอียดสถานประกอบการ"
                  value={form.companyDescription}
                  full
                />

                <InfoItem
                  icon={<FaUser />}
                  label="ชื่อผู้ใช้งาน"
                  value={user?.username}
                />
              </div>
            </div>

            {/* ปุ่มจัดการบัญชี */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {/* ปุ่มแก้ไขข้อมูล */}
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setError("");
                  setEditing(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                <FaUserEdit />
                แก้ไขข้อมูลส่วนตัว
              </button>

              {/* ปุ่มเปลี่ยนรหัสผ่าน */}
              <button
                type="button"
                onClick={() => onNavigate?.("change-password")}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary/5"
              >
                <FaLock />
                เปลี่ยนรหัสผ่าน
              </button>

              {/* ปุ่มลบบัญชี */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                <FaTrash />
                ลบบัญชี
              </button>
            </div>

            {/* ปุ่มกลับ */}
            <button
              type="button"
              onClick={onBack}
              className="mt-5 w-full rounded-full border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              กลับหน้าหลัก
            </button>
          </>
        ) : (
          /* Form สำหรับแก้ไขข้อมูล */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-bold text-primary">
              แก้ไขข้อมูลสถานประกอบการ
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* ชื่อบริษัท */}
              <InputField
                label="ชื่อบริษัท / สถานประกอบการ"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                icon={<FaBuilding />}
              />

              {/* ชื่อผู้ติดต่อ */}
              <InputField
                label="ชื่อผู้ติดต่อ"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                icon={<FaUser />}
              />

              {/* เบอร์โทรศัพท์ */}
              <InputField
                label="เบอร์โทรศัพท์"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={<FaPhone />}
              />

              {/* อีเมล */}
              <InputField
                label="อีเมล"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                icon={<FaEnvelope />}
              />

              {/* ที่อยู่ */}
              <TextAreaField
                label="ที่อยู่"
                name="address"
                value={form.address}
                onChange={handleChange}
                icon={<FaMapMarkerAlt />}
              />

              {/* รายละเอียดสถานประกอบการ */}
              <TextAreaField
                label="รายละเอียดสถานประกอบการ"
                name="companyDescription"
                value={form.companyDescription}
                onChange={handleChange}
                icon={<FaFileAlt />}
              />

              {/* รูปโปรไฟล์ */}
              <div className="sm:col-span-2">
                <label className="mb-3 block text-sm font-semibold text-black">
                  รูปโปรไฟล์
                </label>

                {/* แสดงรูป Preview */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-8xl text-primary" />
                    )}
                  </div>
                </div>

                {/* เลือกรูปจากเครื่อง */}
                <div className="flex items-center gap-3">
                  <FaImage className="shrink-0 text-lg text-neutral-500" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="w-full rounded-full border border-black bg-white px-5 py-3 text-sm text-black file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-5 file:py-2 file:font-semibold file:text-white hover:file:bg-primary-dark"
                  />
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  รองรับไฟล์รูปภาพ เช่น JPG และ PNG
                </p>
              </div>
            </div>

            {/* ปุ่มบันทึก / ยกเลิก */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* ปุ่มบันทึก */}
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                บันทึกข้อมูล
              </button>

              {/* ปุ่มยกเลิก */}
              <button
                type="button"
                onClick={() => {
                  if (profilePreview?.startsWith("blob:")) {
                    URL.revokeObjectURL(profilePreview);
                  }

                  setEditing(false);
                  setError("");
                  setMessage("");
                  setProfileFile(null);

                  setProfilePreview(
                    form.profileImage ? imageUrl(form.profileImage) : "",
                  );
                }}
                className="flex-1 rounded-full border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

// แสดงข้อมูลแต่ละรายการ
function InfoItem({ icon, label, value, full = false }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl bg-neutral-50 px-5 py-4 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <span className="shrink-0 text-lg text-primary">{icon}</span>

      <div>
        <p className="text-sm text-neutral-500">{label}</p>

        <p className="mt-1 whitespace-pre-line font-semibold text-black">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

// ช่องกรอกข้อมูล
function InputField({ label, name, value, onChange, type = "text", icon }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <div className="flex h-14 w-full items-center gap-4 rounded-full border border-black bg-white px-7 focus-within:ring-2 focus-within:ring-primary/50">
        <span className="shrink-0 text-neutral-500">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-base text-black outline-none placeholder:text-black"
        />
      </div>
    </div>
  );
}

// ช่องกรอกข้อความหลายบรรทัด
function TextAreaField({ label, name, value, onChange, icon }) {
  return (
    <div className="sm:col-span-2">
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <div className="flex items-start gap-4 rounded-3xl border border-black bg-white px-7 py-4 focus-within:ring-2 focus-within:ring-primary/50">
        <span className="mt-1 shrink-0 text-neutral-500">{icon}</span>

        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          className="w-full resize-none bg-transparent text-base text-black outline-none placeholder:text-black"
        />
      </div>
    </div>
  );
}

export default EmployerProfile;
