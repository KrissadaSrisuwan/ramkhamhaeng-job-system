const API_URL = "http://localhost:8080/api/complaints";

// =========================
// COMPLAINT
// =========================

// ส่งเรื่องร้องเรียน
export async function createComplaint(userId, data) {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถส่งเรื่องร้องเรียนได้");
  }

  return result;
}

// โหลดเรื่องร้องเรียนของผู้ใช้
export async function getMyComplaints(userId) {
  const response = await fetch(`${API_URL}/${userId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดเรื่องร้องเรียนได้");
  }

  return result;
}

// โหลดรายละเอียดเรื่องร้องเรียน
export async function getMyComplaint(userId, complaintId) {
  const response = await fetch(`${API_URL}/${userId}/${complaintId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "ไม่สามารถโหลดรายละเอียดเรื่องร้องเรียนได้",
    );
  }

  return result;
}

// =========================
// OFFICER
// =========================

// โหลดเรื่องร้องเรียนทั้งหมด
export async function getAllComplaints(officerUserId) {
  const response = await fetch(`${API_URL}/officer/${officerUserId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดเรื่องร้องเรียนได้");
  }

  return result;
}

// โหลดเรื่องร้องเรียนตามสถานะ
export async function getComplaintsByStatus(officerUserId, status) {
  const response = await fetch(
    `${API_URL}/officer/${officerUserId}/status/${status}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถโหลดเรื่องร้องเรียนได้");
  }

  return result;
}

// โหลดรายละเอียดเรื่องร้องเรียนสำหรับเจ้าหน้าที่
export async function getComplaintById(officerUserId, complaintId) {
  const response = await fetch(
    `${API_URL}/officer/${officerUserId}/${complaintId}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "ไม่สามารถโหลดรายละเอียดเรื่องร้องเรียนได้",
    );
  }

  return result;
}

// เปลี่ยนสถานะเรื่องร้องเรียน
export async function updateComplaintStatus(officerUserId, complaintId, data) {
  const response = await fetch(
    `${API_URL}/officer/${officerUserId}/${complaintId}/status`,
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
    throw new Error(
      result.message || "ไม่สามารถเปลี่ยนสถานะเรื่องร้องเรียนได้",
    );
  }

  return result;
}
