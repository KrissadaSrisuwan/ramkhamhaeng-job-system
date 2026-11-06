const API_URL = "http://localhost:8080/api/students";

// ==========================================
// STUDENT PROFILE
// ==========================================

// ดูข้อมูลส่วนตัวของนักศึกษา
export async function getStudentProfile(userId) {
  const response = await fetch(`${API_URL}/${userId}/profile`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดข้อมูลนักศึกษาได้");
  }

  return result;
}

// อัปเดตข้อมูลส่วนตัวและรูปโปรไฟล์ของนักศึกษา
export async function updateStudentProfile(userId, data) {
  const formData = new FormData();

  formData.append("firstName", data.firstName || "");
  formData.append("lastName", data.lastName || "");
  formData.append("phone", data.phone || "");
  formData.append("email", data.email || "");
  formData.append("faculty", data.faculty || "");
  formData.append("major", data.major || "");

  if (data.yearOfStudy !== null && data.yearOfStudy !== undefined) {
    formData.append("yearOfStudy", data.yearOfStudy);
  }

  if (data.profileFile) {
    formData.append("profileImage", data.profileFile);
  }

  const response = await fetch(`${API_URL}/${userId}/profile`, {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถแก้ไขข้อมูลนักศึกษาได้");
  }

  return result;
}

// ==========================================
// AVAILABILITY (FR-02)
// ==========================================

// ดึงรายการช่วงเวลาว่างที่ลงทะเบียนไว้ของนักศึกษา
export async function getAvailabilities(userId) {
  const response = await fetch(`${API_URL}/${userId}/availabilities`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดช่วงเวลาว่างได้");
  }

  return result;
}

// เพิ่มช่วงเวลาว่างใหม่
export async function createAvailability(userId, data) {
  const response = await fetch(`${API_URL}/${userId}/availabilities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถเพิ่มช่วงเวลาว่างได้");
  }

  return result;
}

// แก้ไขช่วงเวลาว่างเดิม
export async function updateAvailability(userId, availabilityId, data) {
  const response = await fetch(
    `${API_URL}/${userId}/availabilities/${availabilityId}`,
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
    throw new Error(result.message || "ไม่สามารถแก้ไขช่วงเวลาว่างได้");
  }

  return result;
}

// ลบช่วงเวลาว่าง
export async function deleteAvailability(userId, availabilityId) {
  const response = await fetch(
    `${API_URL}/${userId}/availabilities/${availabilityId}`,
    {
      method: "DELETE",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถลบช่วงเวลาว่างได้");
  }

  return result;
}

// ==========================================
// JOB & APPLICATION (FR-02, FR-03, NFR-01)
// ==========================================

// ค้นหาและกรองงาน (รองรับการกรองตามชื่อ, หมวดหมู่, พื้นที่ และช่วงเวลาว่าง)
export async function searchJobs(
  userId,
  title = "",
  filterByAvailability = false,
  categoryId = "",
  location = "",
) {
  const params = new URLSearchParams();

  if (title && title.trim() !== "") {
    params.append("title", title.trim());
  }

  if (filterByAvailability) {
    params.append("filterByAvailability", "true");
  }

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  if (location && location.trim() !== "" && location !== "ALL") {
    params.append("location", location.trim());
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_URL}/${userId}/jobs?${queryString}`
    : `${API_URL}/${userId}/jobs`;

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถค้นหางานได้");
  }

  return result;
}

// ดูรายละเอียดงานพาร์ตไทม์
export async function getJobDetail(userId, jobId) {
  const response = await fetch(`${API_URL}/${userId}/jobs/${jobId}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดรายละเอียดงานได้");
  }

  return result;
}

// สมัครงานพาร์ตไทม์
export async function applyJob(userId, jobId) {
  const response = await fetch(
    `${API_URL}/${userId}/jobs/${jobId}/applications`,
    {
      method: "POST",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถสมัครงานได้");
  }

  return result;
}

// โหลดประวัติและสถานะการสมัครงานของนักศึกษา
export async function getMyApplications(userId) {
  const response = await fetch(`${API_URL}/${userId}/applications`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดสถานะการสมัครได้");
  }

  return result;
}
