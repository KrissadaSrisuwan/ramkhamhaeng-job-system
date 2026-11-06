const API_URL = "http://localhost:8080/api/officers";

// =========================
// OFFICER PROFILE
// =========================

// ดูข้อมูลส่วนตัว
export async function getOfficerProfile(userId) {
  const response = await fetch(`${API_URL}/${userId}/profile`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลเจ้าหน้าที่ได้");
  }

  return result;
}

// อัพเดทข้อมูลส่วนตัว
export async function updateOfficerProfile(userId, data) {
  const formData = new FormData();

  formData.append("firstName", data.firstName || "");
  formData.append("lastName", data.lastName || "");
  formData.append("phone", data.phone || "");
  formData.append("email", data.email || "");
  formData.append("position", data.position || "");

  // รูปโปรไฟล์
  if (data.profileFile) {
    formData.append("profileImage", data.profileFile);
  }

  const response = await fetch(`${API_URL}/${userId}/profile`, {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถแก้ไขข้อมูลเจ้าหน้าที่ได้");
  }

  return result;
}

// =========================
// CATEGORIES MANAGEMENT
// =========================

// ดูหมวดหมู่งานทั้งหมด
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดหมวดหมู่งานได้");
  }

  return result;
}

// ดูหมวดหมู่งานตามรหัส
export async function getCategoryById(categoryId) {
  const response = await fetch(`${API_URL}/categories/${categoryId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่พบหมวดหมู่งาน");
  }

  return result;
}

// เพิ่มหมวดหมู่งาน
export async function createCategory(data) {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถเพิ่มหมวดหมู่งานได้");
  }

  return result;
}

// อัพเดทหมวดหมู่งาน
export async function updateCategory(categoryId, data) {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถแก้ไขหมวดหมู่งานได้");
  }

  return result;
}

// ลบหมวดหมู่งาน
export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถลบหมวดหมู่งานได้");
  }

  return result;
}

// =========================
// EMPLOYER VERIFICATION
// =========================

// ดูผู้ประกอบการทั้งหมด
export async function getEmployers(officerUserId) {
  const response = await fetch(`${API_URL}/${officerUserId}/employers`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลผู้ประกอบการได้");
  }

  return result;
}

// ดูผู้ประกอบการตามรหัส
export async function getEmployerById(officerUserId, employerId) {
  const response = await fetch(
    `${API_URL}/${officerUserId}/employers/${employerId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลผู้ประกอบการได้");
  }

  return result;
}

// ดูผู้ประกอบการตามสถานะ
export async function getEmployersByStatus(officerUserId, status) {
  const response = await fetch(
    `${API_URL}/${officerUserId}/employers/status/${status}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลผู้ประกอบการได้");
  }

  return result;
}

// อนุมัติ/ปฏิเสธผู้ประกอบการ
export async function verifyEmployer(officerUserId, employerId, data) {
  const response = await fetch(
    `${API_URL}/${officerUserId}/employers/${employerId}/verification`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถตรวจสอบผู้ประกอบการได้");
  }

  return result;
}

// =========================
// JOB VERIFICATION
// =========================

// ดูประกาศงานทั้งหมด
export async function getOfficerJobs(officerUserId) {
  const response = await fetch(`${API_URL}/${officerUserId}/jobs`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดประกาศงานได้");
  }

  return result;
}

// ดูประกาศงานตามรหัส
export async function getOfficerJobById(officerUserId, jobId) {
  const response = await fetch(`${API_URL}/${officerUserId}/jobs/${jobId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดประกาศงานได้");
  }

  return result;
}

// ดูประกาศงานตามสถานะ
export async function getOfficerJobsByStatus(officerUserId, status) {
  const response = await fetch(
    `${API_URL}/${officerUserId}/jobs/status/${status}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดประกาศงานได้");
  }

  return result;
}

// อนุมัติ/ปฏิเสธงาน
export async function verifyJob(officerUserId, jobId, data) {
  const response = await fetch(
    `${API_URL}/${officerUserId}/jobs/${jobId}/verification`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถตรวจสอบประกาศงานได้");
  }

  return result;
}
