const API_BASE = "http://localhost:8080";

// แปลง path รูปโปรไฟล์เป็น URL เต็ม
export function imageUrl(path) {
  return path
    ? path.startsWith("http")
      ? path
      : `${API_BASE}${path}`
    : "";
}
