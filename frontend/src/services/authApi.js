const API_URL = "http://localhost:8080/api/auth";

// =========================
// AUTH
// =========================

// สมัครสมาชิก
export async function registerUser(data) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถสมัครสมาชิกได้");
  }

  return result;
}

// เข้าสู่ระบบ
export async function loginUser(data) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถเข้าสู่ระบบได้");
  }

  return result;
}

// =========================
// CHANGE PASSWORD
// =========================

// เปลี่ยนรหัสผ่าน
export async function changePassword(userId, data) {
  const response = await fetch(`${API_URL}/${userId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
  }

  return result;
}
