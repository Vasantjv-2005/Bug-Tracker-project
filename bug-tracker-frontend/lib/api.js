const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "https://bug-tracker-project-6.onrender.com";

const apiRequest = async (endpoint, method = "GET", body = null) => {
  // Prevent API calls during server-side rendering
  if (typeof window === "undefined") {
    throw new Error("API calls are not supported during server-side rendering");
  }

  try {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`Response status: ${res.status}`);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${res.status}: ${res.statusText}`;
      console.error("API Error Response:", errorData);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("API Success Response:", data);
    return data;
  } catch (error) {
    console.error("API Request Failed:", {
      endpoint,
      method,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const api = {
  register: (data) => apiRequest("/api/auth/register", "POST", data),
  login: (data) => apiRequest("/api/auth/login", "POST", data),
  getCurrentUser: () => apiRequest("/api/auth/me"),
  createProject: (data) => apiRequest("/api/projects", "POST", data),
  getProjects: () => apiRequest("/api/projects"),
  getProject: (id) => apiRequest(`/api/projects/${id}`),
  createIssue: (data) => apiRequest("/api/issues", "POST", data),
  getIssues: (projectId) => apiRequest(`/api/issues?projectId=${projectId}`),
  getIssue: (id) => apiRequest(`/api/issues/${id}`),
  updateIssue: (id, data) => apiRequest(`/api/issues/${id}`, "PUT", data),
  createComment: (data) => apiRequest("/api/comments", "POST", data),
  getComments: (issueId) => apiRequest(`/api/comments/${issueId}`),
  getComment: (id) => apiRequest(`/api/comments/${id}`),
};

export default api;