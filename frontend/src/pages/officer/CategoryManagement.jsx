import { useEffect, useState } from "react";
import { FaTags, FaPencilAlt, FaTrash, FaTimes, FaPlus } from "react-icons/fa";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/officerApi";

// ค่าเริ่มต้นของฟอร์มหมวดหมู่งาน
const EMPTY_FORM = {
  categoryName: "",
  description: "",
};

const fieldClass =
  "flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";

const inputClass =
  "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400";

// ฟอร์มเพิ่มและแก้ไขหมวดหมู่งาน
function CategoryForm({
  isEditing,
  form,
  onChange,
  onSubmit,
  onCancel,
  error,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-primary">
          {isEditing ? "แก้ไขหมวดหมู่งาน" : "เพิ่มหมวดหมู่งานใหม่"}
        </h2>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="ยกเลิกการแก้ไข"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700"
        >
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* ชื่อหมวดหมู่ */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            ชื่อหมวดหมู่งาน <span className="text-red-500">*</span>
          </label>

          <div className={fieldClass}>
            <FaTags className="shrink-0 text-slate-400 text-sm" />
            <input
              type="text"
              name="categoryName"
              value={form.categoryName}
              onChange={onChange}
              placeholder="เช่น ร้านอาหารและเครื่องดื่ม, งานเอกสาร/สำนักงาน"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* คำอธิบาย */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            คำอธิบายรายละเอียด
          </label>

          <div className="rounded-xl border border-slate-300 bg-white p-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={onChange}
              placeholder="อธิบายลักษณะงานทั่วไปในหมวดหมู่นี้..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark"
          >
            {isEditing ? "บันทึกการแก้ไข" : "เพิ่มหมวดหมู่"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// หน้าจัดการหมวดหมู่งานสำหรับเจ้าหน้าที่มหาวิทยาลัย
function CategoryManagement({
  user,
  currentPage,
  onBack,
  onNavigate,
  onLogout,
}) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // โหลดรายการหมวดหมู่งานทั้งหมด
  async function loadCategories() {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดหมวดหมู่งานได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // จัดการเปลี่ยนค่าฟอร์ม
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

  // ส่งฟอร์มสร้างหรือแก้ไขหมวดหมู่
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.categoryName.trim()) {
      setError("กรุณากรอกชื่อหมวดหมู่งาน");
      return;
    }

    const payload = {
      categoryName: form.categoryName.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        await updateCategory(editingId, payload);
        setMessage("แก้ไขหมวดหมู่งานเรียบร้อยแล้ว");
      } else {
        await createCategory(payload);
        setMessage("เพิ่มหมวดหมู่งานเรียบร้อยแล้ว");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    }
  }

  // เริ่มแก้ไขหมวดหมู่
  function handleEdit(category) {
    setEditingId(category.categoryId);
    setForm({
      categoryName: category.categoryName || "",
      description: category.description || "",
    });
    setMessage("");
    setError("");
  }

  // ลบหมวดหมู่งาน
  async function handleDelete(categoryId) {
    const confirmed = window.confirm("ต้องการลบหมวดหมู่งานนี้หรือไม่?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteCategory(categoryId);
      setMessage("ลบหมวดหมู่งานเรียบร้อยแล้ว");

      if (editingId === categoryId) {
        resetForm();
      }

      await loadCategories();
    } catch (err) {
      setError(err.message || "ไม่สามารถลบหมวดหมู่ได้");
    }
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
        role="OFFICER"
        currentPage={currentPage || "categories"}
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
              กลับ
            </button>
            <div>
              <h1 className="text-2xl font-bold text-primary md:text-3xl">
                จัดการหมวดหมู่งานพาร์ตไทม์
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                กำหนดหมวดหมู่งานเพื่อให้ผู้ประกอบการและนักศึกษาค้นหาได้ง่าย
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {message && (
          <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
            {message}
          </div>
        )}

        {/* Error Alert */}
        {error && !editingId && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs font-semibold text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-base text-slate-500">กำลังโหลดหมวดหมู่...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
            {/* ฝั่งซ้าย: ฟอร์ม */}
            <div className="self-start">
              <CategoryForm
                isEditing={editingId !== null}
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                error={error}
              />
            </div>

            {/* ฝั่งขวา: รายการหมวดหมู่ */}
            <section>
              <h2 className="mb-3 text-base font-bold text-slate-800">
                หมวดหมู่งานทั้งหมดในระบบ ({categories.length})
              </h2>

              <div className="space-y-3">
                {categories.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <FaTags className="mx-auto mb-3 text-4xl text-slate-300" />
                    <p className="text-base font-bold text-slate-700">
                      ยังไม่มีหมวดหมู่งาน
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      เพิ่มหมวดหมู่แรกผ่านแบบฟอร์มด้านซ้าย
                    </p>
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat.categoryId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FaTags />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {cat.categoryName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {cat.description || "ไม่มีคำอธิบายเพิ่มเติม"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          aria-label="แก้ไข"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-amber-600 hover:bg-amber-50"
                        >
                          <FaPencilAlt size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(cat.categoryId)}
                          aria-label="ลบ"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  ))
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

export default CategoryManagement;
