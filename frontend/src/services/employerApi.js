const API_URL = "http://localhost:8080/api/employers";

// =========================
// EMPLOYER PROFILE
// =========================

// ดูข้อมูลส่วนตัว
export async function getEmployerProfile(userId) {
  const response = await fetch(`${API_URL}/${userId}/profile`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลผู้ประกอบการได้");
  }

  return result;
}

// อัพเดทข้อมูลส่วนตัว
export async function updateEmployerProfile(userId, data) {
  const formData = new FormData();

  // ข้อมูลสถานประกอบการ
  formData.append("companyName", data.companyName || "");
  formData.append("contactName", data.contactName || "");
  formData.append("phone", data.phone || "");
  formData.append("email", data.email || "");
  formData.append("address", data.address || "");
  formData.append("companyDescription", data.companyDescription || "");

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
    throw new Error(result.message || "ไม่สามารถแก้ไขข้อมูลผู้ประกอบการได้");
  }

  return result;
}

// ========================================
// MANAGE JOBS
// ========================================

// ดูประกาศงานทั้งหมด
export async function getMyJobs(userId) {
  const response = await fetch(`${API_URL}/${userId}/jobs`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดงานได้");
  }

  return result;
}

// เพิ่มประกาศงาน
export async function createJob(userId, data) {
  const response = await fetch(`${API_URL}/${userId}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถสร้างงานได้");
  }

  return result;
}

// อัพเดทประกาศงาน
export async function updateJob(userId, jobId, data) {
  const response = await fetch(`${API_URL}/${userId}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถแก้ไขงานได้");
  }

  return result;
}

// เปิดรับสมัคร
export async function openJob(userId, jobId) {
  const response = await fetch(`${API_URL}/${userId}/jobs/${jobId}/open`, {
    method: "PUT",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถเปิดงานได้");
  }

  return result;
}

// ปิดรับสมัคร
export async function closeJob(userId, jobId) {
  const response = await fetch(`${API_URL}/${userId}/jobs/${jobId}/close`, {
    method: "PUT",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถปิดงานได้");
  }

  return result;
}

// ลบประกาศงาน
export async function deleteJob(userId, jobId) {
  const response = await fetch(`${API_URL}/${userId}/jobs/${jobId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถลบงานได้");
  }

  return result;
}

// ========================================
// MANAGE APPLICATION
// ========================================

// โหลดผู้สมัครของงานที่ผู้ประกอบการเป็นเจ้าของ
export async function getJobApplications(userId, jobId) {
  const response = await fetch(
    `${API_URL}/${userId}/jobs/${jobId}/applications`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลผู้สมัครได้");
  }

  return result;
}

// โหลดข้อมูลนักศึกษาจากใบสมัคร
export async function getApplicantStudent(userId, applicationId) {
  const response = await fetch(
    `${API_URL}/${userId}/applications/${applicationId}/student`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลนักศึกษาได้");
  }

  return result;
}

// อนุมัติหรือปฏิเสธใบสมัคร
export async function reviewApplication(
  userId,
  applicationId,
  status,
  employerRemark,
) {
  const response = await fetch(
    `${API_URL}/${userId}/applications/${applicationId}/review`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        employerRemark,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถจัดการใบสมัครได้");
  }

  return result;
}
