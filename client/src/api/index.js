import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30s — covers Nvidia NIM latency
});

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap data field on success; surface clean error message on failure
api.interceptors.response.use(
  (res) => res.data.data,
  (err) => {
    const message = err.response?.data?.error || "Something went wrong";

    // 401 → clear token and redirect to auth
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }

    return Promise.reject(new Error(message));
  }
);

// ─── Portfolio endpoints ──────────────────────────────────────────

export const portfolioApi = {
  /** Verify + AI-analyse a GitHub repo URL */
  verify: (repoUrl) => api.post("/portfolio/verify", { repo_url: repoUrl }),

  /** Fetch all portfolio items for a user */
  getAll: (userId) => api.get(`/portfolio/${userId}`),

  /** Remove a portfolio item */
  remove: (id) => api.delete(`/portfolio/${id}`),
};

export default api;
