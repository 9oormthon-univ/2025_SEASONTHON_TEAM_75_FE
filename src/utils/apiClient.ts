import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 세션 깨우기용 (토큰 불러오기)
export async function wakeSession() {
  try {
    await apiClient.get("/api/v1/users/my/districts", {
      params: { _: Date.now() },
      headers: { "Cache-Control": "no-cache" },
    });
    console.log("세션 깨우기 성공");
  } catch {
    console.log("세션 깨우기 실패");
  }
}

export default apiClient;
