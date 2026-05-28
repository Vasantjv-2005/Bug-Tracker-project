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
  register: (data) => apiRequest("/auth/register", "POST", data),
  login: (data) => apiRequest("/auth/login", "POST", data),
  getCurrentUser: () => apiRequest("/auth/me"),
  createProject: (data) => apiRequest("/projects", "POST", data),
  getProjects: () => apiRequest("/projects"),
  getProject: (id) => apiRequest(`/projects/${id}`),
  createIssue: (data) => apiRequest("/issues", "POST", data),
  getIssues: (projectId) => apiRequest(`/issues?projectId=${projectId}`),
  getIssue: (id) => apiRequest(`/issues/${id}`),
  updateIssue: (id, data) => apiRequest(`/issues/${id}`, "PUT", data),
  createComment: (data) => apiRequest("/comments", "POST", data),
  getComments: (issueId) => apiRequest(`/comments/${issueId}`),
  getComment: (id) => apiRequest(`/comments/${id}`),
};

export default api;