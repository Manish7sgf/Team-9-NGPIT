import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 60000, // 60s — Nvidia NIM can be slow on first call
});

// Attach JWT if available (optional for demo mode)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap data on success; surface clean error message on failure
api.interceptors.response.use(
  (res) => res.data.data,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ─── Portfolio endpoints ──────────────────────────────────────────

export const portfolioApi = {
  verify: (repoUrl) => api.post("/portfolio/verify", { repo_url: repoUrl }),
  getAll: (userId) => api.get(`/portfolio/${userId}`),
  remove: (id) => api.delete(`/portfolio/${id}`),
};

export default api;
